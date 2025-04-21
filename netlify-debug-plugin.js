// Netlify Build Debug Plugin

module.exports = {
  onPreBuild: ({ utils }) => {
    console.log("=================== BUILD DEBUG INFO ===================");
    console.log("Node Version:", process.version);
    console.log("NPM Version:", process.env.npm_version || "Unknown");
    console.log("Environment Variables:");
    
    // Log relevant environment variables
    const relevantVars = [
      "NODE_ENV", "NODE_VERSION", "NETLIFY_USE_MISE", 
      "NETLIFY_USE_YARN", "NETLIFY_USE_PNPM", "RUBY_VERSION", 
      "PYTHON_VERSION", "DEBUG", "CI", "NODE_OPTIONS"
    ];
    
    for (const varName of relevantVars) {
      console.log(`  ${varName}:`, process.env[varName] || "Not set");
    }
    
    // Log system info
    console.log("System Info:");
    console.log("  Platform:", process.platform);
    console.log("  Architecture:", process.arch);
    
    console.log("Current Directory Contents:");
    try {
      const { execSync } = require('child_process');
      const output = execSync('ls -la').toString();
      console.log(output);
    } catch (error) {
      console.log("Error listing directory:", error.message);
    }
    
    console.log("Package.json Content:");
    try {
      const fs = require('fs');
      const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
      console.log(JSON.stringify(packageJson, null, 2));
    } catch (error) {
      console.log("Error reading package.json:", error.message);
    }
    
    console.log("=================== END DEBUG INFO ===================");
  },
  onBuild: ({ utils }) => {
    console.log("Build step initiated");
  },
  onError: ({ error }) => {
    console.log("Build error occurred:");
    console.log(error);
  }
}; 