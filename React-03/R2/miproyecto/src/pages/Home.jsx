import { Link } from "react-router-dom";

function Home({ tasks }) {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Lista de Tareas</h1>
      <ul className="space-y-3">
        {tasks.map((task) => (
          <li key={task.id} className="p-4 border rounded-lg shadow">
            <h2 className="text-xl font-semibold">{task.title}</h2>
            <p>{task.description.substring(0, 30)}...</p>
            <Link to={`/task/${task.id}`} className="text-blue-500 underline">
              Ver detalle
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Home;
