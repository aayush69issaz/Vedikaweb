const express = require('express');
const serverless = require('serverless-http');
const path = require('path');
const fs = require('fs');
const heicConvert = require('heic-convert');

const app = express();

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '../public')));
app.use('/models', express.static(path.join(__dirname, '../public', 'models')));

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
        if (!fs.existsSync(photosDir)) {
            console.error('Photos directory does not exist:', photosDir);
            return [];
        }
        
        const files = fs.readdirSync(photosDir);
        const photos = [];
        
        for (const file of files) {
            const ext = path.extname(file).toLowerCase();
            const baseName = path.basename(file, ext);
            
            if (ext === '.heic') {
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

// Route for the main page
app.get('/', async (req, res) => {
    try {
        const photos = await getPhotos();
        console.log('Rendering page with photos:', photos);
        
        // Check if views directory exists
        const viewsDir = path.join(__dirname, '../views');
        if (!fs.existsSync(viewsDir)) {
            console.error('Views directory does not exist:', viewsDir);
            return res.status(500).send('Views directory not found');
        }
        
        // Check if index.ejs exists
        const indexPath = path.join(viewsDir, 'index.ejs');
        if (!fs.existsSync(indexPath)) {
            console.error('Index template does not exist:', indexPath);
            return res.status(500).send('Index template not found');
        }
        
        res.render('index', { 
            title: 'For My Love',
            photos: photos
        });
    } catch (err) {
        console.error('Error rendering page:', err);
        res.status(500).send(`Error loading page: ${err.message}`);
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).send(`Error: ${err.message}`);
});

module.exports.handler = serverless(app); 