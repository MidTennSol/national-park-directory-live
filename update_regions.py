import os
import json
import time
import argparse
from dotenv import load_dotenv
import openai
import requests
from tqdm import tqdm

# Load environment variables
load_dotenv()

# Parse command line arguments early to get API key
parser = argparse.ArgumentParser(description="Update National Park regions in Airtable using AI")
parser.add_argument("--test", action="store_true", help="Run in test mode without updating Airtable")
parser.add_argument("--limit", type=int, help="Limit the number of parks to process")
parser.add_argument("--id", type=str, help="Process only a specific park by Airtable record ID")
parser.add_argument("--name", type=str, help="Process only parks matching this name (case-insensitive partial match)")
parser.add_argument("--force", action="store_true", help="Force region reassignment even if already set")
parser.add_argument("--api-key", type=str, help="OpenAI API key (overrides env variable)")
parser.add_argument("--model", type=str, default="gpt-4o", help="OpenAI model to use (default: gpt-4o)")

args, _ = parser.parse_known_args()  # Parse known args to get API key

# Airtable API configuration
AIRTABLE_TOKEN = os.getenv("AIRTABLE_TOKEN") or "patWxqsOH8eCEVx7Y.2e2fa79f47ca86b071c4b5114ceed5a5f9d8124d162bec76b2109882bb0625f2"
AIRTABLE_BASE_ID = os.getenv("AIRTABLE_BASE_ID") or "appJLgVdJISZ38p3R"
AIRTABLE_TABLE_NAME = os.getenv("AIRTABLE_TABLE_NAME") or "national-parks"

# OpenAI configuration
OPENAI_API_KEY = args.api_key or os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    raise ValueError("OpenAI API key is required. Provide it via --api-key parameter or OPENAI_API_KEY environment variable.")

# Configure OpenAI client
client = openai.OpenAI(api_key=OPENAI_API_KEY)

# US Geographic Regions with corresponding states - updated to match Airtable's options
REGION_MAPPING = {
    "Northeast": ["Maine", "New Hampshire", "Vermont", "Massachusetts", "Rhode Island", "Connecticut", "New York", "New Jersey", "Pennsylvania"],
    "Midwest": ["Ohio", "Michigan", "Indiana", "Wisconsin", "Illinois", "Minnesota", "Iowa", "Missouri", "North Dakota", "South Dakota", "Nebraska", "Kansas"],
    "South": ["Delaware", "Maryland", "Virginia", "West Virginia", "Kentucky", "North Carolina", "South Carolina", "Tennessee", "Georgia", "Florida", "Alabama", "Mississippi", "Arkansas", "Louisiana", "Oklahoma", "Texas"],
    "West": ["Colorado", "Wyoming", "Montana", "Idaho", "Utah", "Nevada", "Washington", "Oregon", "California", "Arizona", "New Mexico"],
    "Territories": ["Alaska", "Hawaii", "Puerto Rico", "Guam", "American Samoa", "U.S. Virgin Islands", "Northern Mariana Islands"]
}

# Just the region names for easier reference
REGIONS = list(REGION_MAPPING.keys())

def fetch_parks(offset=None, limit=None):
    """Fetch parks from Airtable with pagination support"""
    url = f"https://api.airtable.com/v0/{AIRTABLE_BASE_ID}/{AIRTABLE_TABLE_NAME}"
    
    params = {
        "pageSize": min(limit, 100) if limit else 100  # Airtable maximum
    }
    
    if offset:
        params["offset"] = offset
    
    headers = {
        "Authorization": f"Bearer {AIRTABLE_TOKEN}",
        "Content-Type": "application/json"
    }
    
    response = requests.get(url, headers=headers, params=params)
    
    if not response.ok:
        print(f"Error fetching data: {response.status_code} {response.text}")
        return [], None
    
    data = response.json()
    return data.get("records", []), data.get("offset")

