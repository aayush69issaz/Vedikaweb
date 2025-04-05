const fs = require('fs');
const path = require('path');
const ejs = require('ejs');

// Create public directory if it doesn't exist
const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
}

// Copy styles.css to public directory
const stylesSource = path.join(__dirname, '..', 'public', 'styles.css');
const stylesDest = path.join(publicDir, 'styles.css');
if (fs.existsSync(stylesSource)) {
    fs.copyFileSync(stylesSource, stylesDest);
}

// Copy photos directory if it exists
const photosSource = path.join(__dirname, '..', 'photos');
const photosDest = path.join(publicDir, 'photos');
if (fs.existsSync(photosSource)) {
    if (!fs.existsSync(photosDest)) {
        fs.mkdirSync(photosDest, { recursive: true });
    }
    const files = fs.readdirSync(photosSource);
    files.forEach(file => {
        fs.copyFileSync(
            path.join(photosSource, file),
            path.join(photosDest, file)
        );
    });
}

// Copy models directory if it exists
const modelsSource = path.join(__dirname, '..', 'models');
const modelsDest = path.join(publicDir, 'models');
if (fs.existsSync(modelsSource)) {
    if (!fs.existsSync(modelsDest)) {
        fs.mkdirSync(modelsDest, { recursive: true });
    }
    const files = fs.readdirSync(modelsSource);
    files.forEach(file => {
        fs.copyFileSync(
            path.join(modelsSource, file),
            path.join(modelsDest, file)
        );
    });
}

// Read photos directory
const photosDir = path.join(publicDir, 'photos');
const photos = [];
if (fs.existsSync(photosDir)) {
    const files = fs.readdirSync(photosDir);
    photos.push(...files.filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
    }));
}

// Read and render the EJS template
const templatePath = path.join(__dirname, '..', 'views', 'index.ejs');
const template = fs.readFileSync(templatePath, 'utf8');
const html = ejs.render(template, { 
    title: 'For My Love',
    photos: photos
});

// Write the rendered HTML to public/index.html
fs.writeFileSync(path.join(publicDir, 'index.html'), html);

console.log('Build completed successfully!'); 