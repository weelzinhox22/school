// This file fixes Vercel build issues by ensuring proper SPA routing
const fs = require('fs');
const path = require('path');

// Function to ensure the output directory exists
function ensureDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  }
}

// Main execution
try {
  // Create Vercel output structure
  const vercelOutputPath = path.join(__dirname, '.vercel', 'output');
  const staticPath = path.join(vercelOutputPath, 'static');
  
  ensureDirectory(vercelOutputPath);
  ensureDirectory(staticPath);
  
  // Create Vercel config file
  const configPath = path.join(vercelOutputPath, 'config.json');
  const configContent = {
    version: 3,
    routes: [
      { handle: "filesystem" },
      { src: "/(.*)", dest: "/index.html" }
    ]
  };
  
  fs.writeFileSync(configPath, JSON.stringify(configContent, null, 2));
  console.log(`Created Vercel config at: ${configPath}`);
  
  // Create or update vercel.json at the root of the client folder
  const vercelJsonPath = path.join(__dirname, 'vercel.json');
  const vercelJsonContent = {
    version: 2,
    routes: [
      { handle: "filesystem" },
      { src: "/(.*)", dest: "/index.html" }
    ]
  };
  
  fs.writeFileSync(vercelJsonPath, JSON.stringify(vercelJsonContent, null, 2));
  console.log(`Created/updated vercel.json at: ${vercelJsonPath}`);
  
  console.log('Vercel build fix completed successfully!');
} catch (error) {
  console.error('Error in fix-vercel-build script:', error);
  process.exit(1);
} 