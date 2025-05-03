# Troubleshooting Guide

## Common Issues

### Netlify Deployment Stuck Issue

#### Symptoms
- Live site not updating after Git pushes
- Netlify showing successful deploys but content remains stale
- Git-based deployments not reflecting changes
- Changes visible locally but not on production

#### Quick Fix
Run the automated deploy script:
```bash
npm run deploy
```

This script will:
1. Clean the dist directory
2. Run a fresh build
3. Deploy directly to Netlify

#### Manual Fix Steps
If you need to run the steps manually:

1. Clean build artifacts:
   ```powershell
   # Windows
   Remove-Item -Path dist\* -Recurse -Force
   
   # Unix
   rm -rf dist/*
   ```

2. Rebuild:
   ```bash
   npm run build
   ```

3. Force deploy:
   ```bash
   netlify deploy --prod
   ```

#### Prevention Measures
We have implemented several measures to prevent deployment issues:

1. **Cache-Busting Headers**
   - Added strict cache control headers in `netlify.toml`
   - HTML files are set to no-cache
   - Static assets have appropriate cache settings

2. **Pre-deploy Script**
   - Located at `scripts/pre-deploy.js`
   - Automatically cleans dist directory before builds
   - Integrated into the deploy npm script

3. **Automated Deploy Process**
   - Use `npm run deploy` for consistent deployments
   - Handles cleaning, building, and deploying in the correct order
   - Bypasses potential Git-based deployment issues

#### Understanding the Fix
The deployment issues were primarily caused by:
1. Cached build artifacts causing stale deployments
2. Git-based deploys not properly clearing previous builds
3. CDN caching of HTML content

Our solution addresses these by:
1. Forcing a clean build environment every time
2. Using direct Netlify CLI deployment
3. Implementing strict cache control headers
4. Providing a consistent deployment process

#### When to Use Each Solution

1. **Standard Deployment**
   - Use `npm run deploy` for most deployments
   - This is the safest and most reliable method

2. **Quick Changes**
   - For minor changes, Git-based deployment might still work
   - Monitor the changes to ensure they appear

3. **Emergency Fix**
   - If changes aren't appearing, use the manual steps
   - Always clean the dist directory first

#### Additional Notes

- The Netlify UI's "Clear cache and deploy site" option may not always be sufficient
- Always verify your changes are live after deployment
- If issues persist, check the Netlify deploy logs for errors
- Consider running `npm run debug-build` for detailed build information

## Getting Help

If you encounter issues not covered in this guide:

1. Check the Netlify deploy logs
2. Review the build output for errors
3. Verify your local build works correctly
4. Try the manual deployment steps
5. If problems persist, contact the development team 