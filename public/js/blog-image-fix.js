/**
 * Blog Image Fix - Version 2.0
 * 
 * This script is a direct fix for blog image paths on Netlify sites
 * It specifically targets blog images and handles all possible path variations
 * Includes detailed logging for debugging
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('🔍 Blog Image Fix v2.0 activated');
  
  // Function to get site info
  const getSiteInfo = () => {
    const isNetlify = window.location.hostname.includes('netlify.app');
    const isProduction = !window.location.hostname.includes('localhost') && !window.location.hostname.includes('127.0.0.1');
    const hostname = window.location.hostname;
    const path = window.location.pathname;
    
    return { isNetlify, isProduction, hostname, path };
  };
  
  // Log site info
  const siteInfo = getSiteInfo();
  console.log('Site environment:', siteInfo);
  
  // Get all blog images by both class and data attribute
  const blogImages = document.querySelectorAll('.blog-content img, [data-blog-image], img[src*="blog"]');
  console.log(`Found ${blogImages.length} blog images to process`);
  
  if (blogImages.length === 0) {
    return; // Exit if no images found
  }
  
  // Function to generate path variations for an image
  const getPathVariations = (originalPath) => {
    if (!originalPath) return [];
    
    // Get just the filename
    const filename = originalPath.split('/').pop();
    
    // List of path variations to try, in order of priority
    return [
      originalPath,                    // Original path
      `/images/blog/${filename}`,      // Preferred format with /images/blog/ prefix
      `/blog/images/${filename}`,      // Alternative format with /blog/images/ prefix
      `images/blog/${filename}`,       // Without leading slash
      `blog/images/${filename}`,       // Without leading slash (alternative)
      `/public/images/blog/${filename}`, // Try with /public prefix
      `/assets/images/blog/${filename}`, // Try with /assets prefix
      `/img/blog/${filename}`,         // Try with /img prefix
      `/blog/${filename}`,             // Try directly in blog folder
      `/${filename}`                   // Try at root
    ];
  };
  
  // Function to attempt loading with the provided path
  const tryLoadImage = (img, path, index, variations) => {
    console.log(`Trying path ${index+1}/${variations.length}: ${path}`);
    
    // Create test image
    const testImg = new Image();
    
    testImg.onload = () => {
      console.log(`✅ SUCCESS! Image loaded from: ${path}`);
      img.src = path;
      img.classList.add('image-loaded');
      img.classList.add('image-fixed');
      img.dataset.fixedPath = path;
      img.removeAttribute('data-retrying');
    };
    
    testImg.onerror = () => {
      console.log(`❌ Failed to load from: ${path}`);
      
      // Try next path if available
      if (index < variations.length - 1) {
        tryLoadImage(img, variations[index + 1], index + 1, variations);
      } else {
        console.log('All paths failed, using fallback image');
        img.src = '/images/park-placeholder.svg';
        img.classList.add('fallback-applied');
        img.removeAttribute('data-retrying');
      }
    };
    
    // Start loading test image
    testImg.src = path;
  };
  
  // Process each blog image
  blogImages.forEach((img, imgIndex) => {
    // Skip if already processed
    if (img.classList.contains('image-fixed') || img.src.includes('placeholder')) {
      return;
    }
    
    // Log the image we're processing
    console.log(`Processing image ${imgIndex+1}: ${img.src}`);
    
    // Original source (from src or data attribute)
    const originalSrc = img.dataset.originalPath || img.src;
    
    // Generate path variations
    const pathVariations = getPathVariations(originalSrc);
    console.log('Generated path variations:', pathVariations);
    
    // Check if image is already in error state or is not yet loaded
    if (img.complete) {
      if (img.naturalWidth === 0) {
        console.log('Image is in error state, trying alternative paths');
        img.dataset.retrying = 'true';
        tryLoadImage(img, pathVariations[0], 0, pathVariations);
      } else {
        console.log('Image already loaded successfully with original path');
        img.classList.add('image-fixed');
      }
    } else {
      // Add error handler for images not yet loaded
      img.addEventListener('error', function() {
        if (img.dataset.retrying) return; // Avoid retry loops
        
        console.log('Image failed to load:', img.src);
        img.dataset.retrying = 'true';
        tryLoadImage(img, pathVariations[0], 0, pathVariations);
      });
    }
  });
  
  // Create a visual indicator for debug mode
  if (window.location.search.includes('debug=true')) {
    const debugDiv = document.createElement('div');
    debugDiv.style.position = 'fixed';
    debugDiv.style.bottom = '10px';
    debugDiv.style.right = '10px';
    debugDiv.style.backgroundColor = 'rgba(0,0,0,0.7)';
    debugDiv.style.color = 'white';
    debugDiv.style.padding = '10px';
    debugDiv.style.borderRadius = '5px';
    debugDiv.style.zIndex = '9999';
    debugDiv.style.fontSize = '12px';
    debugDiv.innerHTML = `
      <p>Blog Image Fix v2.0 Active</p>
      <p>Images found: ${blogImages.length}</p>
      <p>Environment: ${siteInfo.isProduction ? 'Production' : 'Development'}</p>
      <p>Netlify: ${siteInfo.isNetlify ? 'Yes' : 'No'}</p>
    `;
    document.body.appendChild(debugDiv);
  }
}); 