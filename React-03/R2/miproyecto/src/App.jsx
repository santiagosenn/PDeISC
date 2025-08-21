import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import TaskDetail from "./pages/TaskDetail";
import CreateTask from "./pages/CreateTask";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([
    { id: 1, title: "Primera tarea", description: "Descripción de la primera tarea", completed: false, date: new Date().toLocaleDateString() }
  ]);

  const addTask = (task) => {
    setTasks([...tasks, { ...task, id: Date.now(), date: new Date().toLocaleDateString() }]);
  };

  const deleteTask = (id) => setTasks(tasks.filter((t) => t.id !== id));

  const updateTask = (updatedTask) => {
    setTasks(tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
  };

  return (
    <Router>
      <nav>
        <Link to="/">Inicio</Link>
        <Link to="/create">Nueva Tarea</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home tasks={tasks} deleteTask={deleteTask} updateTask={updateTask} />} />
        <Route path="/task/:id" element={<TaskDetail tasks={tasks} deleteTask={deleteTask} updateTask={updateTask} />} />
        <Route path="/create" element={<CreateTask addTask={addTask} />} />
      </Routes>
    </Router>
  );
}

export default App;
