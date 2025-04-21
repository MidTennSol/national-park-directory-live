/**
 * Image fallback utility
 * This script will handle image loading errors and apply fallbacks
 */
document.addEventListener('DOMContentLoaded', () => {
  console.log('Image fallback script loaded');
  
  // Find all park card and detail images
  const parkImages = document.querySelectorAll('.park-card-image, .park-detail-image, .gallery-image');
  console.log(`Found ${parkImages.length} park images to monitor`);
  
  // Add error handler to all images
  parkImages.forEach(img => {
    // Log details for debugging
    if (img.complete) {
      console.log(`Image already loaded or errored: ${img.src}`);
      console.log(`- naturalWidth: ${img.naturalWidth}, naturalHeight: ${img.naturalHeight}`);
    }
    
    img.addEventListener('load', function() {
      console.log(`Image loaded successfully: ${this.src}`);
      this.classList.add('image-loaded');
      
      // Try to hide the placeholder if it exists
      const placeholderDiv = this.parentElement?.querySelector('div[aria-hidden="true"]');
      if (placeholderDiv) {
        placeholderDiv.classList.add('hidden');
      }
    });
    
    img.addEventListener('error', function() {
      console.log(`Image failed to load: ${this.src}`);
      
      // Only apply fallback if it's not already the fallback image
      if (!this.src.includes('park-placeholder.svg')) {
        console.log(`Applying fallback to: ${this.src}`);
        this.src = '/images/park-placeholder.svg';
        this.classList.add('fallback-applied');
      }
    });
    
    // Force reload of images that might be in error state
    if (img.complete && (img.naturalWidth === 0 || img.naturalHeight === 0)) {
      console.log('Image already in error state:', img.src);
      img.src = '/images/park-placeholder.svg';
      img.classList.add('fallback-applied');
    }
  });
  
  // Check for broken images 2 seconds after page load
  // This catches images that might show the broken image icon but don't trigger the error event
  setTimeout(() => {
    console.log('Running delayed image check');
    document.querySelectorAll('img').forEach(img => {
      if (img.complete && (img.naturalWidth === 0 || img.naturalHeight === 0)) {
        console.log('Delayed check: Found broken image:', img.src);
        
        // Only apply fallback if it's a park image and not already the fallback
        if ((img.classList.contains('park-card-image') || 
             img.classList.contains('park-detail-image') || 
             img.classList.contains('gallery-image')) && 
            !img.src.includes('park-placeholder.svg')) {
          
          console.log('Applying fallback during delayed check');
          img.src = '/images/park-placeholder.svg';
          img.classList.add('fallback-applied');
        }
      }
    });
  }, 2000);
}); 