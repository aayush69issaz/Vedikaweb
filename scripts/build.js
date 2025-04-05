const fs = require('fs');
const path = require('path');

// Create public directory if it doesn't exist
const publicDir = path.join(__dirname, '../public');
if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
}

// Copy views directory
const viewsSource = path.join(__dirname, '../views');
const viewsDest = path.join(publicDir, 'views');

if (!fs.existsSync(viewsDest)) {
    fs.mkdirSync(viewsDest, { recursive: true });
}

// Copy all files from views to public/views
const copyDir = (src, dest) => {
    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            fs.mkdirSync(destPath, { recursive: true });
            copyDir(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
};

copyDir(viewsSource, viewsDest);

// Copy server.js
const serverSource = path.join(__dirname, '../server.js');
const serverDest = path.join(publicDir, 'server.js');
fs.copyFileSync(serverSource, serverDest);

console.log('Build completed successfully!'); 