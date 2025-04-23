/**
 * Blog Image Absolute URL Fixer
 * 
 * This script directly replaces image src with absolute URLs
 * It specifically looks for placeholder images and replaces them
 * with absolute URLs to the GitHub repository
 */

document.addEventListener('DOMContentLoaded', () => {
  // Wait a moment to let page fully load
  setTimeout(() => {
    console.log('🔄 Blog Image Absolute URL Fixer activated');
    
    // Direct image mappings - filenames to absolute URLs
    const directImageUrls = {
      'welcome-header.jpg': 'https://raw.githubusercontent.com/MidTennSol/national-park-directory-live/main/public/images/blog/welcome-header.jpg',
      'wildlife-photography.jpg': 'https://raw.githubusercontent.com/MidTennSol/national-park-directory-live/main/public/images/blog/wildlife-photography.jpg',
      'spring-parks.jpg': 'https://raw.githubusercontent.com/MidTennSol/national-park-directory-live/main/public/images/blog/spring-parks.jpg',
      'yellowstone-trails.jpg': 'https://raw.githubusercontent.com/MidTennSol/national-park-directory-live/main/public/images/blog/yellowstone-trails.jpg',
      'wildlife-watching.jpg': 'https://raw.githubusercontent.com/MidTennSol/national-park-directory-live/main/public/images/blog/wildlife-watching.jpg'
    };
    
    // Look specifically for placeholder images
    const placeholderImages = document.querySelectorAll('img[src="/images/park-placeholder.svg"], img[src*="placeholder"], img.fallback-applied');
    console.log(`Found ${placeholderImages.length} placeholder images to fix`);
    
    if (placeholderImages.length === 0) {
      // If no placeholders found, try to find any blog images
      console.log('No placeholders found, checking for any blog images');
      const allBlogImages = document.querySelectorAll('[data-blog-image], [data-original-path*="blog"]');
      fixImages(allBlogImages);
    } else {
      // Fix the placeholder images
      fixImages(placeholderImages);
    }

    function fixImages(images) {
      images.forEach(img => {
        // Get the original path from the data attribute
        const originalPath = img.getAttribute('data-original-path');
        if (!originalPath) {
          console.log('No original path found for image:', img);
          return;
        }
        
        // Extract the filename from the original path
        const pathParts = originalPath.split('/');
        const filename = pathParts[pathParts.length - 1];
        
        console.log(`Fixing image with filename: ${filename}`);
        
        if (directImageUrls[filename]) {
          // Replace the src with the direct URL
          console.log(`Setting direct URL for ${filename}: ${directImageUrls[filename]}`);
          img.src = directImageUrls[filename];
          
          // Remove placeholder classes and add loaded class
          img.classList.remove('fallback-applied');
          img.classList.add('absolute-fixed');
          
          // Force the image to reload
          img.loading = 'eager';
        } else {
          console.log(`No direct URL mapping found for: ${filename}`);
          // Try to construct a URL
          const constructedUrl = `https://raw.githubusercontent.com/MidTennSol/national-park-directory-live/main/public/images/blog/${filename}`;
          console.log(`Using constructed URL: ${constructedUrl}`);
          img.src = constructedUrl;
          img.classList.remove('fallback-applied');
          img.classList.add('absolute-fixed');
        }
      });
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
  }, 500); // Short delay to let page load
}); 