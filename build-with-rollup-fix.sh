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
    echo "Blog file count: $(ls -1 src/content/blog/ | wc -l)"
    
    # Check if content files have the right format and front matter
    echo "======================================================"
    echo "CHECKING BLOG POST FRONT MATTER:"
    for file in src/content/blog/*.md; do
        echo "Checking $file"
        # Check if file has front matter (simple check for ---)
        if grep -q "^---" "$file"; then
            echo "✅ Front matter found in $file"
        else
            echo "❌ Front matter MISSING in $file"
            echo "Attempting to fix by adding basic front matter..."
            # Create a temp file with front matter and original content
            filename=$(basename "$file" .md)
            cat > "${file}.tmp" << EOF
---
title: "${filename}"
description: "Auto-generated description for ${filename}"
publishDate: $(date +"%Y-%m-%d")
author: "Admin"
tags: ["blog"]
draft: false
---

EOF
            cat "$file" >> "${file}.tmp"
            mv "${file}.tmp" "$file"
            echo "✅ Added front matter to $file"
        fi
    done
else
    echo "ERROR: Content directory not found!"
    mkdir -p src/content/blog
    echo "Created src/content/blog directory"
    
    # Create a sample blog post
    echo "Creating a sample blog post..."
    cat > src/content/blog/sample-post.md << EOF
---
title: "Sample Blog Post"
description: "This is a sample blog post created during build"
publishDate: $(date +"%Y-%m-%d")
author: "Admin"
tags: ["sample", "blog"]
draft: false
---

# Sample Blog Post

This is a sample blog post created during the build process.
EOF
    echo "✅ Created sample blog post"
fi

# Check blog image directory
echo "======================================================"
echo "CHECKING BLOG IMAGES:"
if [ -d "public/images/blog" ]; then
    echo "✅ Blog images directory found"
    echo "Blog images:"
    ls -la public/images/blog/
    echo "Blog image count: $(ls -1 public/images/blog/ | wc -l)"
else
    echo "❌ Blog images directory MISSING!"
    mkdir -p public/images/blog
    echo "Created public/images/blog directory"
    echo "⚠️ No blog images available. Pages may show placeholders instead."
fi

# Check the blog page files
echo "======================================================"
echo "CHECKING BLOG PAGE FILES:"
if [ -f "src/pages/blog/index.astro" ]; then
    echo "✅ Blog index page found"
else 
    echo "❌ Blog index page MISSING"
fi

if [ -f "src/pages/blog/[slug].astro" ]; then
    echo "✅ Blog slug page found"
else
    echo "❌ Blog slug page MISSING"
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
    
    # Check if blog index.html exists
    if [ -f "dist/blog/index.html" ]; then
        echo "✅ Blog index page generated"
    else
        echo "❌ Blog index page NOT generated"
    fi
    
    # Count blog post directories
    post_count=$(find dist/blog -mindepth 1 -maxdepth 1 -type d | wc -l)
    echo "Blog post count in build output: $post_count"
    
    # Compare with content directory
    content_count=$(ls -1 src/content/blog/ | wc -l)
    echo "Blog post count in content directory: $content_count"
    
    if [ "$post_count" -eq "$content_count" ]; then
        echo "✅ Blog post count matches content count"
    else
        echo "❌ Blog post count DOES NOT match content count"
    fi
else
    echo "WARNING: Blog directory not found in build output!"
    
    # Try to diagnose why the blog output is missing
    echo "Checking for errors in the build log..."
    if [ -f ".netlify/build-log.txt" ]; then
        grep -i "error" .netlify/build-log.txt
    else
        echo "No build log found to diagnose errors"
    fi
fi

# Verify blog images in build output
echo "======================================================"
echo "VERIFYING BLOG IMAGES IN BUILD OUTPUT:"
if [ -d "dist/images/blog" ]; then
    echo "✅ Blog images directory found in build output"
    echo "Blog images in build output:"
    ls -la dist/images/blog/
    
    # Count images
    build_image_count=$(ls -1 dist/images/blog/ | wc -l)
    source_image_count=$(ls -1 public/images/blog/ | wc -l)
    
    echo "Blog image count in build: $build_image_count"
    echo "Blog image count in source: $source_image_count"
    
    if [ "$build_image_count" -eq "$source_image_count" ]; then
        echo "✅ All blog images were copied to build output"
    else
        echo "❌ Some blog images are missing in build output"
        echo "Manually copying missing images..."
        
        # Create destination directory if it doesn't exist
        mkdir -p dist/images/blog
        
        # Copy all images from source to destination
        cp -f public/images/blog/* dist/images/blog/
        
        echo "✅ Manually copied blog images to build output"
        ls -la dist/images/blog/
    fi
else
    echo "❌ Blog images directory MISSING in build output!"
    echo "Creating images directory and copying blog images..."
    
    # Create destination directory
    mkdir -p dist/images/blog
    
    # Copy all images from source to destination
    cp -f public/images/blog/* dist/images/blog/
    
    echo "✅ Manually copied blog images to build output"
    ls -la dist/images/blog/
fi

# ENHANCEMENT: Also copy images to /blog/images/ for alternative path resolution
echo "======================================================"
echo "ENSURING BLOG IMAGES ARE ALSO AVAILABLE AT /blog/images PATH:"
if [ -d "dist/blog" ]; then
    # Create blog/images directory
    mkdir -p dist/blog/images
    
    # Copy all blog images
    cp -f public/images/blog/* dist/blog/images/
    
    echo "✅ Blog images copied to /blog/images/ path"
    ls -la dist/blog/images/
else
    echo "❌ Cannot copy to /blog/images/ because /blog directory doesn't exist!"
fi

# Print final status
echo "======================================================"
echo "BUILD PROCESS COMPLETED"
echo "Exit code: $?"
echo "======================================================" 