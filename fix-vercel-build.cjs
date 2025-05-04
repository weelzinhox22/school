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

// Function to copy files recursively
function copyFilesRecursively(sourceDir, targetDir) {
  // Create the target directory if it doesn't exist
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // Read the contents of the source directory
  const items = fs.readdirSync(sourceDir);

  for (const item of items) {
    const sourcePath = path.join(sourceDir, item);
    const targetPath = path.join(targetDir, item);

    const stats = fs.statSync(sourcePath);
    if (stats.isDirectory()) {
      // Recursively copy subdirectories
      copyFilesRecursively(sourcePath, targetPath);
    } else {
      // Copy files
      fs.copyFileSync(sourcePath, targetPath);
      console.log(`Copied: ${sourcePath} -> ${targetPath}`);
    }
  }
}

// Main execution
try {
  const distPath = path.join(__dirname, 'dist');
  
  // Check if dist folder exists
  if (!fs.existsSync(distPath)) {
    console.error('Error: dist folder not found! Make sure the build completed successfully.');
    process.exit(1);
  }
  
  // Create Vercel output structure
  const vercelOutputPath = path.join(__dirname, '.vercel', 'output');
  const staticPath = path.join(vercelOutputPath, 'static');
  
  ensureDirectory(vercelOutputPath);
  ensureDirectory(staticPath);
  
  // Copy all files from dist to .vercel/output/static
  console.log('Copying dist files to Vercel static output...');
  copyFilesRecursively(distPath, staticPath);
  
  // Create _redirects file for SPA routing
  const redirectsPath = path.join(staticPath, '_redirects');
  fs.writeFileSync(redirectsPath, '/* /index.html 200');
  console.log(`Created _redirects file at: ${redirectsPath}`);
  
  // Create a 200.html file (some hosting providers use this for SPA routing)
  fs.copyFileSync(path.join(staticPath, 'index.html'), path.join(staticPath, '200.html'));
  console.log('Created 200.html file for SPA routing');
  
  // Create Vercel config file
  const configPath = path.join(vercelOutputPath, 'config.json');
  const configContent = {
    version: 3,
    routes: [
      { 
        src: "^/assets/(.*)",
        headers: { "cache-control": "public, max-age=31536000, immutable" },
        continue: true
      },
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
      { 
        src: "^/assets/(.*)",
        headers: { "cache-control": "public, max-age=31536000, immutable" },
        continue: true
      },
      { handle: "filesystem" },
      { src: "/(.*)", dest: "/index.html" }
    ],
    buildCommand: "npm run build",
    outputDirectory: "dist"
  };
  
  fs.writeFileSync(vercelJsonPath, JSON.stringify(vercelJsonContent, null, 2));
  console.log(`Created/updated vercel.json at: ${vercelJsonPath}`);
  
  console.log('Vercel build fix completed successfully!');
} catch (error) {
  console.error('Error in fix-vercel-build script:', error);
  process.exit(1);
} 