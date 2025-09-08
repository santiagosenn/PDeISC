import { useEffect, useState } from "react";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [errors, setErrors] = useState({});
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/projects")
      .then(res => res.json())
      .then(data => setProjects(data))
      .catch(err => console.error("Error cargando proyectos:", err));
  }, []);

  const validate = () => {
    const newErrors = {};
    const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]{3,50}$/;
    if (!name || !nameRegex.test(name.trim())) {
      newErrors.name = "El nombre debe tener entre 3 y 50 letras.";
    }
    const descRegex = /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]{10,300}$/;
    if (!desc || !descRegex.test(desc.trim())) {
      newErrors.desc = "La descripción debe tener entre 10 y 300 letras.";
    }

    // Validación de duplicados
    const duplicate = projects.some((p, i) => {
      if (editIndex !== null && i === editIndex) return false; // ignorar el que se edita
      return p.name.trim().toLowerCase() === name.trim().toLowerCase() ||
             p.description.trim().toLowerCase() === desc.trim().toLowerCase();
    });
    if (duplicate) {
      newErrors.duplicate = "Ya existe un proyecto con ese nombre o descripción.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!validate()) return;

    const newProject = { name: name.trim(), description: desc.trim() };

    if (editIndex !== null) {
      const updatedProjects = [...projects];
      updatedProjects[editIndex] = newProject;
      setProjects(updatedProjects);
      setEditIndex(null);
    } else {
      setProjects([...projects, newProject]);
    }

    fetch("http://localhost:5000/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProject)
    }).catch(err => console.error("Error agregando proyecto:", err));

    setName("");
    setDesc("");
    setErrors({});
  };

  const handleEdit = index => {
    setName(projects[index].name);
    setDesc(projects[index].description);
    setEditIndex(index);
  };

  const handleDelete = index => {
    const projectToDelete = projects[index];
    setProjects(projects.filter((_, i) => i !== index));

    fetch(`http://localhost:5000/api/projects/${encodeURIComponent(projectToDelete.name)}`, {
      method: "DELETE"
    }).catch(err => console.error("Error eliminando proyecto:", err));
  };

  return (
    <section id="projects" style={{ padding: "40px", textAlign: "center" }}>
      <h2>Proyectos</h2>

      <div style={{ display: "flex", gap: "20px", justifyContent: "center", flexWrap: "wrap" }}>
        {projects.map((p, i) => (
          <div key={i} style={{ border: "1px solid #ccc", padding: "20px", borderRadius: "10px", width: "220px", position: "relative" }}>
            <button
              onClick={() => handleEdit(i)}
              style={{
                position: "absolute",
                top: "8px",
                left: "8px",
                width: "25px",
                height: "25px",
                borderRadius: "50%",
                border: "none",
                background: "#007BFF",
                color: "#fff",
                fontWeight: "bold",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "16px",
                lineHeight: "16px"
              }}
              title="Editar proyecto"
            >✎</button>

            <button
              onClick={() => handleDelete(i)}
              style={{
                position: "absolute",
                top: "8px",
                right: "8px",
                width: "25px",
                height: "25px",
                borderRadius: "50%",
                border: "none",
                background: "#dc3545",
                color: "#fff",
                fontWeight: "bold",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "16px",
                lineHeight: "16px"
              }}
              title="Eliminar proyecto"
            >×</button>

            <h3>{p.name}</h3>
            <p>{p.description}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} style={{ marginTop: "30px", maxWidth: "400px", marginInline: "auto", display: "flex", flexDirection: "column", gap: "15px" }}>
        <label htmlFor="name">Nombre del proyecto</label>
        <input
          id="name"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Ej: RapidWeather"
          required
          style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
        />
        {errors.name && <p style={{ color: "red", fontSize: "12px" }}>{errors.name}</p>}

        <label htmlFor="desc">Descripción del proyecto</label>
        <textarea
          id="desc"
          value={desc}
          onChange={e => setDesc(e.target.value)}
          placeholder="Breve descripción del proyecto..."
          required
          style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc", minHeight: "60px" }}
        />
        {errors.desc && <p style={{ color: "red", fontSize: "12px" }}>{errors.desc}</p>}

        {errors.duplicate && <p style={{ color: "red", fontSize: "12px" }}>{errors.duplicate}</p>}

        <button
          type="submit"
          style={{ padding: "8px 12px", borderRadius: "4px", border: "none", background: "#007BFF", color: "#fff", cursor: "pointer" }}
        >
          {editIndex !== null ? "Actualizar proyecto" : "Agregar proyecto"}
        </button>
      </form>
    </section>
  );
}
