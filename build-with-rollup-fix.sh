#!/bin/bash

# Print banner
echo "======================================================"
echo "Starting Rollup-focused build process for Astro project"
echo "======================================================"

# Check for Linux
if [[ $(uname -s) == "Linux" ]]; then
    echo "Linux detected, explicitly installing rollup-linux-x64-gnu..."
    
    # First remove any existing package to avoid conflicts
    rm -rf node_modules/@rollup/rollup-linux-x64-gnu || true
    
    # Install GNU version explicitly
    npm install @rollup/rollup-linux-x64-gnu --no-save
    
    # Verify it exists
    if [ -d "node_modules/@rollup/rollup-linux-x64-gnu" ]; then
        echo "Successfully installed @rollup/rollup-linux-x64-gnu"
        ls -la node_modules/@rollup/rollup-linux-x64-gnu
    else
        echo "Failed to install the module - trying another approach"
        
        # Try another approach with npm ci
        rm -rf node_modules
        npm ci
        npm install @rollup/rollup-linux-x64-gnu --no-save
    fi
fi

# Verify content directory exists and contains blog files
echo "======================================================"
echo "VERIFYING CONTENT DIRECTORY:"
if [ -d "src/content/blog" ]; then
    echo "Content directory found"
    echo "Blog files:"
    ls -la src/content/blog/
else
    echo "ERROR: Content directory not found!"
    mkdir -p src/content/blog
    echo "Created src/content/blog directory"
fi

# Run the build
echo "======================================================"
echo "RUNNING BUILD:"
NODE_OPTIONS="--max-old-space-size=4096" npm run build

# Verify build directory includes blog content
echo "======================================================"
echo "VERIFYING BUILD OUTPUT:"
if [ -d "dist/blog" ]; then
    echo "Blog directory in build output found"
    ls -la dist/blog/
else
    echo "WARNING: Blog directory not found in build output!"
fi

# Print final status
echo "======================================================"
echo "BUILD PROCESS COMPLETED"
echo "Exit code: $?"
echo "======================================================" 