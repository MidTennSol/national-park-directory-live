/**
 * Direct Image Fix - Simpler, more reliable approach
 * Replaces placeholder images with direct base64 encoded images
 */

// Run immediately without waiting for DOMContentLoaded
(function() {
  // Base64 encoded versions of the blog images
  const imageBase64Map = {
    'wildlife-photography.jpg': 'https://res.cloudinary.com/midtennsol/image/upload/v1619456789/nationalparks/wildlife-photography.jpg',
    'spring-parks.jpg': 'https://res.cloudinary.com/midtennsol/image/upload/v1619456789/nationalparks/spring-parks.jpg',
    'welcome-header.jpg': 'https://res.cloudinary.com/midtennsol/image/upload/v1619456789/nationalparks/welcome-header.jpg',
    'wildlife-watching.jpg': 'https://res.cloudinary.com/midtennsol/image/upload/v1619456789/nationalparks/wildlife-watching.jpg',
    'yellowstone-trails.jpg': 'https://res.cloudinary.com/midtennsol/image/upload/v1619456789/nationalparks/yellowstone-trails.jpg'
  };
  
  // Function to fix images - runs immediately and again after load
  function fixImages() {
    try {
      // Find all placeholder images
      const placeholderImages = document.querySelectorAll('img[src*="placeholder"], img.fallback-applied, img[data-original-path*="blog"]');
      console.log('Found ' + placeholderImages.length + ' images to fix');
      
      placeholderImages.forEach(function(img) {
        try {
          // Get original path
          const originalPath = img.getAttribute('data-original-path');
          if (!originalPath) return;
          
          // Extract filename
          const parts = originalPath.split('/');
          const filename = parts[parts.length - 1];
          
          // Check if we have a base64 version
          if (imageBase64Map[filename]) {
            // Replace image with Cloudinary version
            console.log('Replacing ' + filename + ' with Cloudinary version');
            img.src = imageBase64Map[filename];
            img.classList.remove('fallback-applied');
            img.classList.add('fixed-image');
          }
        } catch (e) {
          console.log('Error fixing an image: ' + e.message);
        }
      });
    } catch (e) {
      console.log('Error in fixImages: ' + e.message);
    }
  }
  
  // Run immediately
  fixImages();
  
  // Run again when page is loaded
  if (document.readyState === 'complete') {
    fixImages();
  } else {
    window.addEventListener('load', fixImages);
  }
  
  // Run one more time after a delay
  setTimeout(fixImages, 1000);
})(); 