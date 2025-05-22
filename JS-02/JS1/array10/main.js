const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const publicPath = path.join(__dirname, 'public');

const server = http.createServer((req, res) => {
    let filePath = path.join(publicPath, req.url === '/' ? 'index.html' : req.url);
   
    const ext = path.extname(filePath);
    const mimeTypes = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'application/javascript'
    };

    const contentType = mimeTypes[ext] || 'text/plain';

    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Archivo no encontrado');
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
        }
    });
});

server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
