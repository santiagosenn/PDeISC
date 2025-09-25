const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "juegos"
});

db.connect(err => {
  if (err) return console.error("Error conectando a MySQL:", err);
  console.log("Conectado a MySQL ✅");
});

// Obtener puntajes de 1942
app.get("/scores1942", (req, res) => {
  db.query("SELECT * FROM scores_1942 ORDER BY score DESC LIMIT 20", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Guardar puntaje 1942
app.post("/scores1942", (req, res) => {
  const { player, score } = req.body;
  if (!player || typeof score !== "number") return res.status(400).json({ error: "player y score son obligatorios" });

  db.query("INSERT INTO scores_1942 (player, score) VALUES (?, ?)", [player, score], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: result.insertId, player, score });
  });
});

const PORT = 3001; // otro puerto para no chocar con Space Invaders
app.listen(PORT, () => console.log(`Servidor 1942 escuchando en http://localhost:${PORT}`));
