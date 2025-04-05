const fs = require('fs');
const path = require('path');
const ejs = require('ejs');

// Create public directory if it doesn't exist
const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
}

// Create music directory
const musicDir = path.join(publicDir, 'music');
if (!fs.existsSync(musicDir)) {
    fs.mkdirSync(musicDir, { recursive: true });
}

// Copy music file if it exists
const musicSource = path.join(__dirname, '..', 'music', 'our-song.mp3');
if (fs.existsSync(musicSource)) {
    fs.copyFileSync(musicSource, path.join(musicDir, 'our-song.mp3'));
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

// Copy models directory if it exists
const modelsDir = path.join(__dirname, '..', 'models');
if (fs.existsSync(modelsDir)) {
    const publicModelsDir = path.join(publicDir, 'models');
    if (!fs.existsSync(publicModelsDir)) {
        fs.mkdirSync(publicModelsDir, { recursive: true });
    }
    const files = fs.readdirSync(modelsDir);
    files.forEach(file => {
        fs.copyFileSync(
            path.join(modelsDir, file),
            path.join(publicModelsDir, file)
        );
    });
}

console.log('Build completed successfully!'); 