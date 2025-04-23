import os
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Airtable API configuration
AIRTABLE_TOKEN = os.getenv("AIRTABLE_TOKEN") or "patWxqsOH8eCEVx7Y.2e2fa79f47ca86b071c4b5114ceed5a5f9d8124d162bec76b2109882bb0625f2"
AIRTABLE_BASE_ID = os.getenv("AIRTABLE_BASE_ID") or "appJLgVdJISZ38p3R"
AIRTABLE_TABLE_NAME = os.getenv("AIRTABLE_TABLE_NAME") or "national-parks"

# Test record ID and various forms of region names
TEST_RECORD_ID = "rec1SFV71vDup9XIP"  # Colonial National Historical Park in Virginia

# Various potential formats of the regions to test
REGION_FORMATS = [
    # Original format
    ["Northeast", "Midwest", "South", "West", "Territories"],
    
    # All lowercase
    ["northeast", "midwest", "south", "west", "territories"],
    
    # All uppercase
    ["NORTHEAST", "MIDWEST", "SOUTH", "WEST", "TERRITORIES"],
    
    # Title case
    ["Northeast", "Midwest", "South", "West", "Territories"],
    
    # With 'Region' suffix
    ["Northeast Region", "Midwest Region", "South Region", "West Region", "Territories"],
    
    # Different naming convention
    ["NE", "MW", "S", "W", "T"],
    
    # With number prefixes (sometimes used in Airtable)
    ["1-Northeast", "2-Midwest", "3-South", "4-West", "5-Territories"],
]

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
    
    print(f"Testing update with region value: '{region_value}'")
    response = requests.patch(url, headers=headers, json=data)
    
    if response.ok:
        print(f"✅ SUCCESS! Update successful!")
        updated_data = response.json()
        print(f"   Updated Region: {updated_data.get('fields', {}).get('Region')}")
        return True
    else:
        print(f"❌ FAILED: {response.status_code} {response.text}")
        return False

def test_all_formats():
    """Test all formats of region names"""
    success_count = 0
    total_tests = 0
    
    # First, test the exact values one by one (most likely match)
    print("\n=== Testing exact values for the 'South' region ===")
    
    south_formats = [
        "South", "south", "SOUTH", "South Region", "S", "3-South", 
        # Try a few more variations
        "South Region", "Southern", "Southern Region"
    ]
    
    for south_format in south_formats:
        total_tests += 1
        if test_update_region(TEST_RECORD_ID, south_format):
            success_count += 1
            print(f"Found working format: '{south_format}'")
    
    # If none of the above worked, try with all formats
    if success_count == 0:
        print("\n=== Testing different region name formats ===")
        for format_set in REGION_FORMATS:
            print(f"\nTrying format set: {format_set}")
            for region in format_set:
                total_tests += 1
                if test_update_region(TEST_RECORD_ID, region):
                    success_count += 1
    
    print(f"\nCompleted {total_tests} tests with {success_count} successes")

if __name__ == "__main__":
    test_all_formats() 