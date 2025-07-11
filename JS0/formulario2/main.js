const express = require("express");
const app = express();
const path = require("path");
const PORT = 3010;

const datos = [];

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.post("/enviar", (req, res) => {
    const item = {
        nombre: req.body.nombre,
        deporte: req.body.deporte,
        herramienta: req.body.herramienta,
        precio: req.body.precio
    };

    datos.push(item);
    res.json({ mensaje: "Datos guardados correctamente" });
});

app.get("/personas", (req, res) => {
    res.json(datos);
});

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});
