const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
app.use(cors());
app.use(express.json());

// 🔧 Configura tus credenciales MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",       // tu usuario MySQL
  password: "",       // tu contraseña MySQL
  database: "juegos"  // la base que creamos arriba
});

// Conexión
db.connect(err => {
  if (err) {
    console.error("Error conectando a MySQL:", err);
    return;
  }
  console.log("Conectado a MySQL ✅");
});

// Obtener puntajes
app.get("/scores", (req, res) => {
  db.query("SELECT * FROM scores ORDER BY score DESC LIMIT 20", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Guardar puntaje
app.post("/scores", (req, res) => {
  const { player, score } = req.body;
  if (!player || typeof score !== "number") {
    return res.status(400).json({ error: "player y score son obligatorios" });
  }
  db.query(
    "INSERT INTO scores (player, score) VALUES (?, ?)",
    [player, score],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: result.insertId, player, score });
    }
  );
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
