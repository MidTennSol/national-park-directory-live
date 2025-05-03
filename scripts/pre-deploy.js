import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { rm, mkdir } from 'fs/promises';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function cleanDist() {
  const distPath = join(dirname(__dirname), 'dist');
  
  console.log('🧹 Cleaning dist directory...');
  
  try {
    // Check if dist exists
    try {
      await fs.access(distPath);
      // Remove everything in dist
      await rm(distPath, { recursive: true, force: true });
      console.log('✅ Dist directory cleaned successfully');
    } catch {
      console.log('📂 Dist directory does not exist, creating it...');
    }
    
    // Create fresh dist directory
    await mkdir(distPath, { recursive: true });
    console.log('✅ Dist directory ready');
    
  } catch (error) {
    console.error('❌ Error cleaning dist directory:', error);
    process.exit(1);
  }
}

cleanDist(); 