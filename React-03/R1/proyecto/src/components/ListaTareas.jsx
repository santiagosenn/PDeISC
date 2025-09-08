import React, { useState } from 'react';
import '../App.css';

function ListaTareas() {
  const [tareas, setTareas] = useState([]);
  const [input, setInput] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    // Solo letras y espacios
    const value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]/g, '');
    setInput(value);
    setError('');
  };

  const agregarTarea = () => {
    const tareaTrim = input.trim();

    // Validaciones
    if (tareaTrim.length < 4) {
      setError('La tarea debe tener al menos 4 letras.');
      return;
    }

    if (editIndex === null && tareas.includes(tareaTrim)) {
      setError('La tarea ya existe.');
      return;
    }

    const nuevasTareas = [...tareas];

    if (editIndex !== null) {
      if (tareas.includes(tareaTrim) && tareaTrim !== tareas[editIndex]) {
        setError('La tarea ya existe.');
        return;
      }
      nuevasTareas[editIndex] = tareaTrim;
      setEditIndex(null);
    } else {
      nuevasTareas.push(tareaTrim);
    }

    setTareas(nuevasTareas);
    setInput('');
    setError('');
  };

  const eliminarTarea = (index) => {
    const nuevasTareas = [...tareas];
    nuevasTareas.splice(index, 1);
    setTareas(nuevasTareas);
  };

  const modificarTarea = (index) => {
    setInput(tareas[index]);
    setEditIndex(index);
    setError('');
  };

  const completarTarea = (index) => {
    const nuevasTareas = [...tareas];
    nuevasTareas[index] = nuevasTareas[index].includes('✔️')
      ? nuevasTareas[index].replace(' ✔️', '')
      : nuevasTareas[index] + ' ✔️';
    setTareas(nuevasTareas);
  };

  return (
    <div className="lista-tareas">
      <h2>Lista de tareas</h2>
      <input
        value={input}
        onChange={handleChange}
        placeholder="Nueva tarea"
      />
      <button onClick={agregarTarea}>
        {editIndex !== null ? 'Guardar' : 'Agregar'}
      </button>
      {error && <p className="error">{error}</p>}
      <ul>
        {tareas.map((tarea, index) => (
          <li key={index} className={tarea.includes('✔️') ? 'completada' : ''}>
            <span onClick={() => completarTarea(index)}>{tarea}</span>
            <button onClick={() => modificarTarea(index)} title="Modificar">✏️</button>
            <button onClick={() => eliminarTarea(index)} title="Eliminar">❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ListaTareas;
