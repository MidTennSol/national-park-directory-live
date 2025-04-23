/**
 * Blog Image Direct Loader
 * 
 * This script tries a direct approach by using absolute GitHub URLs for blog images
 * In addition to the other image loading scripts, this provides a guaranteed fallback
 */

document.addEventListener('DOMContentLoaded', () => {
  console.log('🌐 Blog Image Direct Loader activated');
  
  // Direct URLs to all blog images via GitHub raw content
  const imageMap = {
    'wildlife-photography.jpg': 'https://raw.githubusercontent.com/MidTennSol/national-park-directory-live/main/public/images/blog/wildlife-photography.jpg',
    'spring-parks.jpg': 'https://raw.githubusercontent.com/MidTennSol/national-park-directory-live/main/public/images/blog/spring-parks.jpg',
    'welcome-header.jpg': 'https://raw.githubusercontent.com/MidTennSol/national-park-directory-live/main/public/images/blog/welcome-header.jpg',
    'yellowstone-trails.jpg': 'https://raw.githubusercontent.com/MidTennSol/national-park-directory-live/main/public/images/blog/yellowstone-trails.jpg',
    'wildlife-watching.jpg': 'https://raw.githubusercontent.com/MidTennSol/national-park-directory-live/main/public/images/blog/wildlife-watching.jpg'
  };
  
  // Get all blog images
  const blogImages = document.querySelectorAll('.blog-content img, [data-blog-image], img[src*="blog"]');
  console.log(`Found ${blogImages.length} blog images to process for direct loading`);
  
  if (blogImages.length === 0) return;
  
  // Helper to extract filename from path
  const getFilename = (path) => {
    if (!path) return null;
    const parts = path.split('/');
    return parts[parts.length - 1];
  };
  
  // Process each blog image
  blogImages.forEach((img, index) => {
    // Skip images that already loaded successfully
    if (img.complete && img.naturalWidth > 0) {
      console.log(`Image ${index + 1} already loaded successfully`);
      return;
    }
    
    // Wait for a short time to let other scripts try first
    setTimeout(() => {
      // Only process images that still failed to load
      if (!img.complete || img.naturalWidth === 0) {
        // Get filename from src or data attribute
        const originalSrc = img.dataset.originalPath || img.src;
        const filename = getFilename(originalSrc);
        
        console.log(`Attempting direct load for image ${index + 1}: ${filename}`);
        
        // Check if we have a direct URL for this image
        if (filename && imageMap[filename]) {
          console.log(`Direct URL found for ${filename}`);
          img.src = imageMap[filename];
          img.dataset.directLoaded = 'true';
          console.log(`Set direct URL: ${imageMap[filename]}`);
        } else if (filename) {
          console.log(`No direct mapping found for ${filename}, trying to construct URL`);
          // Try to construct a direct URL based on filename
          const directUrl = `https://raw.githubusercontent.com/MidTennSol/national-park-directory-live/main/public/images/blog/${filename}`;
          img.src = directUrl;
          img.dataset.directLoaded = 'true';
          console.log(`Set constructed URL: ${directUrl}`);
        }
      }
    }, 1000); // Wait 1 second before applying direct URLs
  });
  
  // Attempt to load from the JSON file as another option
  fetch('/blog-images.json')
    .then(response => response.json())
    .then(data => {
      console.log('Successfully loaded image map from JSON:', Object.keys(data.images).length);
      
      // Process images again after 2 seconds with the JSON data
      setTimeout(() => {
        blogImages.forEach((img, index) => {
          if (!img.complete || img.naturalWidth === 0) {
            const originalSrc = img.dataset.originalPath || img.src;
            const filename = getFilename(originalSrc);
            
            if (filename && data.images[filename]) {
              console.log(`JSON URL found for ${filename}`);
              img.src = data.images[filename];
              img.dataset.jsonLoaded = 'true';
            }
          }
        });
      }, 2000);
    })
    .catch(err => {
      console.log('Failed to load image map JSON:', err);
    });
}); 