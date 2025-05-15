const express = require("express");
const app = express();
const path = require("path");
const PORT = 3010;

const personas = [];

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.post("/enviar", (req, res) => {
    const persona = {
        usr: req.body.usr,
        pass: req.body.pass
    };
    personas.push(persona);
    console.log(personas);
    res.status(200).send("OK"); 
});

app.get("/personas", (req, res) => {
    res.json(personas.map(p => ({ usr: p.usr })));
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
