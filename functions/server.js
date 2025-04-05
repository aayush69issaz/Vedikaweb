const express = require('express');
const serverless = require('serverless-http');
const path = require('path');
const ejs = require('ejs');
const fs = require('fs');
const heicConvert = require('heic-convert');

const app = express();

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../public/views'));

// Middleware
app.use(express.static(path.join(__dirname, '../public')));
app.use('/models', express.static(path.join(__dirname, '../public/models')));

// Function to convert HEIC to JPG
async function convertHeicToJpg(heicBuffer) {
    try {
        const jpgBuffer = await heicConvert({
            buffer: heicBuffer,
            format: 'JPEG',
            quality: 1
        });
        return jpgBuffer;
    } catch (error) {
        console.error('Error converting HEIC to JPG:', error);
        return null;
    }
}

// Function to get photos
async function getPhotos() {
    const photosDir = path.join(__dirname, '../public/photos');
    const files = fs.readdirSync(photosDir);
    const photos = [];

    for (const file of files) {
        if (file.toLowerCase().endsWith('.heic')) {
            const heicPath = path.join(photosDir, file);
            const heicBuffer = fs.readFileSync(heicPath);
            const jpgBuffer = await convertHeicToJpg(heicBuffer);
            
            if (jpgBuffer) {
                const jpgPath = path.join(photosDir, `${file}.jpg`);
                fs.writeFileSync(jpgPath, jpgBuffer);
                photos.push(`${file}.jpg`);
            }
        } else if (file.toLowerCase().match(/\.(jpg|jpeg|png)$/)) {
            photos.push(file);
        }
    }

    return photos;
}

// Routes
app.get('/', async (req, res) => {
    try {
        const photos = await getPhotos();
        res.render('index', { 
            title: 'For My Love',
            photos: photos
        });
    } catch (error) {
        console.error('Error rendering page:', error);
        res.status(500).send('Error loading page');
    }
});

// Export the serverless function
module.exports.handler = serverless(app); 