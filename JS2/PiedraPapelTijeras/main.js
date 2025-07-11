const express = require('express');
const app = express();
const path = require('path');
const PORT = 3010;

app.use(express.static('public'));

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

let usuarios = [];

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Registrar nuevo usuario
app.post("/registrar", (req, res) => {
    const { nombre } = req.body;
    if (!nombre) return res.status(400).json({ mensaje: "El nombre es requerido" });

    let usuarioExistente = usuarios.find(u => u.nombre === nombre);
    if (usuarioExistente) return res.status(409).json({ mensaje: "El usuario ya existe" });

    const usuario = { nombre, puntajeMaximo: 0 };
    usuarios.push(usuario);
    console.log("Registrado:", usuario);
    res.json({ mensaje: "Usuario registrado correctamente", usuario });
});

// Actualizar puntaje
app.post("/puntaje", (req, res) => {
    const { nombre, puntaje } = req.body;
    if (!nombre || puntaje == null) return res.status(400).json({ mensaje: "Datos incompletos" });

    const usuario = usuarios.find(u => u.nombre === nombre);
    if (usuario) {
      if (puntaje > usuario.puntajeMaximo) {
        usuario.puntajeMaximo = puntaje;
        console.log("Puntaje actualizado:", usuario);
      }
      return res.json({ mensaje: "Puntaje actualizado" });
    } else {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }
});

// Obtener usuario 
app.get("/usuario/:nombre", (req, res) => {
    const nombre = req.params.nombre;
    const usuario = usuarios.find(u => u.nombre === nombre);
    if (usuario) {
      res.json({ victorias: usuario.puntajeMaximo });
    } else {
      res.status(404).json({ mensaje: "Usuario no encontrado" });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});