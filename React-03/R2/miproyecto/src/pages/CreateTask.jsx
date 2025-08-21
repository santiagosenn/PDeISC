import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateTask({ setTasks }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [completed, setCompleted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTask = {
      id: Date.now(),
      title,
      description,
      date: new Date().toISOString().split("T")[0],
      completed,
    };
    setTasks((prev) => [...prev, newTask]);
    navigate("/");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <h1 className="text-2xl font-bold">Crear Nueva Tarea</h1>
      
      <input
        type="text"
        placeholder="Título"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className="w-full border p-2 rounded"
      />

      <textarea
        placeholder="Descripción"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
        className="w-full border p-2 rounded"
      />

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={completed}
          onChange={(e) => setCompleted(e.target.checked)}
        />
        ¿Completa?
      </label>

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Guardar
      </button>
    </form>
  );
}

export default CreateTask;
