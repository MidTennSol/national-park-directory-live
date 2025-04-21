# Netlify Deployment Instructions

This Astro.js project is configured for deployment on Netlify. Follow these instructions for a successful deployment:

## Requirements

- Node.js version: 20.3.0 (specified in .nvmrc and .node-version)
- Package manager: npm (not yarn or pnpm)

## Build Settings

These settings should be configured in the Netlify UI:

- Build command: `npm run build`
- Publish directory: `dist`
- Node.js version: 20.3.0

## Important Notes

- This project does NOT use Go, Ruby, Python, or any other language runtime. Only Node.js is needed.
- If you see errors related to 'mise' or Go installation, disable any automatic language detection in the Netlify UI.
- Make sure the Netlify build environment is using npm and not yarn or pnpm.

## Troubleshooting

If you encounter build errors:

1. Check that the Node.js version is set to 20.3.0
2. Verify that no build plugins are trying to install Go or other runtimes
3. Disable auto-installation features if enabled
4. Ensure all project files are at the root level of the repository (not in subdirectories)

The netlify.toml file in this project should handle most configuration automatically. 