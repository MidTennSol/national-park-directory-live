import os
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Airtable API configuration
AIRTABLE_TOKEN = os.getenv("AIRTABLE_TOKEN") or "patWxqsOH8eCEVx7Y.2e2fa79f47ca86b071c4b5114ceed5a5f9d8124d162bec76b2109882bb0625f2"
AIRTABLE_BASE_ID = os.getenv("AIRTABLE_BASE_ID") or "appJLgVdJISZ38p3R"
AIRTABLE_TABLE_NAME = os.getenv("AIRTABLE_TABLE_NAME") or "national-parks"

# Test record ID
TEST_RECORD_ID = "rec1SFV71vDup9XIP"  # Colonial National Historical Park in Virginia

def fetch_record(record_id):
    """Fetch a single record to see what fields it has"""
    url = f"https://api.airtable.com/v0/{AIRTABLE_BASE_ID}/{AIRTABLE_TABLE_NAME}/{record_id}"
    
    headers = {
        "Authorization": f"Bearer {AIRTABLE_TOKEN}",
        "Content-Type": "application/json"
    }
    
    response = requests.get(url, headers=headers)
    
    if response.ok:
        data = response.json()
        print(f"Record ID: {data.get('id')}")
        print(f"Fields found: {len(data.get('fields', {}))}")
        for field_name, field_value in data.get('fields', {}).items():
            print(f"  - {field_name}: {type(field_value).__name__} = {field_value}")
        return data
    else:
        print(f"Error fetching record: {response.status_code} {response.text}")
        return None

def fetch_all_fields():
    """Fetch the first few records to identify all field names"""
    url = f"https://api.airtable.com/v0/{AIRTABLE_BASE_ID}/{AIRTABLE_TABLE_NAME}?maxRecords=10"
    
    headers = {
        "Authorization": f"Bearer {AIRTABLE_TOKEN}",
        "Content-Type": "application/json"
    }
    
    response = requests.get(url, headers=headers)
    
    if response.ok:
        data = response.json()
        all_fields = set()
        
        # Collect all field names from records
        for record in data.get('records', []):
            for field_name in record.get('fields', {}).keys():
                all_fields.add(field_name)
        
        print(f"Found {len(all_fields)} unique fields across records:")
        for field in sorted(all_fields):
            print(f"  - {field}")
        
        return all_fields
    else:
        print(f"Error fetching records: {response.status_code} {response.text}")
        return set()

def test_update_other_field(record_id, field_name, field_value):
    """Test updating a different field"""
    url = f"https://api.airtable.com/v0/{AIRTABLE_BASE_ID}/{AIRTABLE_TABLE_NAME}/{record_id}"
    
    headers = {
        "Authorization": f"Bearer {AIRTABLE_TOKEN}",
        "Content-Type": "application/json"
    }
    
    data = {
        "fields": {
            field_name: field_value
        }
    }
    
    print(f"Testing update of field '{field_name}' with value: '{field_value}'")
    response = requests.patch(url, headers=headers, json=data)
    
    if response.ok:
        print(f"✅ SUCCESS! Update successful!")
        updated_data = response.json()
        print(f"   Updated {field_name}: {updated_data.get('fields', {}).get(field_name)}")
        return True
    else:
        print(f"❌ FAILED: {response.status_code} {response.text}")
        return False

def main():
    """Main function to test updating fields"""
    print("\n=== Fetch Record Details ===")
    record = fetch_record(TEST_RECORD_ID)
    
    if not record:
        print("Could not fetch record to test")
        return
    
    print("\n=== Fetch All Field Names ===")
    fields = fetch_all_fields()
    
    print("\n=== Test Updating Notes Field ===")
    # Try to update a simple text field
    test_update_other_field(TEST_RECORD_ID, "Notes", "Test update from API - " + os.path.basename(__file__))
    
    print("\n=== Test Updating Summary Field ===")
    # Try to update another text field
    test_update_other_field(TEST_RECORD_ID, "Summary", "Summary test from API - " + os.path.basename(__file__))
    
    print("\n=== Try with Region Field Format ===")
    # Try updating with an integer for Region (in case it's a numeric/enum field)
    test_update_other_field(TEST_RECORD_ID, "Region", 3)  # Try with integer
    
    # Try updating with an array for Region (in case it's a multi-select)
    test_update_other_field(TEST_RECORD_ID, "Region", ["South"])
    
if __name__ == "__main__":
    main() 