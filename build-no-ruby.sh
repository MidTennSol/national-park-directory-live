#!/bin/bash

# Print banner
echo "======================================================"
echo "Starting NO-RUBY build process for Astro project"
echo "======================================================"

# Unset any Ruby-related environment variables
echo "Unsetting Ruby environment variables..."
unset RUBY_VERSION
unset GEM_HOME
unset GEM_PATH
unset BUNDLE_PATH

# Install dependencies with detailed output
echo "======================================================"
echo "INSTALLING DEPENDENCIES:"
npm install --verbose --no-optional --no-package-lock || npm install --verbose --no-optional --no-package-lock --legacy-peer-deps

# Run the build with detailed output
echo "======================================================"
echo "RUNNING BUILD:"
npm run build

# Print final status
echo "======================================================"
echo "BUILD PROCESS COMPLETED"
echo "Exit code: $?"
echo "======================================================" 