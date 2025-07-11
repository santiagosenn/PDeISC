const express = require("express");
const app = express();
const path = require("path");
const PORT = 3010;

let personas = [];

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.post("/enviar", (req, res) => {
    const datos = req.body;

    if (!datos.nombre || !datos.apellido || !datos.edad || !datos.fecha || !datos.sexo || !datos.documento ||
        !datos.estadoCivil || !datos.nacionalidad || !datos.telefono || !datos.mail) {
        return res.status(400).send("Datos incompletos");
    }

    if (datos.tieneHijos === "Sí" && (datos.cantidadHijos === undefined || datos.cantidadHijos === "")) {
        return res.status(400).send("Debe indicar cuántos hijos tiene");
    }

    personas.push(datos);
    res.status(200).send("Persona guardada");
});

app.get("/personas", (req, res) => {
    res.json(personas);
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
