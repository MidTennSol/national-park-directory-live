/**
 * Blog Image Loader
 * 
 * This script ensures blog images load correctly on the client-side:
 * - Handles image loading errors by trying alternative paths
 * - Works with both relative and absolute image URLs
 * - Falls back to placeholders if images cannot be loaded
 */

document.addEventListener('DOMContentLoaded', () => {
  console.log('Blog image loader activated');
  
  // Process all images in blog content and blog cards
  const blogImages = document.querySelectorAll('.blog-content img, [data-blog-image]');
  if (blogImages.length === 0) {
    console.log('No blog images found on page');
    return;
  }
  
  console.log(`Processing ${blogImages.length} blog images`);
  
  // Check if we're on the live site
  const isLiveSite = window.location.hostname.includes('netlify.app') || 
                    !window.location.hostname.includes('localhost');
  
  if (isLiveSite) {
    console.log('Running on live site - using enhanced path resolution');
  }
  
  blogImages.forEach(img => {
    // Skip images that already have error handlers or are placeholders
    if (img.hasAttribute('data-processed') || img.src.includes('park-placeholder.svg')) {
      return;
    }
    
    // Mark as processed to avoid duplicate processing
    img.setAttribute('data-processed', 'true');
    
    // Store original source
    const originalSrc = img.getAttribute('src');
    if (!originalSrc) return;
    
    // Handle image loading errors
    img.addEventListener('error', function() {
      // Skip if already using placeholder or already being processed
      if (img.src.includes('park-placeholder.svg') || img.hasAttribute('data-retrying')) {
        return;
      }
      
      console.log('Image failed to load:', img.src);
      img.setAttribute('data-retrying', 'true');
      
      // Extract the base path from the full URL or relative path
      const imagePath = extractImagePath(originalSrc);
      if (!imagePath) {
        img.src = '/images/park-placeholder.svg';
        img.removeAttribute('data-retrying');
        return;
      }
      
      // Try different variations of the path
      const pathVariations = tryImageVariations(imagePath, isLiveSite);
      tryNextPath(img, pathVariations, 0);
    });
    
    // Check if the image is already in error state
    if (img.complete && (img.naturalWidth === 0 || img.naturalHeight === 0)) {
      // Trigger the error handler
      const errorEvent = new Event('error');
      img.dispatchEvent(errorEvent);
    }
  });
});

/**
 * Extracts the image path from a full URL or relative path
 */
function extractImagePath(src) {
  // Handle external URLs
  if (src.startsWith('http')) {
    // For external URLs, we can't do much, so return null
    return null;
  }
  
  // Handle relative paths
  // Strip leading slash if present
  let path = src.startsWith('/') ? src.substring(1) : src;
  
  // Return the cleaned path
  return path;
}

/**
 * Generates variations of the image path to try
 */
function tryImageVariations(path, isLiveSite = false) {
  const variations = [];
  
  // Try the original path first
  variations.push(path);
  
  // For live site, prioritize paths with blog folder
  if (isLiveSite) {
    // Try to get just the filename
    const fileName = path.split('/').pop();
    
    // Add specific live site variations
    variations.push(`images/blog/${fileName}`);
    variations.push(`/images/blog/${fileName}`);
    variations.push(`blog/images/${fileName}`);
    variations.push(`/blog/images/${fileName}`);
  }
  
  // Try with and without /images prefix
  if (path.startsWith('images/')) {
    variations.push(path.substring(7)); // Without 'images/' prefix
  } else {
    variations.push(`images/${path}`); // With 'images/' prefix
  }
  
  // Try with and without blog subfolder
  if (path.includes('/blog/')) {
    variations.push(path.replace('/blog/', '/')); // Without blog subfolder
  } else if (path.includes('/')) {
    const parts = path.split('/');
    if (parts.length >= 2) {
      parts.splice(parts.length - 1, 0, 'blog');
      variations.push(parts.join('/')); // With blog subfolder
    }
  }
  
  // Try paths without leading slash
  variations.push(`/${path}`); 
  
  // Try inside public folder
  variations.push(`public/${path}`);
  
  // Try with fixed blog folder
  variations.push(`images/blog/${path.split('/').pop()}`);
  
  // Deduplicate
  return [...new Set(variations)];
}

/**
 * Tries loading the image from each path in the variations array
 * until success or falls back to placeholder
 */
function tryNextPath(img, pathVariations, index) {
  if (index >= pathVariations.length) {
    // All variations failed, use placeholder
    console.log('All image variations failed, using placeholder');
    img.src = '/images/park-placeholder.svg';
    img.removeAttribute('data-retrying');
    return;
  }
  
  const path = pathVariations[index];
  console.log(`Trying path variation ${index + 1}/${pathVariations.length}: ${path}`);
  
  // Create a new image to test the path
  const testImg = new Image();
  testImg.onload = function() {
    // This path works, use it
    console.log('Found working path:', path);
    img.src = path.startsWith('/') ? path : `/${path}`;
    img.removeAttribute('data-retrying');
  };
  
  testImg.onerror = function() {
    // Try next variation
    tryNextPath(img, pathVariations, index + 1);
  };
  
  // Set source to test
  testImg.src = path.startsWith('/') ? path : `/${path}`;
} 