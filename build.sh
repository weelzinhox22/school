#!/bin/bash

echo "Starting client build process..."

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

# Run the build
echo "Building client application..."
npm run build

# Ensure build succeeded
if [ ! -d "dist" ]; then
  echo "Error: Build failed, dist directory not found"
  exit 1
fi

# Run our fix script
echo "Running Vercel fix script..."
node fix-vercel-build.cjs

# Create _redirects file directly in dist (in case it wasn't copied)
echo "/* /index.html 200" > dist/_redirects
echo "Creating Vercel support files directly in dist..."

# Create a copy of index.html as 200.html in dist
cp dist/index.html dist/200.html

echo "Client build process completed successfully!" 