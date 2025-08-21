import React from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

function TaskDetail({ tasks, deleteTask, updateTask }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const task = tasks.find(t => t.id === parseInt(id));
  if (!task) return <div className="container">Tarea no encontrada</div>;

  const toggleComplete = () => updateTask({ ...task, completed: !task.completed });

  return (
    <div className="container">
      <div className="detail-card">
        <h1>{task.title}</h1>
        <p>{task.description}</p>
        <p><strong>Fecha:</strong> {task.date}</p>
        <p><strong>Estado:</strong> <span style={{color: task.completed ? "green" : "red"}}>{task.completed ? "Completa ✅" : "Incompleta ❌"}</span></p>
        <button onClick={toggleComplete}>{task.completed ? "Marcar Incompleta" : "Marcar Completa"}</button>
        <button onClick={() => { deleteTask(task.id); navigate("/"); }}>Eliminar 🗑️</button>
        <Link to="/" style={{display:"block", marginTop:"1rem"}}>← Volver</Link>
      </div>
    </div>
  );
}

export default TaskDetail;
