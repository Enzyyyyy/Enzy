const express = require('express');
const multer = require('multer');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });

if (!fs.existsSync('converted')) fs.mkdirSync('converted');

app.post('/toimage', upload.single('file'), (req, res) => {
    const input = req.file.path;
    const output = path.join('converted', `${Date.now()}.png`);

    exec(`convert ${input}[0] ${output}`, (err) => {
        fs.unlinkSync(input);
        if (err) return res.status(500).send('Convert failed');

        const img = fs.readFileSync(output);
        fs.unlinkSync(output);
        res.setHeader('Content-Type', 'image/png');
        res.send(img);
    });
});

app.get('/', (req, res) => {
    res.send('ImageMagick Convert API is running.');
});

app.listen(process.env.PORT || 3000, () => {
    console.log('Server is running on port 3000');
});
                             
