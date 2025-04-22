const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Function to update imports in a file
function updateImports(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace all imports from @repo/ui/components/ui/* to @repo/ui
  const updatedContent = content.replace(
    /from '@repo\/ui\/components\/ui\/([^']+)'/g,
    (match, component) => {
      return `from '@repo/ui'`;
    }
  );

  if (content !== updatedContent) {
    fs.writeFileSync(filePath, updatedContent);
    console.log(`Updated imports in ${filePath}`);
  }
}

// Function to find all TypeScript and JavaScript files
function findFiles(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !filePath.includes('node_modules')) {
      findFiles(filePath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      updateImports(filePath);
    }
  });
}

// Start from the apps/customer-pwa directory
const startDir = path.join(process.cwd(), 'apps', 'customer-pwa');
findFiles(startDir);

console.log('Import update complete!'); 