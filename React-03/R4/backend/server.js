import express from "express";
import cors from "cors";
import mysql from "mysql2";

const app = express();
app.use(cors());
app.use(express.json());

// Conexión a MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "portfolio_db"
});

db.connect(err => {
  if (err) console.log("Error de conexión a la base de datos:", err);
  else console.log("Conectado a MySQL!");
});

// Ruta home
app.get("/", (req, res) => {
  res.send("Backend corriendo correctamente!");
});

// GET User info
app.get("/api/about", (req, res) => {
  db.query("SELECT * FROM `user` WHERE id=1", (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results[0]);
  });
});

// POST User info
app.post("/api/about", (req, res) => {
  const { name, about, email, phone, country, city, linkedin, github, education, current_level, courses, stack } = req.body;

  db.query(
    `UPDATE \`user\` 
     SET name=?, about=?, email=?, phone=?, country=?, city=?, linkedin=?, github=?, education=?, current_level=?, courses=?, stack=? 
     WHERE id=1`,
    [name, about, email, phone, country, city, linkedin, github, education, current_level, courses, stack],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "Datos de usuario actualizados" });
    }
  );
});

// GET skills
app.get("/api/skills", (req, res) => {
  db.query("SELECT skill FROM skills", (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// POST skills
app.post("/api/skills", (req, res) => {
  const { skill } = req.body;
  if (!skill) return res.status(400).json({ error: "Skill requerida" });

  db.query("INSERT INTO skills (skill) VALUES (?)", [skill], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ id: result.insertId, skill });
  });
});

// DELETE skills
app.delete("/api/skills/:skill", (req, res) => {
  const { skill } = req.params;
  db.query("DELETE FROM skills WHERE skill = ?", [skill], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ success: true });
  });
});


// GET Projects
app.get("/api/projects", (req, res) => {
  db.query("SELECT * FROM projects", (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// POST Projects
app.post("/api/projects", (req, res) => {
  const { name, description } = req.body;
  db.query("INSERT INTO projects (name, description) VALUES (?, ?)", [name, description], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Proyecto agregado", id: result.insertId });
  });
});

export default app;

// GET Experiences
app.get("/api/experiences", (req, res) => {
  db.query("SELECT * FROM experiences", (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// POST Experience
app.post("/api/experiences", (req, res) => {
  const { title, company, start_date, end_date, description } = req.body;
  db.query(
    "INSERT INTO experiences (title, company, start_date, end_date, description) VALUES (?, ?, ?, ?, ?)",
    [title, company, start_date, end_date, description],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "Experiencia agregada", id: result.insertId });
    }
  );
});

// GET Achievements
app.get("/api/achievements", (req, res) => {
  db.query("SELECT * FROM achievements", (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// POST Achievement
app.post("/api/achievements", (req, res) => {
  const { title, date, description } = req.body;
  db.query(
    "INSERT INTO achievements (title, date, description) VALUES (?, ?, ?)",
    [title, date, description],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "Logro agregado", id: result.insertId });
    }
  );
});
