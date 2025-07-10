// Requerimos los modulos necesarios
const express = require('express');
const fs = require('fs');
const path = require('path');

// Creamos una instancia de Express
const app = express();
const PORT = 3000;

// Servimos archivos estaticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para poder leer JSON en los requests
app.use(express.json());

// Ruta POST para guardar los numeros en un archivo
app.post('/guardar', (req, res) => {
  const numeros = req.body.numeros; 
  if (!Array.isArray(numeros) || numeros.length < 10 || numeros.length > 20) {
    return res.status(400).send('La cantidad de números debe ser entre 10 y 20.');
  }

  const texto = numeros.join(', '); 
  const rutaArchivo = path.join(__dirname, 'numeros.txt'); 

  // Escribimos el archivo con los numeros
  fs.writeFile(rutaArchivo, texto, (err) => {
    if (err) {
      console.error(err); 
      return res.status(500).send('Error al guardar el archivo.');
    }
    res.send('Archivo guardado correctamente.'); 
  });
});

// Iniciamos el servidor en el puerto 3000
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
