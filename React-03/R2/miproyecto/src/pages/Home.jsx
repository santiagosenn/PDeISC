import React, { useState } from "react";
import { Link } from "react-router-dom";

function Home({ tasks, deleteTask, updateTask }) {
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const startEdit = (task) => {
    setEditingId(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description);
  };

  const saveEdit = (id) => {
    updateTask({ id, title: editTitle, description: editDescription, completed: tasks.find(t => t.id === id).completed, date: tasks.find(t => t.id === id).date });
    setEditingId(null);
  };

  const toggleComplete = (task) => {
    updateTask({ ...task, completed: !task.completed });
  };

  return (
    <div className="container">
      <h1>Lista de Tareas</h1>
      {tasks.map((task) => (
        <div key={task.id} className="task-card">
          {editingId === task.id ? (
            <>
              <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
              <textarea value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
              <button onClick={() => saveEdit(task.id)}>Guardar ✨</button>
              <button onClick={() => setEditingId(null)}>Cancelar ❌</button>
            </>
          ) : (
            <>
              <h2>{task.title}</h2>
              <p>{task.description}</p>
              <p>Estado: <span style={{color: task.completed ? "green" : "red"}}>{task.completed ? "Completa ✅" : "Incompleta ❌"}</span></p>
              <button onClick={() => toggleComplete(task)}>{task.completed ? "Marcar Incompleta" : "Marcar Completa"}</button>
              <button onClick={() => startEdit(task)}>Editar ✏️</button>
              <button onClick={() => deleteTask(task.id)}>Eliminar 🗑️</button>
              <Link to={`/task/${task.id}`} style={{marginLeft: "1rem"}}>Ver detalle →</Link>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default Home;
