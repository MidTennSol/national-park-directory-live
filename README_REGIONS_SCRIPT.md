# National Parks Region Update Script

This script analyzes each National Park in the Airtable database and uses AI to determine which geographic region it belongs to, then updates the 'Region' field in Airtable accordingly.

## Features

- Fetches national park data from Airtable with full pagination support
- Uses OpenAI GPT-4o for accurate region classification
- Provides a state-based fallback mechanism for region determination
- Implements a multi-layered approach to determine the most appropriate region:
  1. First checks if a region is already assigned
  2. Applies a rule-based approach using the states the park is in
  3. Uses AI with detailed context including location, description, and state information
- Test mode to preview changes without updating Airtable
- Command-line options for filtering, limiting, and forcing updates
- Generates a comprehensive regions report showing distribution of parks by region
- Includes rate limiting to respect API limits

## Prerequisites

- Python 3.6+
- OpenAI API key
- Airtable access token

## Installation

1. Install required dependencies:
```
pip install openai python-dotenv requests tqdm
```

2. Create a `.env` file in the same directory as the script with the following variables:
```
AIRTABLE_TOKEN=your_airtable_token
AIRTABLE_BASE_ID=your_airtable_base_id
AIRTABLE_TABLE_NAME=your_airtable_table_name
OPENAI_API_KEY=your_openai_api_key
```

Note: Instead of using the `.env` file for the OpenAI API key, you can also provide it directly via the command line using the `--api-key` parameter.

## Geographic Regions

The script categorizes parks into the following regions with their associated states:

- **Northeast**: Maine, New Hampshire, Vermont, Massachusetts, Rhode Island, Connecticut, New York, New Jersey, Pennsylvania
- **Midwest**: Ohio, Michigan, Indiana, Wisconsin, Illinois, Minnesota, Iowa, Missouri, North Dakota, South Dakota, Nebraska, Kansas
- **South**: Delaware, Maryland, Virginia, West Virginia, Kentucky, North Carolina, South Carolina, Tennessee, Georgia, Florida, Alabama, Mississippi, Arkansas, Louisiana, Oklahoma, Texas
- **West**: Colorado, Wyoming, Montana, Idaho, Utah, Nevada, Washington, Oregon, California, Arizona, New Mexico
- **Territories**: Alaska, Hawaii, Puerto Rico, Guam, American Samoa, U.S. Virgin Islands, Northern Mariana Islands

These regions are designed to align with the options available in the Airtable "Region" field.

## Airtable Configuration

The script is designed to work with an Airtable base that has a "Region" field in the national parks table. Important notes:

- The **Region** field should be configured as a **multi-select** field in Airtable
- The options in the multi-select should match the region names used in the script: Northeast, Midwest, South, West, Territories
- The script will send the region value as an array (e.g., `["South"]`) to properly update the multi-select field

## Usage

### Basic Usage

Run the script using the following command:

```
python update_regions.py --api-key your_openai_api_key
```

### Command-line Options

The script supports several command-line options:

```
python update_regions.py [options]
```

Available options:

- `--test`: Run in test mode without updating Airtable records
- `--limit N`: Limit processing to N parks
- `--id RECORD_ID`: Process only a specific park by Airtable record ID
- `--name PATTERN`: Process only parks with names containing this pattern (case-insensitive)
- `--force`: Force region reassignment even for parks that already have a region
- `--api-key KEY`: Your OpenAI API key (overrides environment variable)
- `--model MODEL`: Specify which OpenAI model to use (default: gpt-4o)

### Examples

Test mode with a specific API key and model:
```
python update_regions.py --test --api-key sk-xxxx --model gpt-3.5-turbo
```

Test mode for a specific park:
```
python update_regions.py --test --name "Yellowstone" --api-key sk-xxxx
```

Update a single park by ID:
```
python update_regions.py --id "recXXXXXXXXXXXXXXX" --api-key sk-xxxx
```

Force update all parks (re-analyze their regions):
```
python update_regions.py --force --api-key sk-xxxx
```

Test the first 10 parks:
```
python update_regions.py --test --limit 10 --api-key sk-xxxx
```

## How It Works

The script will:
1. Fetch parks from Airtable based on the provided filters
2. Skip parks that already have a Region value (unless --force is used)
3. For each park without a region:
   - Try to determine the region based on the state(s) the park is in
   - Use OpenAI's model with detailed park information to determine the appropriate region
   - Fall back to state-based determination if AI fails
4. Update the park's record in Airtable with the determined region as a multi-select value (unless in test mode)
5. Generate a report showing the distribution of parks across regions
6. Display a summary of results when complete

## Output

The script provides:
- Detailed progress information during processing
- A changes report showing:
  - New region assignments (parks that didn't have a region before)
  - Changed region assignments (when --force is used)
  - Unchanged region assignments (when AI confirms existing regions)
- A regions report showing the distribution of parks by region with percentages
- A summary with:
  - Total number of parks processed
  - Number of parks already with region values (if not forcing updates)
  - Number of parks processed and updated
  - Number of errors encountered

## Model Selection

By default, the script uses the `gpt-4o` model for improved accuracy. You can specify a different model using the `--model` parameter. For example:

- For faster but potentially less accurate results: `--model gpt-3.5-turbo`
- For the most advanced model (if available): `--model gpt-4o`

The choice of model affects:
- Accuracy of region assignments
- Processing speed
- API costs

## Test Mode

In test mode (`--test`), the script:
- Does not actually update any Airtable records
- Shows what changes would be made
- Compares AI-suggested regions with existing regions
- Identifies matches and differences
- Provides a detailed report of potential changes

This is useful for:
- Validating the accuracy of AI region determination
- Previewing changes before applying them
- Reviewing existing region assignments
- Testing different OpenAI models without making actual changes

## Troubleshooting

If you encounter errors when updating records, make sure:
1. The "Region" field in your Airtable is a **multi-select** field (not a single-select field)
2. The options in your Airtable's Region field match the region names used in the script (Northeast, Midwest, South, West, Territories)
3. Your Airtable API token has permission to update records

Common errors:
- `Cannot parse value for field Region`: This usually means you're trying to set a value that's not in the correct format (should be an array) or the value doesn't match any of the allowed options

## Notes

- The script uses GPT-4o by default, but you can use GPT-3.5-turbo for faster or cheaper processing
- If a park spans multiple regions, the AI will determine the most appropriate primary region
- The state-based approach uses a voting system to determine the region when a park spans multiple states
- You can modify the `REGION_MAPPING` dictionary in the script if you want to use different region categories or state assignments

## Rate Limiting

The script includes a 1-second delay between updates to avoid hitting Airtable's API rate limits. 