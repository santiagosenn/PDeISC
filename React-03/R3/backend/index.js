import express from "express";
import cors from "cors";
import { connectdb } from "./dbconnection.js";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Listar todos los usuarios
app.get("/usuarios", async (req, res) => {
  const db = await connectdb();
  if (!db) return res.status(500).json({ error: "Error DB" });

  const [rows] = await db.execute("SELECT * FROM usr");
  res.json(rows);
});

// Consultar usuario por ID
app.get("/usuarios/:id", async (req, res) => {
  const db = await connectdb();
  if (!db) return res.status(500).json({ error: "Error DB" });

  const { id } = req.params;
  const [rows] = await db.execute("SELECT * FROM usr WHERE id = ?", [id]);

  if (rows.length === 0) return res.status(404).json({ error: "Usuario no encontrado" });

  res.json(rows[0]);
});

// Agregar usuario
app.post("/usuarios", async (req, res) => {
  const db = await connectdb();
  if (!db) return res.status(500).json({ error: "Error DB" });

  const { nombre, apellido, direccion, telefono, celular, fecha_nacimiento, email } = req.body;

  await db.execute(
    "INSERT INTO usr (nombre, apellido, direccion, telefono, celular, fecha_nacimiento, email) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [nombre, apellido, direccion, telefono, celular, fecha_nacimiento, email]
  );

  res.json({ message: "Usuario agregado" });
});

// Modificar usuario
app.put("/usuarios/:id", async (req, res) => {
  const db = await connectdb();
  if (!db) return res.status(500).json({ error: "Error DB" });

  const { id } = req.params;
  const { nombre, apellido, direccion, telefono, celular, fecha_nacimiento, email } = req.body;

  await db.execute(
    `UPDATE usr 
     SET nombre=?, apellido=?, direccion=?, telefono=?, celular=?, fecha_nacimiento=?, email=? 
     WHERE id=?`,
    [nombre, apellido, direccion, telefono, celular, fecha_nacimiento, email, id]
  );

  res.json({ message: "Usuario modificado" });
});

// Eliminar usuario
app.delete("/usuarios/:id", async (req, res) => {
  const db = await connectdb();
  if (!db) return res.status(500).json({ error: "Error DB" });

  const { id } = req.params;
  await db.execute("DELETE FROM usr WHERE id = ?", [id]);

  res.json({ message: "Usuario eliminado" });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
