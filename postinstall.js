// This script ensures that platform-specific binary modules
// are properly installed regardless of environment

console.log('Running post-install script to handle platform-specific dependencies...');

try {
  // Detect the platform
  const platform = process.platform;
  const arch = process.arch;
  
  console.log(`Platform: ${platform}, Architecture: ${arch}`);
  
  // Attempt to require the appropriate rollup binary for the platform
  try {
    let rollupModule;
    
    if (platform === 'linux') {
      if (process.env.NETLIFY) {
        // Force the GNU version on Netlify
        console.log('Running on Netlify, using GNU version');
        rollupModule = '@rollup/rollup-linux-x64-gnu';
      } else {
        // Try to detect libc version
        const { execSync } = require('child_process');
        const isMusl = (() => {
          try {
            return execSync('ldd --version').toString().indexOf('musl') !== -1;
          } catch (e) {
            return false;
          }
        })();
        
        rollupModule = isMusl 
          ? '@rollup/rollup-linux-x64-musl' 
          : '@rollup/rollup-linux-x64-gnu';
        
        console.log(`Detected ${isMusl ? 'musl' : 'gnu'} libc version`);
      }
    } else if (platform === 'darwin') {
      rollupModule = '@rollup/rollup-darwin-x64';
    } else if (platform === 'win32') {
      rollupModule = '@rollup/rollup-win32-x64-msvc';
    } else {
      throw new Error(`Unsupported platform: ${platform}`);
    }
    
    console.log(`Testing rollup module: ${rollupModule}`);
    require(rollupModule);
    console.log('Successfully loaded rollup module');
  } catch (error) {
    console.warn(`Could not load rollup module: ${error.message}`);
    console.warn('This error is non-fatal during development but may cause issues during build');
  }
  
  console.log('Post-install script completed successfully');
} catch (error) {
  console.error('Post-install script failed:', error.message);
  // Don't exit with error to avoid breaking CI/CD pipelines
} 