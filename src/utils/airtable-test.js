/**
 * Simplified Airtable test utility
 */

// Get environment variables directly
export async function testAirtableConnection() {
  const AIRTABLE_TOKEN = import.meta.env.AIRTABLE_TOKEN;
  const AIRTABLE_BASE_ID = import.meta.env.AIRTABLE_BASE_ID;
  const AIRTABLE_TABLE_NAME = import.meta.env.AIRTABLE_TABLE_NAME;
  
  console.log('=== AIRTABLE TEST UTILITY ===');
  console.log('TOKEN:', AIRTABLE_TOKEN ? `${AIRTABLE_TOKEN.slice(0, 5)}...${AIRTABLE_TOKEN.slice(-5)}` : 'missing');
  console.log('BASE_ID:', AIRTABLE_BASE_ID || 'missing');
  console.log('TABLE_NAME:', AIRTABLE_TABLE_NAME || 'missing');
  
  // Build a simple URL
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}?maxRecords=1`;
  console.log('URL:', url);
  
  try {
    console.log('Making test request...');
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${AIRTABLE_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Response status:', response.status, response.statusText);
    
    if (!response.ok) {
      // Try to get error details
      try {
        const errorText = await response.text();
        console.error('Error details:', errorText);
        return {
          success: false,
          status: response.status,
          message: `Error: ${response.status} ${response.statusText}`,
          details: errorText
        };
      } catch (e) {
        return {
          success: false,
          status: response.status,
          message: `Error: ${response.status} ${response.statusText}`,
          details: 'Could not parse error details'
        };
      }
    }
    
    const data = await response.json();
    console.log('Records received:', data.records ? data.records.length : 0);
    
    if (data.records && data.records.length > 0) {
      console.log('Sample record ID:', data.records[0].id);
      // Show field names
      console.log('Available fields:', Object.keys(data.records[0].fields).join(', '));
    }
    
    return {
      success: true,
      status: response.status,
      message: 'Success',
      data
    };
  } catch (error) {
    console.error('Exception during test:', error);
    return {
      success: false,
      status: 0,
      message: error instanceof Error ? error.message : 'Unknown error',
      details: error instanceof Error ? error.stack : String(error)
    };
  }
} 