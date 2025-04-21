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

# Run the build
echo "======================================================"
echo "RUNNING BUILD:"
NODE_OPTIONS="--max-old-space-size=4096" npm run build

# Print final status
echo "======================================================"
echo "BUILD PROCESS COMPLETED"
echo "Exit code: $?"
echo "======================================================" 