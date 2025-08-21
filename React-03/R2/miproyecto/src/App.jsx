import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import TaskDetail from "./pages/TaskDetail";
import CreateTask from "./pages/CreateTask";
import tasksData from "./tasksData";
import "./App.css";


function App() {
  const [tasks, setTasks] = useState(tasksData);

  return (
    <Router>
      <nav className="p-4 bg-blue-600 text-white flex gap-4">
        <Link to="/">Inicio</Link>
        <Link to="/create">Nueva Tarea</Link>
      </nav>

      <div className="p-6">
        <Routes>
          <Route path="/" element={<Home tasks={tasks} />} />
          <Route path="/task/:id" element={<TaskDetail tasks={tasks} />} />
          <Route path="/create" element={<CreateTask setTasks={setTasks} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
