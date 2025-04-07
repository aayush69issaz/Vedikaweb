const fs = require('fs');
const path = require('path');
const ejs = require('ejs');

// Create public directory if it doesn't exist
const publicDir = path.join(__dirname, '../public');
if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
}

// Copy styles.css
fs.copyFileSync(
    path.join(__dirname, '../styles.css'),
    path.join(publicDir, 'styles.css')
);

// Copy photos directory if it exists
const photosDir = path.join(__dirname, '../photos');
if (fs.existsSync(photosDir)) {
    const publicPhotosDir = path.join(publicDir, 'photos');
    if (!fs.existsSync(publicPhotosDir)) {
        fs.mkdirSync(publicPhotosDir, { recursive: true });
    }
    const photos = fs.readdirSync(photosDir);
    photos.forEach(photo => {
        fs.copyFileSync(
            path.join(photosDir, photo),
            path.join(publicPhotosDir, photo)
        );
    });
}

// Copy models directory if it exists
const modelsDir = path.join(__dirname, '../models');
if (fs.existsSync(modelsDir)) {
    const publicModelsDir = path.join(publicDir, 'models');
    if (!fs.existsSync(publicModelsDir)) {
        fs.mkdirSync(publicModelsDir, { recursive: true });
    }
    const models = fs.readdirSync(modelsDir);
    models.forEach(model => {
        fs.copyFileSync(
            path.join(modelsDir, model),
            path.join(publicModelsDir, model)
        );
    });
}

// Read the photos directory to get image files
const photos = fs.readdirSync(photosDir).filter(file => 
    file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png')
);

// Render the EJS template
const template = fs.readFileSync(path.join(__dirname, '../views/index.ejs'), 'utf8');
const html = ejs.render(template, { photos });

// Write the rendered HTML to public/index.html
fs.writeFileSync(path.join(publicDir, 'index.html'), html);

console.log('Build completed successfully!'); 