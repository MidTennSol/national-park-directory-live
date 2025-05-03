const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const rimraf = promisify(require('rimraf'));

async function cleanDist() {
  const distPath = path.join(process.cwd(), 'dist');
  
  console.log('🧹 Cleaning dist directory...');
  
  try {
    // Check if dist exists
    if (fs.existsSync(distPath)) {
      // Remove everything in dist
      await rimraf(path.join(distPath, '*'));
      console.log('✅ Dist directory cleaned successfully');
    } else {
      console.log('📂 Dist directory does not exist, creating it...');
      fs.mkdirSync(distPath);
      console.log('✅ Dist directory created');
    }
  } catch (error) {
    console.error('❌ Error cleaning dist directory:', error);
    process.exit(1);
  }
}

cleanDist(); 