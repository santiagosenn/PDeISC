const express = require("express");
const path = require("path");
const calculos = require("./calculos.js");

const app = express();
const PORT = 3000;

// Servir archivos estáticos (HTML y CSS)
app.use(express.static(path.join(__dirname, "public")));

// Ruta para obtener los resultados en JSON
app.get("/api/resultados", (req, res) => {
    const resultados = [
        { operacion: "Suma", resultado: calculos.suma(5, 3) },
        { operacion: "Resta", resultado: calculos.resta(8, 6) },
        { operacion: "Multiplicación", resultado: calculos.multiplicacion(3, 11) },
        { operacion: "División", resultado: calculos.division(30, 5) },
    ];
    res.json(resultados);
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
