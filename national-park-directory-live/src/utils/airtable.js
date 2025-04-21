/**
 * Utility function to fetch data from Airtable
 * 
 * Environment variables should be set in .env file at the project root
 * with the following keys:
 * - AIRTABLE_TOKEN: Your Airtable API key
 * - AIRTABLE_BASE_ID: Your Airtable base ID
 * - AIRTABLE_TABLE_NAME: Your Airtable table name
 */

// Hardcoded credentials as a fallback, but try to use env vars first
const AIRTABLE_TOKEN = import.meta.env.AIRTABLE_TOKEN || 'patWxqsOH8eCEVx7Y.2e2fa79f47ca86b071c4b5114ceed5a5f9d8124d162bec76b2109882bb0625f2';
const AIRTABLE_BASE_ID = import.meta.env.AIRTABLE_BASE_ID || 'appJLgVdJISZ38p3R';
const AIRTABLE_TABLE_NAME = import.meta.env.AIRTABLE_TABLE_NAME || 'national-parks';

// Debug log for environment variables
console.log('Environment variables check:');
console.log('AIRTABLE_TOKEN exists:', !!import.meta.env.AIRTABLE_TOKEN);
console.log('AIRTABLE_BASE_ID exists:', !!import.meta.env.AIRTABLE_BASE_ID);
console.log('AIRTABLE_TABLE_NAME exists:', !!import.meta.env.AIRTABLE_TABLE_NAME);

// Debug log for actually assigned variables
console.log('Assigned variables:');
console.log('AIRTABLE_TOKEN length:', AIRTABLE_TOKEN ? AIRTABLE_TOKEN.length : 0);
console.log('AIRTABLE_BASE_ID:', AIRTABLE_BASE_ID);
console.log('AIRTABLE_TABLE_NAME:', AIRTABLE_TABLE_NAME);

/**
 * Fetches all national park data from Airtable, handling pagination
 * @param {Object} options - Options for fetching data
 * @param {string} options.sort - Field to sort by (default: 'Name')
 * @param {string} options.view - View to use (default: 'Grid view')
 * @param {string} options.filterByFormula - Formula to filter by (optional)
 * @param {number} [options.pageSize] - Records per page (default: 100, max allowed by Airtable)
 * @param {string} [options.offset] - Pagination offset (used internally)
 * @returns {Promise<Array>} - Array of all records
 */
