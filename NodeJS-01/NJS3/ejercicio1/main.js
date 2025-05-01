const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.static('public')); // Servir index.html y script.js

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
