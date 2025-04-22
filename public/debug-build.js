/**
 * Debug Build Script
 * 
 * This script will output information about the current build to help diagnose
 * issues with content not displaying correctly.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Create debug container
  const debugContainer = document.createElement('div');
  debugContainer.id = 'build-debug-info';
  debugContainer.style.cssText = 'position:fixed; bottom:0; right:0; background:rgba(0,0,0,0.8); color:white; padding:10px; z-index:9999; font-family:monospace; font-size:12px; max-width:400px; max-height:300px; overflow:auto;';
  
  // Add build timestamp
  const timestamp = document.createElement('div');
  timestamp.textContent = `Build Time: ${new Date().toISOString()}`;
  debugContainer.appendChild(timestamp);
  
  // Add path info
  const pathInfo = document.createElement('div');
  pathInfo.textContent = `Current Path: ${window.location.pathname}`;
  debugContainer.appendChild(pathInfo);
  
  // Check for content collections
  const contentCheck = document.createElement('div');
  fetch('/content-check.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Content check file not found');
      }
      return response.json();
    })
    .then(data => {
      contentCheck.textContent = `Content Check: ${JSON.stringify(data)}`;
    })
    .catch(error => {
      contentCheck.textContent = `Content Check: Error - ${error.message}`;
    });
  debugContainer.appendChild(contentCheck);
  
  // Add DOM structure info
  const domInfo = document.createElement('div');
  const blogElements = document.querySelectorAll('.blog-content, article, .blog-post');
  domInfo.textContent = `Blog Elements: ${blogElements.length} found`;
  debugContainer.appendChild(domInfo);
  
  // Add scripts info
  const scriptsInfo = document.createElement('div');
  const scripts = Array.from(document.querySelectorAll('script')).map(s => s.src || 'inline');
  scriptsInfo.textContent = `Scripts: ${scripts.length} loaded`;
  debugContainer.appendChild(scriptsInfo);
  
  // Add close button
  const closeButton = document.createElement('button');
  closeButton.textContent = 'Close';
  closeButton.style.cssText = 'margin-top:10px; padding:3px 8px; background:#f44336; border:none; color:white; cursor:pointer;';
  closeButton.addEventListener('click', () => {
    document.body.removeChild(debugContainer);
  });
  debugContainer.appendChild(closeButton);
  
  // Add to body
  document.body.appendChild(debugContainer);
}); 