#!/bin/bash

# Print banner
echo "======================================================"
echo "Starting debug build process for Astro project"
echo "======================================================"

# Print system info
echo "SYSTEM INFORMATION:"
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"
echo "Operating system: $(uname -a)"
echo "Current directory: $(pwd)"
echo "Directory contents:"
ls -la

# Print environment variables
echo "======================================================"
echo "ENVIRONMENT VARIABLES:"
env | sort

# Install dependencies with detailed output
echo "======================================================"
echo "INSTALLING DEPENDENCIES:"
npm install --verbose

# Run the build with detailed output
echo "======================================================"
echo "RUNNING BUILD:"
npm run build

# Print final status
echo "======================================================"
echo "BUILD PROCESS COMPLETED"
echo "Exit code: $?"
echo "======================================================" 