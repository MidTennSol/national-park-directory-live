#!/bin/bash

# Print banner
echo "======================================================"
echo "Starting debug build process for Astro project"
echo "======================================================"

# Print system info
echo "SYSTEM INFORMATION:"
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"
echo "Python version: $(python --version 2>&1 || python3 --version 2>&1 || echo 'Python not found')"
echo "Ruby version: $(ruby --version 2>&1 || echo 'Ruby not found')"
echo "Operating system: $(uname -a)"
echo "Current directory: $(pwd)"
echo "Directory contents:"
ls -la

# Print environment variables
echo "======================================================"
echo "ENVIRONMENT VARIABLES:"
env | sort

# Handle Python setup - this can help with node-gyp and other native dependencies
echo "======================================================"
echo "SETTING UP PYTHON:"
# Try to ensure Python is available
if command -v python3 &> /dev/null; then
    echo "Python 3 is available: $(python3 --version 2>&1)"
elif command -v python &> /dev/null; then
    echo "Python is available: $(python --version 2>&1)"
else
    echo "Warning: Python not found, some npm packages might fail to install"
fi

# Handle Ruby setup
echo "======================================================"
echo "SETTING UP RUBY:"
# Try to ensure Ruby is available
if command -v ruby &> /dev/null; then
    echo "Ruby is available: $(ruby --version 2>&1)"
    # Check for Ruby gems that might be needed
    if command -v gem &> /dev/null; then
        echo "Gem is available: $(gem --version 2>&1)"
        echo "List of installed gems:"
        gem list
    else
        echo "Warning: gem command not found"
    fi
else
    echo "Warning: Ruby not found"
fi

# Create empty Gemfile.lock if it doesn't exist
if [ ! -f Gemfile.lock ]; then
    echo "Creating empty Gemfile.lock"
    touch Gemfile.lock
fi

# Install dependencies with detailed output
echo "======================================================"
echo "INSTALLING DEPENDENCIES:"
# Add --no-optional to skip optional dependencies that might require Python
npm install --verbose --no-optional || npm install --verbose --no-optional --legacy-peer-deps

# If still failing, try a more minimal install
if [ $? -ne 0 ]; then
    echo "Standard install failed, trying minimal install..."
    npm install --verbose --production --no-optional --legacy-peer-deps
fi

# Run the build with detailed output
echo "======================================================"
echo "RUNNING BUILD:"
npm run build

# Print final status
echo "======================================================"
echo "BUILD PROCESS COMPLETED"
echo "Exit code: $?"
echo "======================================================" 