const express = require("express");
const app = express();
const path = require("path");
const PORT = 3010;

let usuarios = [];

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Registrar nuevo usuario
app.post("/registrar", (req, res) => {
    const { nombre } = req.body;
    const usuario = {
        nombre: nombre,
        puntajeMaximo: 0
    };
    usuarios.push(usuario);
    console.log("Registrado:", usuario);
    res.json({ mensaje: "Usuario registrado correctamente", usuario });
});

// Actualizar puntaje
app.post("/puntaje", (req, res) => {
    const { nombre, puntaje } = req.body;
    const usuario = usuarios.find(u => u.nombre === nombre);
    if (usuario && puntaje > usuario.puntajeMaximo) {
        usuario.puntajeMaximo = puntaje;
        console.log("Puntaje actualizado:", usuario);
    }
    res.json({ mensaje: "Puntaje actualizado" });
});

// Ver usuarios
app.get("/usuarios", (req, res) => {
    let html = "<h1>Usuarios registrados</h1><ul>";
    usuarios.forEach(u => {
        html += `<li>${u.nombre}: ${u.puntajeMaximo}</li>`;
    });
    html += "</ul><a href='/'>Volver</a>";
    res.send(html);
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
