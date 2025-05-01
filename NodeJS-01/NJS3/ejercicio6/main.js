const express = require('express');
const app = express();
const path = require('path');

app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/registrar', (req, res) => {
    const formData = req.body;
    res.send(`
        <h1>Datos del Registro</h1>
        <p>Nombre: ${formData.nombre}</p>
        <p>Género: ${formData.genero}</p>
        <p>Correo: ${formData.correo}</p>
        <p>Edad: ${formData.edad}</p>
        <p>Aficiones: ${formData.aficiones ? formData.aficiones.join(', ') : 'Ninguna'}</p>
        <p>País: ${formData.pais}</p>
    `);
});

app.listen(3000, () => {
    console.log('Servidor en http://localhost:3000');
});
