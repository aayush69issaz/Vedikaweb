const express = require('express');
const serverless = require('serverless-http');
const path = require('path');
const ejs = require('ejs');
const fs = require('fs');
const heicConvert = require('heic-convert');

const app = express();

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// Middleware
app.use(express.static(path.join(__dirname, '../public')));
app.use('/models', express.static(path.join(__dirname, '../public', 'models')));
app.use(express.static('public', {
    setHeaders: (res, path) => {
        if (path.endsWith('.mp4')) {
            res.setHeader('Content-Type', 'video/mp4');
        }
    }
}));

// Function to convert HEIC to JPG
async function convertHeicToJpg(heicPath, jpgPath) {
    try {
        console.log(`Converting ${heicPath} to JPG...`);
        const inputBuffer = await fs.promises.readFile(heicPath);
        const outputBuffer = await heicConvert({
            buffer: inputBuffer,
            format: 'JPEG',
            quality: 1
        });
        await fs.promises.writeFile(jpgPath, outputBuffer);
        console.log(`Successfully converted ${heicPath} to ${jpgPath}`);
        return true;
    } catch (err) {
        console.error('Error converting HEIC to JPG:', err);
        return false;
    }
}

// Function to get all image files from the photos directory
async function getPhotos() {
    const photosDir = path.join(__dirname, '../public', 'photos');
    try {
        console.log('Reading photos directory...');
        const files = fs.readdirSync(photosDir);
        const photos = [];
        
        for (const file of files) {
            const ext = path.extname(file).toLowerCase();
            const baseName = path.basename(file, ext);
            
            if (ext === '.heic') {
                // Convert HEIC to JPG
                const heicPath = path.join(photosDir, file);
                const jpgPath = path.join(photosDir, `${baseName}.jpg`);
                
                if (!fs.existsSync(jpgPath)) {
                    const success = await convertHeicToJpg(heicPath, jpgPath);
                    if (success) {
                        photos.push(`${baseName}.jpg`);
                    }
                } else {
                    photos.push(`${baseName}.jpg`);
                }
            } else if (['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext)) {
                photos.push(file);
            }
        }
        
        console.log(`Found ${photos.length} photos`);
        return photos;
    } catch (err) {
        console.error('Error reading photos directory:', err);
        return [];
    }
}

// Routes
app.get('/', async (req, res) => {
    try {
        const photos = await getPhotos();
        console.log('Rendering page with photos:', photos);
        res.render('index', { 
            title: 'For My Love',
            photos: photos
        });
    } catch (err) {
        console.error('Error rendering page:', err);
        res.status(500).send('Error loading page');
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Export the serverless function
module.exports.handler = serverless(app); 