export async function fetchNationalParks(options = {}) {
  const {
    sort = 'Name',
    view = 'Grid view',
    filterByFormula = '',
    pageSize = 100, // Airtable limits to 100 records per request
    offset = null
  } = options;

  // Debug log for options
  console.log('Fetch options:', { pageSize, sort, view, filterByFormula, offset });

  // Build the API URL
  let url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}?`;
  
  // Add query parameters
  const params = new URLSearchParams();
  params.append('pageSize', pageSize); // Use pageSize instead of maxRecords to ensure pagination works
  if (sort) params.append('sort[0][field]', sort);
  if (sort) params.append('sort[0][direction]', 'asc');
  if (view) params.append('view', view);
  if (filterByFormula) params.append('filterByFormula', filterByFormula);
  if (offset) params.append('offset', offset);
  
  url += params.toString();
  
  // Debug log for request
  console.log('API URL:', url);
  console.log('Using Authorization Bearer token with length:', AIRTABLE_TOKEN.length);

  try {
    // Fetch data from Airtable
    console.log('Making Airtable API request...');
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${AIRTABLE_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.error('Response not OK:', response.status, response.statusText);
      throw new Error(`Error fetching data: ${response.statusText} (${response.status})`);
    }

    const data = await response.json();
    console.log('Response received, records count:', data.records ? data.records.length : 0);
    console.log('Pagination offset present:', !!data.offset);
    
    // Handle pagination - fetch next page if an offset is returned
    if (data.offset) {
      console.log(`Fetching next page with offset: ${data.offset.substring(0, 10)}...`);
      // Fetch the next page
      const nextPageOptions = { ...options, offset: data.offset };
      const nextPageData = await fetchNationalParks(nextPageOptions);
      
      // Combine the records from this page and all subsequent pages
      const parsedCurrentPageRecords = parseRecords(data.records);
      console.log(`Combining ${parsedCurrentPageRecords.length} records with ${nextPageData.length} from next pages`);
      return [...parsedCurrentPageRecords, ...nextPageData];
    }
    
    // No more pages - parse and return just this page's records
    return parseRecords(data.records);
  } catch (error) {
    console.error('Error fetching data from Airtable:', error.message);
    console.error('Error stack:', error.stack);
    return [];
  }
}

/**
 * Fetches a single national park by slug
 * @param {string} slug - The slug of the park to fetch
 * @returns {Promise<Object|null>} - The park record, or null if not found
 */
export async function fetchNationalParkBySlug(slug) {
  try {
    const filterByFormula = `{Slug} = '${slug}'`;
    const parks = await fetchNationalParks({ filterByFormula, pageSize: 1 });
    
    if (parks.length > 0) {
      // Debug log for the park data
      console.log('============ PARK DEBUG INFO ============');
      console.log(`Park: ${parks[0].name}`);
      console.log(`Image URL: ${parks[0].imageUrl}`);
      console.log(`Wikimedia Images type: ${typeof parks[0].wikimediaImages}`);
      
      if (Array.isArray(parks[0].wikimediaImages)) {
        console.log(`Wikimedia Images count: ${parks[0].wikimediaImages.length}`);
        if (parks[0].wikimediaImages.length > 0) {
          console.log(`First wikimedia image: ${parks[0].wikimediaImages[0]}`);
        }
      } else if (typeof parks[0].wikimediaImages === 'string') {
        console.log(`Wikimedia Images string length: ${parks[0].wikimediaImages.length}`);
        console.log(`Wikimedia Images starts with: ${parks[0].wikimediaImages.substring(0, 50)}...`);
      }
      
      console.log('========================================');
    }
    
    return parks.length > 0 ? parks[0] : null;
  } catch (error) {
    console.error(`Error fetching park with slug "${slug}":`, error);
    return null;
  }
}

/**
 * Parses records from Airtable to extract relevant fields
 * @param {Array} records - Records from Airtable
 * @returns {Array} - Parsed records
 */
function parseRecords(records) {
  return records.map(record => {
    const fields = record.fields;
    
    // Simplified image handling
    let mainImageUrl = '';
    let wikimediaImagesArray = [];
    
    // Log for debugging
    console.log(`Processing park: ${fields.Name}`);
    console.log(`Slug value: ${fields.Slug || 'NOT FOUND'}`);
    
    // Generate a slug if one doesn't exist
    let slug = '';
    if (fields.Slug) {
      slug = fields.Slug.trim();
      console.log(`Using existing slug: ${slug}`);
    } else if (fields.Name) {
      // Generate a slug from the name
      slug = fields.Name.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
        .replace(/\s+/g, '-')         // Replace spaces with hyphens
        .replace(/-+/g, '-')          // Replace multiple hyphens with single hyphen
        .trim();
      console.log(`Generated slug from name: ${slug}`);
    }
    
    console.log(`Wikimedia Images raw:`, fields['Wikimedia Images']);
    
    // First check if we have wikimedia images
    if (fields['Wikimedia Images']) {
      if (Array.isArray(fields['Wikimedia Images'])) {
        // If it's already an array, use it directly
        wikimediaImagesArray = fields['Wikimedia Images'];
        if (wikimediaImagesArray.length > 0) {
          // Prioritize upload.wikimedia.org URLs
          const wikiUploadUrl = wikimediaImagesArray.find(url => 
            url && url.includes('upload.wikimedia.org')
          );
          
          mainImageUrl = wikiUploadUrl || wikimediaImagesArray[0];
        }
      } else if (typeof fields['Wikimedia Images'] === 'string') {
        // If it's a string, check if it contains upload.wikimedia.org URLs
        if (fields['Wikimedia Images'].includes('upload.wikimedia.org')) {
          // Extract all upload.wikimedia.org URLs
          const matches = fields['Wikimedia Images'].match(/(https?:\/\/upload\.wikimedia\.org\/[^\s"']+)/g);
          if (matches && matches.length > 0) {
            wikimediaImagesArray = matches;
            mainImageUrl = matches[0];
            console.log(`Extracted ${matches.length} Wikimedia URLs from string`);
          } else {
            // Try to parse as JSON or use as direct URL
            try {
              if (fields['Wikimedia Images'].startsWith('[')) {
                const parsed = JSON.parse(fields['Wikimedia Images']);
                if (Array.isArray(parsed)) {
                  wikimediaImagesArray = parsed;
                  if (parsed.length > 0) {
                    mainImageUrl = parsed[0];
                  }
                }
              } else {
                // It's a direct URL
                mainImageUrl = fields['Wikimedia Images'];
                wikimediaImagesArray = [mainImageUrl];
              }
            } catch (e) {
              // If JSON parsing fails, use as a direct URL
              console.warn(`Failed to parse JSON for ${fields.Name}:`, e);
              mainImageUrl = fields['Wikimedia Images'];
              wikimediaImagesArray = [mainImageUrl];
            }
          }
        } else {
          // Try to parse as JSON or use as direct URL
          try {
            if (fields['Wikimedia Images'].startsWith('[')) {
              const parsed = JSON.parse(fields['Wikimedia Images']);
              if (Array.isArray(parsed)) {
                wikimediaImagesArray = parsed;
                if (parsed.length > 0) {
                  mainImageUrl = parsed[0];
                }
              }
            } else {
              // It's a direct URL
              mainImageUrl = fields['Wikimedia Images'];
              wikimediaImagesArray = [mainImageUrl];
            }
          } catch (e) {
            // If JSON parsing fails, use as a direct URL
            console.warn(`Failed to parse JSON for ${fields.Name}:`, e);
            mainImageUrl = fields['Wikimedia Images'];
            wikimediaImagesArray = [mainImageUrl];
          }
        }
      }
    }
    
    // Fallback to Image URL if no Wikimedia Images
    if (!mainImageUrl && fields['Image URL']) {
      mainImageUrl = fields['Image URL'];
      if (wikimediaImagesArray.length === 0) {
        wikimediaImagesArray = [mainImageUrl];
      }
    }
    
    // Ensure URLs have proper protocol
    if (mainImageUrl && !mainImageUrl.startsWith('http') && !mainImageUrl.startsWith('/')) {
      mainImageUrl = 'https://' + mainImageUrl;
    }
    
    wikimediaImagesArray = wikimediaImagesArray.map(url => {
      if (url && !url.startsWith('http') && !url.startsWith('/')) {
        return 'https://' + url;
      }
      return url;
    });
    
    // Log the final result
    console.log(`Final image URL: ${mainImageUrl}`);
    
    return {
      id: record.id,
      name: fields.Name || '',
      description: fields.Description || '',
      states: fields.States || '',
      designation: fields.Designation || '',
      imageUrl: mainImageUrl || '',
      wikimediaImages: wikimediaImagesArray,
      slug: slug || 'unknown-park', // Ensure we always have a slug value
      summary: fields.Summary || '',
      parkCode: fields['Park Code'] || '',
      
      // Additional fields
      descriptionExpounded: fields['Description (Expounded)'] || '',
      websiteUrl: fields['Website URL'] || '',
      activities: fields['Activities (Multi)'] || [],
      topics: fields['Topics (Multi)'] || [],
      weatherInfo: fields['Weather Info'] || '',
      latitude: fields.Latitude || '',
      longitude: fields.Longitude || '',
      city: fields.City || '',
      directionsInfo: fields['Directions Info'] || '',
      directionsInfoExpounded: fields['Directions Info (Expounded)'] || '',
      directionsUrl: fields['Directions URL'] || '',
      statesMulti: fields['States (Multi)'] || [],
      siteType: fields['Site Type'] || '',
    };
  });
} 