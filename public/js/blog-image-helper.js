/**
 * Blog Image Helper
 * 
 * This script provides guidance for blog image uploads:
 * - Validates image dimensions (1200×800px recommended)
 * - Checks file size (under 500KB recommended)
 * - Suggests proper naming conventions
 * - Provides visual feedback
 */

document.addEventListener('DOMContentLoaded', () => {
  console.log('Blog image helper loaded');
  
  // Add info panel to admin blog image upload sections
  const uploadSections = document.querySelectorAll('.blog-image-upload');
  if (uploadSections.length > 0) {
    uploadSections.forEach(section => {
      addInfoPanel(section);
    });
  }
  
  // Check for file inputs related to blog images
  const fileInputs = document.querySelectorAll('input[type="file"][accept*="image"]');
  fileInputs.forEach(input => {
    input.addEventListener('change', validateImage);
  });
});

/**
 * Adds an information panel with upload guidelines
 */
function addInfoPanel(element) {
  const infoPanel = document.createElement('div');
  infoPanel.className = 'blog-image-guidelines p-4 bg-blue-50 rounded-lg mt-2 text-sm';
  infoPanel.innerHTML = `
    <h4 class="font-semibold text-blue-700 mb-2">Blog Image Guidelines</h4>
    <ul class="list-disc pl-5 space-y-1 text-blue-800">
      <li>Recommended size: 1200×800 pixels</li>
      <li>Max file size: 500KB</li>
      <li>Format: JPG, PNG, or WebP</li>
      <li>Filename: Use kebab-case (e.g., yellowstone-trails.jpg)</li>
    </ul>
  `;
  element.appendChild(infoPanel);
}

/**
 * Validates uploaded images and provides feedback
 */
function validateImage(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  // Create feedback container if it doesn't exist
  let feedbackEl = event.target.parentElement.querySelector('.image-feedback');
  if (!feedbackEl) {
    feedbackEl = document.createElement('div');
    feedbackEl.className = 'image-feedback mt-3';
    event.target.parentElement.appendChild(feedbackEl);
  }
  
  // Clear previous feedback
  feedbackEl.innerHTML = '';
  
  // Check filename format
  const filenameRegex = /^[a-z0-9]+(-[a-z0-9]+)*\.(jpg|jpeg|png|webp)$/i;
  const filenameValid = filenameRegex.test(file.name);
  
  // Check file size (500KB = 512000 bytes)
  const sizeValid = file.size <= 512000;
  
  // Create image to check dimensions
  const img = new Image();
  img.src = URL.createObjectURL(file);
  
  img.onload = function() {
    // Check dimensions (1200×800 recommended, allow some flexibility)
    const dimensionsIdeal = (img.width === 1200 && img.height === 800);
    const dimensionsAcceptable = (img.width >= 1000 && img.width <= 1600 && img.height >= 600 && img.height <= 1000);
    
    // Create feedback message
    const feedbackItems = [];
    
    // Add filename feedback
    if (!filenameValid) {
      feedbackItems.push(`
        <div class="text-yellow-700">
          <span class="font-semibold">⚠️ Filename:</span> "${file.name}" doesn't follow kebab-case.
          <span class="block text-xs">Recommended: lowercase with hyphens (e.g., yellowstone-trails.jpg)</span>
        </div>
      `);
    }
    
    // Add size feedback
    if (!sizeValid) {
      const sizeMB = (file.size / 1024 / 1024).toFixed(2);
      feedbackItems.push(`
        <div class="text-yellow-700">
          <span class="font-semibold">⚠️ File size:</span> ${sizeMB}MB exceeds the recommended 500KB.
          <span class="block text-xs">Please optimize your image before uploading.</span>
        </div>
      `);
    }
    
    // Add dimension feedback
    if (!dimensionsIdeal) {
      if (dimensionsAcceptable) {
        feedbackItems.push(`
          <div class="text-blue-700">
            <span class="font-semibold">ℹ️ Dimensions:</span> ${img.width}×${img.height}px
            <span class="block text-xs">Acceptable, but 1200×800px is ideal.</span>
          </div>
        `);
      } else {
        feedbackItems.push(`
          <div class="text-yellow-700">
            <span class="font-semibold">⚠️ Dimensions:</span> ${img.width}×${img.height}px
            <span class="block text-xs">Recommended: 1200×800px</span>
          </div>
        `);
      }
    }
    
    // If all valid, show success message
    if (filenameValid && sizeValid && (dimensionsIdeal || dimensionsAcceptable)) {
      feedbackEl.innerHTML = `
        <div class="p-3 bg-green-50 rounded border border-green-200 text-green-700">
          ✅ Image meets all guidelines! (${img.width}×${img.height}px, ${(file.size / 1024).toFixed(1)}KB)
        </div>
      `;
    } else {
      // Show warnings/suggestions
      feedbackEl.innerHTML = `
        <div class="p-3 bg-yellow-50 rounded border border-yellow-200 space-y-2">
          ${feedbackItems.join('')}
        </div>
      `;
    }
    
    // Release object URL
    URL.revokeObjectURL(img.src);
  };
} 