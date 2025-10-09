const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Ruta principal (opcional)
app.get('/', (req, res) => {
  res.json({ mensaje: 'API de Login funcionando ✅' });
});

// Ruta de login
app.post('/login', (req, res) => {
  console.log('📨 Request recibida en /login');
  console.log('📦 Body:', req.body);
  
  const { nombre, contraseña } = req.body;

  if (!nombre || !contraseña) {
    console.log('❌ Faltan datos');
    return res.status(400).json({ error: 'Faltan datos' });
  }

  const query = 'SELECT * FROM usuarios WHERE nombre = ? AND contraseña = ?';
  console.log('🔍 Ejecutando query:', query);
  console.log('🔍 Con parámetros:', [nombre, contraseña]);
  
  db.query(query, [nombre, contraseña], (err, results) => {
    if (err) {
      console.error('🔴 Error al ejecutar la consulta:', err);
      return res.status(500).json({ error: 'Error en el servidor' });
    }

    console.log('📊 Resultados encontrados:', results.length);
    console.log('📊 Datos:', results);

    if (results.length > 0) {
      console.log('✅ Usuario encontrado');
      res.json({ success: true, user: results[0] });
    } else {
      console.log('❌ Usuario no encontrado');
      res.json({ success: false, message: 'Usuario o contraseña incorrectos' });
    }
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});