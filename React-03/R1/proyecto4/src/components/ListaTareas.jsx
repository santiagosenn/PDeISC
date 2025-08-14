import React, { useState } from "react";
import "./ListaTareas.css";

function ListaTareas() {
  const [tareas, setTareas] = useState([]); 
  const [nuevaTarea, setNuevaTarea] = useState(""); 

  const agregarTarea = () => {
    if (nuevaTarea.trim() !== "") {
      setTareas([...tareas, { texto: nuevaTarea, completada: false }]);
      setNuevaTarea("");
    }
  };

  const toggleCompletada = (index) => {
    const nuevasTareas = [...tareas];
    nuevasTareas[index].completada = !nuevasTareas[index].completada;
    setTareas(nuevasTareas);
  };

  return (
    <div className="lista-tareas">
      <h2>Lista de Tareas</h2>
      <div className="input-container">
        <input
          type="text"
          value={nuevaTarea}
          onChange={(e) => setNuevaTarea(e.target.value)}
          placeholder="Escribe una tarea..."
        />
        <button onClick={agregarTarea}>Agregar</button>
      </div>

      <ul>
        {tareas.map((tarea, index) => (
          <li
            key={index}
            onClick={() => toggleCompletada(index)}
            className={tarea.completada ? "completada" : ""}
          >
            {tarea.texto}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ListaTareas;
