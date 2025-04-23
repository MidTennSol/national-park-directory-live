import os
import sys
from dotenv import load_dotenv
from pyairtable import Api
from collections import Counter, defaultdict

# Load environment variables
load_dotenv()

# Check for environment variables
AIRTABLE_TOKEN = os.getenv('AIRTABLE_TOKEN') or "patWxqsOH8eCEVx7Y.2e2fa79f47ca86b071c4b5114ceed5a5f9d8124d162bec76b2109882bb0625f2"
AIRTABLE_BASE_ID = os.getenv('AIRTABLE_BASE_ID') or "appJLgVdJISZ38p3R"
AIRTABLE_TABLE_NAME = os.getenv('AIRTABLE_TABLE_NAME') or "national-parks"

# Verify environment variables exist
if not all([AIRTABLE_TOKEN, AIRTABLE_BASE_ID, AIRTABLE_TABLE_NAME]):
    print("Error: Missing required environment variables.")
    print(f"AIRTABLE_TOKEN: {'Set' if AIRTABLE_TOKEN else 'Missing'}")
    print(f"AIRTABLE_BASE_ID: {'Set' if AIRTABLE_BASE_ID else 'Missing'}")
    print(f"AIRTABLE_TABLE_NAME: {'Set' if AIRTABLE_TABLE_NAME else 'Missing'}")
    sys.exit(1)

# Initialize Airtable API
api = Api(AIRTABLE_TOKEN)
table = api.table(AIRTABLE_BASE_ID, AIRTABLE_TABLE_NAME)

def count_parks_by_region():
    """Count parks by region and print statistics."""
    
    print("Fetching parks from Airtable...")
    
    try:
        # Get all parks
        records = table.all()
        print(f"Successfully fetched {len(records)} parks.")
        
        # Initialize counters
        region_counter = Counter()
        states_by_region = defaultdict(set)
        unassigned_parks = []
        
        # Process each park
        for record in records:
            fields = record["fields"]
            park_name = fields.get("Name", "Unknown Park")
            
            # Handle region as either string or list (for multi-select fields)
            region_value = fields.get("Region", [])
            if isinstance(region_value, list):
                region = region_value[0] if region_value else "Unassigned"
            else:
                region = region_value if region_value else "Unassigned"
            
            # Handle states as either string or list
            states_string = fields.get("States", "")
            states_multi = fields.get("States (Multi)", [])
            
            if states_multi:
                states = ", ".join(states_multi)
            else:
                states = states_string
            
            # Count by region
            if region and region != "Unassigned":
                region_counter[region] += 1
                
                # Add states to the region
                if states:
                    state_list = [s.strip() for s in states.split(',')]
                    for state in state_list:
                        states_by_region[region].add(state)
            else:
                unassigned_parks.append(f"{park_name} ({states})")
        
        # Print region statistics
        total_parks = len(records)
        print("\n=== National Parks by Region ===")
        print(f"Total Parks: {total_parks}\n")
        
        # Sort regions by count (descending)
        sorted_regions = sorted(region_counter.items(), key=lambda x: x[1], reverse=True)
        
        for region, count in sorted_regions:
            percentage = (count / total_parks) * 100
            print(f"{region}: {count} parks ({percentage:.1f}%)")
            print(f"  States: {', '.join(sorted(states_by_region[region]))}")
            print()
        
        # Print unassigned stats
        unassigned_count = total_parks - sum(region_counter.values())
        if unassigned_count > 0:
            percentage = (unassigned_count / total_parks) * 100
            print(f"Unassigned: {unassigned_count} parks ({percentage:.1f}%)")
            
            # If there are fewer than 20 unassigned parks, list them
            if unassigned_count <= 20:
                print("Unassigned parks:")
                for park in unassigned_parks:
                    print(f"  - {park}")
            print()
            
    except Exception as e:
        print(f"Error fetching parks: {e}")
        sys.exit(1)

if __name__ == "__main__":
    count_parks_by_region() 