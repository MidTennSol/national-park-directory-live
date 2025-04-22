#!/bin/bash

# Reset script to force a complete rebuild and clear Netlify's cache
echo "======================================================"
echo "STARTING COMPLETE RESET"
echo "======================================================"

# Remove build directories and caches
echo "Removing build artifacts and cache directories..."
rm -rf dist/
rm -rf .astro/
rm -rf node_modules/.cache/
rm -rf node_modules/.vite/

# Check content directory
echo "Verifying content directory structure..."
if [ -d "src/content/blog" ]; then
    echo "Blog content directory exists"
    echo "Contents:"
    ls -la src/content/blog/
else
    echo "Creating blog content directory..."
    mkdir -p src/content/blog
fi

# Rebuild dependencies if needed
echo "Reinstalling dependencies..."
npm ci

# Run the build with verbose logging
echo "Running build with verbose logging..."
NODE_OPTIONS="--trace-warnings --max-old-space-size=4096" npm run debug-build

echo "======================================================"
echo "RESET COMPLETED"
echo "======================================================" 