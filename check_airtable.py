import os
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Airtable API configuration
AIRTABLE_TOKEN = os.getenv("AIRTABLE_TOKEN") or "patWxqsOH8eCEVx7Y.2e2fa79f47ca86b071c4b5114ceed5a5f9d8124d162bec76b2109882bb0625f2"
AIRTABLE_BASE_ID = os.getenv("AIRTABLE_BASE_ID") or "appJLgVdJISZ38p3R"
AIRTABLE_TABLE_NAME = os.getenv("AIRTABLE_TABLE_NAME") or "national-parks"

def check_field_metadata():
    """Check if Region field exists and what type it is"""
    url = f"https://api.airtable.com/v0/meta/bases/{AIRTABLE_BASE_ID}/tables"
    
    headers = {
        "Authorization": f"Bearer {AIRTABLE_TOKEN}",
        "Content-Type": "application/json"
    }
    
    response = requests.get(url, headers=headers)
    
    if not response.ok:
        print(f"Error fetching schema: {response.status_code} {response.text}")
        return
    
    data = response.json()
    
    # Look for the national-parks table
    for table in data.get("tables", []):
        if table.get("name") == AIRTABLE_TABLE_NAME:
            print(f"Found table: {table['name']}")
            
            # Look for Region field
            for field in table.get("fields", []):
                print(f"Field: {field['name']} - Type: {field['type']}")
                
                # If this is the Region field, show details
                if field["name"] == "Region":
                    print("\nRegion field details:")
                    print(f"Type: {field['type']}")
                    
                    # If it's a single select field, show the options
                    if field["type"] == "singleSelect":
                        options = field.get("options", {}).get("choices", [])
                        print("Available options:")
                        for option in options:
                            print(f"  - {option.get('name')}")
                    
                    # Show any validation rules
                    if "validation" in field:
                        print("Validation rules:", field["validation"])

def test_update_region(record_id, region_value):
    """Test updating a specific record with a region value"""
    url = f"https://api.airtable.com/v0/{AIRTABLE_BASE_ID}/{AIRTABLE_TABLE_NAME}/{record_id}"
    
    headers = {
        "Authorization": f"Bearer {AIRTABLE_TOKEN}",
        "Content-Type": "application/json"
    }
    
    data = {
        "fields": {
            "Region": region_value
        }
    }
    
    print(f"Testing update for record {record_id} with region value: '{region_value}'")
    response = requests.patch(url, headers=headers, json=data)
    
    if response.ok:
        print(f"Update successful!")
        updated_data = response.json()
        print(f"Updated Region: {updated_data.get('fields', {}).get('Region')}")
    else:
        print(f"Update failed: {response.status_code} {response.text}")

if __name__ == "__main__":
    print("Checking Airtable schema...")
    check_field_metadata()
    
    print("\n--------------------------------\n")
    
    # Uncomment and modify these lines to test specific values
    # test_update_region("rec1SFV71vDup9XIP", "Southeast")
    # test_update_region("rec1SFV71vDup9XIP", "SOUTHEAST")
    # test_update_region("rec1SFV71vDup9XIP", "southeast") 