def get_region_by_states(states_list):
    """Try to determine a region based on the states a park is located in"""
    if not states_list:
        return None
        
    region_counts = {region: 0 for region in REGIONS}
    
    for state in states_list:
        for region, states in REGION_MAPPING.items():
            if state in states:
                region_counts[region] += 1
    
    # Find the region with the most states
    max_count = 0
    best_region = None
    for region, count in region_counts.items():
        if count > max_count:
            max_count = count
            best_region = region
    
    return best_region if max_count > 0 else None

def determine_region(park_data, test_mode=False, model="gpt-4o"):
    """Use AI to determine the region of a park based on its data"""
    fields = park_data.get("fields", {})
    park_name = fields.get("Name", "Unknown Park")
    states_string = fields.get("States", "")
    states_multi = fields.get("States (Multi)", [])
    lat = fields.get("Latitude", "")
    lon = fields.get("Longitude", "")
    description = fields.get("Description", "")
    
    # If region is already set and not in test mode, return it
    # Note: Region is now a multi-select field, so it's an array
    existing_region = fields.get("Region", [])
    if existing_region and not test_mode:
        print(f"Park '{park_name}' already has region: {existing_region}")
        return existing_region[0] if isinstance(existing_region, list) and existing_region else existing_region
    
    # If in test mode and region exists, track it for comparison
    if test_mode and existing_region:
        print(f"EXISTING: Park '{park_name}' already has region: {existing_region}")
    
    # Parse states from string if not available in multi
    states_list = []
    if states_multi:
        states_list = states_multi
    elif states_string:
        # Simple state parsing from comma-separated list
        states_list = [state.strip() for state in states_string.split(',')]
    
    # Try to determine region based on states first
    region_by_states = get_region_by_states(states_list)
    
    # Prepare data for AI analysis - use more context for better accuracy
    state_info = ', '.join(states_list) if states_list else states_string if states_string else "Unknown"
    location_info = f"Latitude: {lat}, Longitude: {lon}" if lat and lon else ""
    
    # Create a condensed park description to provide context
    park_description = description[:500] + "..." if len(description) > 500 else description
    
    # Prepare a message with state statistics to help the model
    state_region_info = []
    for region, states in REGION_MAPPING.items():
        state_region_info.append(f"{region}: {', '.join(states)}")
    
    state_mapping_text = "\n".join(state_region_info)
    
    try:
        # Query the OpenAI API with detailed context
        prompt = f"""
I need to determine which geographic region of the United States the following national park belongs to.

Park Information:
- Name: {park_name}
- States: {state_info}
- {location_info}
- Description: {park_description}

US Geographic Regions and their states:
{state_mapping_text}

Based on the park information, especially the state(s) it's located in, determine which region this park belongs to. 
If a park spans multiple regions, choose the most appropriate primary region.

If the state information clearly puts this park in a specific region, that should be your primary consideration.

Respond with ONLY ONE of these exact region names:
{', '.join(REGIONS)}
"""

        response = client.chat.completions.create(
            model=model,  # Use the specified model
            messages=[
                {"role": "system", "content": "You are a geography expert who categorizes US National Parks into geographic regions with high accuracy. Always respond with exactly one region name."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.2,
            max_tokens=10
        )
        
        region = response.choices[0].message.content.strip()
        
        # Verify the region is valid
        if region not in REGIONS:
            # Try to match to closest region
            for valid_region in REGIONS:
                if valid_region.lower() in region.lower():
                    region = valid_region
                    break
            else:
                # Fall back to state-based region if available
                if region_by_states:
                    print(f"AI returned invalid region '{region}' for {park_name}. Using state-based region: {region_by_states}")
                    region = region_by_states
                else:
                    print(f"Warning: AI returned invalid region '{region}' for {park_name}. Defaulting to 'West'.")
                    region = "West"  # Default fallback
        
        # In test mode, show comparison if existing region exists
        if test_mode and existing_region:
            existing_str = existing_region[0] if isinstance(existing_region, list) and existing_region else existing_region
            if region == existing_str:
                print(f"MATCH: '{park_name}' ({state_info}): AI region '{region}' matches existing region")
            else:
                print(f"DIFF: '{park_name}' ({state_info}): AI suggests '{region}' but current region is '{existing_str}'")
        else:
            print(f"Determined region for '{park_name}' ({state_info}): {region}")
        
        return region
        
    except Exception as e:
        print(f"Error determining region for {park_name}: {str(e)}")
        # Fall back to state-based region if available
        if region_by_states:
            print(f"Using fallback state-based region for {park_name}: {region_by_states}")
            return region_by_states
        return None

def update_park_region(record_id, region, test_mode=False):
    """Update the region field of a park in Airtable"""
    if test_mode:
        # In test mode, don't actually update Airtable
        print(f"TEST MODE: Would update record {record_id} with region: {region}")
        return True
    
    url = f"https://api.airtable.com/v0/{AIRTABLE_BASE_ID}/{AIRTABLE_TABLE_NAME}/{record_id}"
    
    headers = {
        "Authorization": f"Bearer {AIRTABLE_TOKEN}",
        "Content-Type": "application/json"
    }
    
    # IMPORTANT: Region is a multi-select field, so we need to provide it as an array
    data = {
        "fields": {
            "Region": [region]  # Now sending as an array for multi-select field
        }
    }
    
    response = requests.patch(url, headers=headers, json=data)
    
    if not response.ok:
        print(f"Error updating record {record_id}: {response.status_code} {response.text}")
        return False
    
    return True

def main():
    """Main function to process all parks"""
    # Parse command line arguments (full parse)
    args = parser.parse_args()
    
    test_mode = args.test
    limit = args.limit
    specific_id = args.id
    park_name_filter = args.name
    force_update = args.force
    model = args.model
    
    mode_description = "TEST MODE" if test_mode else "UPDATE MODE"
    print(f"Starting region update process in {mode_description}...")
    print(f"Using OpenAI model: {model}")
    print(f"Using region options: {', '.join(REGIONS)}")
    
    if specific_id:
        print(f"Processing only park with ID: {specific_id}")
    if park_name_filter:
        print(f"Processing only parks with name containing: {park_name_filter}")
    if limit:
        print(f"Limiting to {limit} parks")
    if force_update:
        print("Forcing update even for parks with existing regions")
    
    # Track statistics
    total_parks = 0
    updated_parks = 0
    already_set = 0
    errors = 0
    
    # Fetch all parks with pagination
    offset = None
    all_records = []
    
    # If specific_id is provided, just fetch that record
    if specific_id:
        url = f"https://api.airtable.com/v0/{AIRTABLE_BASE_ID}/{AIRTABLE_TABLE_NAME}/{specific_id}"
        headers = {
            "Authorization": f"Bearer {AIRTABLE_TOKEN}",
            "Content-Type": "application/json"
        }
        response = requests.get(url, headers=headers)
        if response.ok:
            record = response.json()
            all_records = [record]
            total_parks = 1
            print(f"Fetched park with ID {specific_id}: {record.get('fields', {}).get('Name', 'Unknown')}")
        else:
            print(f"Error fetching park with ID {specific_id}: {response.status_code} {response.text}")
            return
    else:
        # Otherwise fetch parks normally with pagination
        print("Fetching parks from Airtable...")
        while True:
            records, offset = fetch_parks(offset, limit)
            
            # Filter by name if specified
            if park_name_filter:
                records = [r for r in records if park_name_filter.lower() in r.get('fields', {}).get('Name', '').lower()]
            
            all_records.extend(records)
            total_parks += len(records)
            print(f"Fetched {len(records)} parks...")
            
            # Stop if we've reached the limit
            if limit and total_parks >= limit:
                all_records = all_records[:limit]
                total_parks = limit
                break
                
            if not offset:
                break
    
    print(f"Total parks to process: {total_parks}")
    
    # Create a map to track changes
    changes_map = {
        "unchanged": [],  # Parks where AI agrees with existing region
        "changed": [],    # Parks where AI suggests different region than existing
        "new": [],        # Parks that didn't have a region before
        "errors": []      # Parks that had errors during processing
    }
    
    # Process each park
    for park in tqdm(all_records, desc="Processing parks"):
        record_id = park.get("id")
        fields = park.get("fields", {})
        park_name = fields.get("Name", "Unknown Park")
        existing_region = fields.get("Region", [])
        
        # Convert existing_region to a simple string for comparison if it's a list
        existing_region_str = existing_region[0] if isinstance(existing_region, list) and existing_region else existing_region
        
        # Skip if region already set and not forcing or in test mode
        if existing_region_str and not force_update and not test_mode:
            already_set += 1
            continue
        
        # Determine region
        region = determine_region(park, test_mode, model)
        
        if not region:
            errors += 1
            changes_map["errors"].append({
                "id": record_id,
                "name": park_name,
                "existing_region": existing_region_str
            })
            continue
        
        # Track the change type
        if existing_region_str:
            if region == existing_region_str:
                changes_map["unchanged"].append({
                    "id": record_id,
                    "name": park_name,
                    "region": region
                })
            else:
                changes_map["changed"].append({
                    "id": record_id,
                    "name": park_name,
                    "old_region": existing_region_str,
                    "new_region": region
                })
        else:
            changes_map["new"].append({
                "id": record_id,
                "name": park_name,
                "region": region
            })
        
        # Update Airtable (or simulate in test mode)
        success = update_park_region(record_id, region, test_mode)
        
        if success:
            updated_parks += 1
        else:
            errors += 1
        
        # Rate limiting to avoid hitting API limits
        time.sleep(1)
    
    # Print summary
    print("\n--- SUMMARY ---")
    print(f"Total parks processed: {total_parks}")
    if not test_mode and not force_update:
        print(f"Parks already had regions (skipped): {already_set}")
    print(f"Parks processed: {updated_parks}")
    print(f"Errors: {errors}")
    
    # Print changes detail
    print("\n--- CHANGES DETAIL ---")
    print(f"New region assignments: {len(changes_map['new'])}")
    print(f"Changed region assignments: {len(changes_map['changed'])}")
    print(f"Unchanged region assignments: {len(changes_map['unchanged'])}")
    
    # Print changed regions if any
    if changes_map["changed"]:
        print("\nRegion changes:")
        for change in changes_map["changed"]:
            print(f"  {change['name']}: {change['old_region']} → {change['new_region']}")
    
    # Create a regions report
    if updated_parks > 0:
        print("\nGenerating regions report...")
        generate_regions_report()

def generate_regions_report():
    """Generate a report of park counts by region"""
    try:
        # Fetch all parks
        all_records = []
        offset = None
        
        while True:
            records, offset = fetch_parks(offset)
            all_records.extend(records)
            if not offset:
                break
        
        # Count parks by region
        region_counts = {region: 0 for region in REGIONS}
        region_counts["Unassigned"] = 0
        
        for park in all_records:
            regions = park.get("fields", {}).get("Region", [])
            # Handle Region as array (multi-select field)
            if regions:
                if isinstance(regions, list):
                    for region in regions:
                        if region in REGIONS:
                            region_counts[region] += 1
                        else:
                            print(f"Warning: Unknown region '{region}' found in park record")
                else:
                    # Handle as string for backward compatibility
                    if regions in REGIONS:
                        region_counts[regions] += 1
                    else:
                        print(f"Warning: Unknown region '{regions}' found in park record")
            else:
                region_counts["Unassigned"] += 1
        
        # Print report
        print("\n--- REGIONS REPORT ---")
        for region, count in sorted(region_counts.items(), key=lambda x: (-x[1], x[0])):
            percentage = (count / len(all_records)) * 100 if all_records else 0
            print(f"{region}: {count} parks ({percentage:.1f}%)")
            
    except Exception as e:
        print(f"Error generating regions report: {str(e)}")

if __name__ == "__main__":
    main() 