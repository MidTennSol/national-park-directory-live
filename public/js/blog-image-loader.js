/**
 * Blog Image Loader
 * Simplified version that handles image loading with a clear fallback strategy
 */

document.addEventListener('DOMContentLoaded', () => {
  console.log('🖼️ Blog Image Loader activated');
  
  // Get all blog images
  const blogImages = document.querySelectorAll('[data-blog-image], .blog-content img');
  
  if (blogImages.length === 0) {
    console.log('No blog images found');
    return;
  }
  
  console.log(`Found ${blogImages.length} blog images`);
  
  blogImages.forEach((img) => {
    // Skip if already processed
    if (img.hasAttribute('data-processed')) {
      return;
    }
    
    // Mark as processed
    img.setAttribute('data-processed', 'true');
    
    // Store original path
    const originalPath = img.getAttribute('data-original-path') || img.getAttribute('src');
    if (!originalPath) return;
    
    // Extract filename
    const filename = originalPath.split('/').pop();
    if (!filename) return;
    
    // Function to handle image error
    const handleImageError = () => {
      // Try GitHub raw URL
      const githubUrl = `https://raw.githubusercontent.com/MidTennSol/national-park-directory-live/main/public/images/blog/${filename}`;
      
      // Create test image
      const testImg = new Image();
      testImg.onload = () => {
        img.src = githubUrl;
        img.classList.remove('fallback-applied');
        img.classList.add('image-loaded');
      };
      testImg.onerror = () => {
        // If GitHub URL fails, use placeholder
        if (!img.src.includes('park-placeholder.svg')) {
          img.src = '/images/park-placeholder.svg';
          img.classList.add('fallback-applied');
        }
      };
      testImg.src = githubUrl;
    };
    
    // Add error handler
    img.addEventListener('error', handleImageError);
    
    // Check if image is already in error state
    if (img.complete && (img.naturalWidth === 0 || img.naturalHeight === 0)) {
      handleImageError();
    }
  });
}); 