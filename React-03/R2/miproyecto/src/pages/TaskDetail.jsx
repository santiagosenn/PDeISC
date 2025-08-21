import { useParams, Link } from "react-router-dom";

function TaskDetail({ tasks }) {
  const { id } = useParams();
  const task = tasks.find((t) => t.id === parseInt(id));

  if (!task) return <h2>Tarea no encontrada</h2>;

  return (
    <div>
      <h1 className="text-2xl font-bold">{task.title}</h1>
      <p>{task.description}</p>
      <p><strong>Fecha:</strong> {task.date}</p>
      <p>
        <strong>Estado:</strong> {task.completed ? "✅ Completa" : "❌ Incompleta"}
      </p>
      <Link to="/" className="text-blue-500 underline">Volver</Link>
    </div>
  );
}

export default TaskDetail;
