import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateTask({ addTask }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [completed, setCompleted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    addTask({ title, description, completed });
    navigate("/");
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <h1>Crear Nueva Tarea</h1>
        <input type="text" placeholder="Título" value={title} onChange={(e)=>setTitle(e.target.value)} required />
        <textarea placeholder="Descripción" value={description} onChange={(e)=>setDescription(e.target.value)} required />
        <label><input type="checkbox" checked={completed} onChange={(e)=>setCompleted(e.target.checked)} /> ¿Completa?</label>
        <button type="submit">Guardar</button>
      </form>
    </div>
  );
}

export default CreateTask;
