#!/bin/bash

# Stop any running processes
echo "🛑 Stopping any running processes..."
pkill -f "node|npm|vite|vercel" 2>/dev/null || echo "No processes to stop"

# Remove node_modules and lock files
echo "🧹 Cleaning up node modules and build artifacts..."
rm -rf node_modules
rm -f package-lock.json
rm -f pnpm-lock.yaml
rm -f yarn.lock

# Remove build and cache directories
echo "🗑️ Removing build and cache directories..."
rm -rf build
rm -rf dist
rm -rf .vercel
rm -rf .vite
rm -rf .next
rm -rf coverage
rm -rf .idea

# Remove environment files (keep .env.example)
if [ -f ".env" ] && [ ! -f ".env.example" ]; then
  echo "⚠️  Backing up .env to .env.example"
  cp .env .env.example
fi
rm -f .env.local
rm -f .env.development.local
rm -f .env.test.local
rm -f .env.production.local

# Remove log files
echo "📝 Cleaning up log files..."
rm -f *.log
rm -f npm-debug.log*
rm -f yarn-debug.log*
rm -f yarn-error.log*
rm -f firebase-debug.log

# Initialize fresh git repository
echo "🔄 Initializing fresh git repository..."
rm -rf .git

# Create .gitignore file
echo "📋 Creating .gitignore file..."
cat > .gitignore << 'EOL'
# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/

# Production
build/
dist/
.next/
out/

# Misc
.DS_Store
*.pem

# Debug logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
firebase-debug.log

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Editor directories and files
.idea/
.vscode/
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# Vercel
.vercel

# Vite
.vite/

# Local development
*.local
EOL

# Install fresh dependencies
echo "📦 Installing fresh dependencies..."
npm install

# Create production build
echo "🔨 Creating production build..."
npm run build

echo -e "\n✅ Cleanup complete! The project is ready for GitHub and Vercel deployment."
echo "Next steps:"
echo "1. Create a new repository on GitHub"
echo "2. Run: git init"
echo "3. Run: git add ."
echo "4. Run: git commit -m 'Initial commit'"
echo "5. Follow GitHub instructions to add remote and push"
echo "6. Deploy to Vercel by importing the GitHub repository"
