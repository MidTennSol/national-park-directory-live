/**
 * Blog Image Absolute URL Fixer
 * 
 * This script directly replaces image src with absolute URLs
 * It specifically looks for placeholder images and replaces them
 * with absolute URLs to the GitHub repository
 */

// Wrap everything in try/catch to prevent site breakage
try {
  document.addEventListener('DOMContentLoaded', () => {
    try {
      // Wait a moment to let page fully load
      setTimeout(() => {
        try {
          console.log('🔄 Blog Image Absolute URL Fixer activated');
          
          // Direct image mappings - filenames to absolute URLs
          const directImageUrls = {
            'welcome-header.jpg': 'https://raw.githubusercontent.com/MidTennSol/national-park-directory-live/main/public/images/blog/welcome-header.jpg',
            'wildlife-photography.jpg': 'https://raw.githubusercontent.com/MidTennSol/national-park-directory-live/main/public/images/blog/wildlife-photography.jpg',
            'spring-parks.jpg': 'https://raw.githubusercontent.com/MidTennSol/national-park-directory-live/main/public/images/blog/spring-parks.jpg',
            'yellowstone-trails.jpg': 'https://raw.githubusercontent.com/MidTennSol/national-park-directory-live/main/public/images/blog/yellowstone-trails.jpg',
            'wildlife-watching.jpg': 'https://raw.githubusercontent.com/MidTennSol/national-park-directory-live/main/public/images/blog/wildlife-watching.jpg'
          };
          
          // Safely query for elements
          let placeholderImages = [];
          try {
            placeholderImages = document.querySelectorAll('img[src="/images/park-placeholder.svg"], img[src*="placeholder"], img.fallback-applied');
            console.log(`Found ${placeholderImages.length} placeholder images to fix`);
          } catch (err) {
            console.log('Error finding placeholder images:', err);
          }
          
          if (!placeholderImages || placeholderImages.length === 0) {
            // If no placeholders found, try to find any blog images
            console.log('No placeholders found, checking for any blog images');
            try {
              const allBlogImages = document.querySelectorAll('[data-blog-image], [data-original-path*="blog"]');
              fixImages(allBlogImages);
            } catch (err) {
              console.log('Error finding blog images:', err);
            }
          } else {
            // Fix the placeholder images
            fixImages(placeholderImages);
          }

          function fixImages(images) {
            if (!images || images.length === 0) return;
            
            Array.from(images).forEach(img => {
              try {
                // Get the original path from the data attribute
                const originalPath = img.getAttribute('data-original-path');
                if (!originalPath) {
                  console.log('No original path found for image');
                  return;
                }
                
                // Extract the filename from the original path
                const pathParts = originalPath.split('/');
                const filename = pathParts[pathParts.length - 1];
                
                console.log(`Fixing image with filename: ${filename}`);
                
                if (directImageUrls[filename]) {
                  // Replace the src with the direct URL
                  console.log(`Setting direct URL for ${filename}`);
                  img.src = directImageUrls[filename];
                  
                  // Remove placeholder classes and add loaded class
                  try {
                    img.classList.remove('fallback-applied');
                    img.classList.add('absolute-fixed');
                  } catch (err) {
                    console.log('Error modifying classes:', err);
                  }
                } else {
                  console.log(`No direct URL mapping found for: ${filename}`);
                  // Try to construct a URL
                  const constructedUrl = `https://raw.githubusercontent.com/MidTennSol/national-park-directory-live/main/public/images/blog/${filename}`;
                  console.log(`Using constructed URL`);
                  img.src = constructedUrl;
                  
                  try {
                    img.classList.remove('fallback-applied');
                    img.classList.add('absolute-fixed');
                  } catch (err) {
                    console.log('Error modifying classes:', err);
                  }
                }
              } catch (err) {
                console.log('Error processing image:', err);
              }
            });
          }
        } catch (err) {
          console.log('Error in blog image fixer:', err);
        }
      }, 1000); // Longer delay to ensure page is ready
    } catch (err) {
      console.log('Error setting up blog image fixer:', err);
    }
  });
} catch (err) {
  console.log('Critical error in blog image fixer script:', err);
}

// Add visual indicator in debug mode
if (window.location.search.includes('debug=true')) {
  const debugIndicator = document.createElement('div');
  debugIndicator.style.position = 'fixed';
  debugIndicator.style.bottom = '50px';
  debugIndicator.style.right = '10px';
  debugIndicator.style.background = 'rgba(255,0,0,0.8)';
  debugIndicator.style.color = 'white';
  debugIndicator.style.padding = '5px';
  debugIndicator.style.borderRadius = '3px';
  debugIndicator.style.zIndex = '9999';
  debugIndicator.textContent = 'Absolute URL Fixer Active';
  document.body.appendChild(debugIndicator);
} 