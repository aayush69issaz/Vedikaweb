const fs = require('fs');
const path = require('path');
const ejs = require('ejs');

// Create public directory if it doesn't exist
const publicDir = path.join(__dirname, '../public');
if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
}

// Copy styles.css if it exists
const stylesPath = path.join(__dirname, '../styles.css');
if (fs.existsSync(stylesPath)) {
    fs.copyFileSync(stylesPath, path.join(publicDir, 'styles.css'));
}

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

// Get photos list safely
let photos = [];
if (fs.existsSync(photosDir)) {
    photos = fs.readdirSync(photosDir).filter(file => 
        file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png')
    );
}

// Copy index.html directly to public directory
const indexHtmlPath = path.join(__dirname, '../public/index.html');
if (fs.existsSync(indexHtmlPath)) {
    fs.copyFileSync(indexHtmlPath, path.join(publicDir, 'index.html'));
} else {
    // If index.html doesn't exist, create a basic one
    const basicHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>For My Love</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <h1>For My Love</h1>
    </div>
</body>
</html>`;
    fs.writeFileSync(path.join(publicDir, 'index.html'), basicHtml);
}

console.log('Build completed successfully!'); 