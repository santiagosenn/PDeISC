import { useEffect, useState } from "react";

export default function Achievements() {
  const [achievements, setAchievements] = useState([]);
  const [form, setForm] = useState({ id: null, title: "", description: "" });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetch("http://localhost:5000/api/achievements")
      .then(res => res.json())
      .then(data => setAchievements(data))
      .catch(err => console.error(err));
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const newErrors = {};
    const lettersRegex = /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/;

    if (!form.title.trim()) newErrors.title = "El título es obligatorio.";
    else if (!lettersRegex.test(form.title)) newErrors.title = "Solo letras.";
    else if (form.title.length < 3) newErrors.title = "Mínimo 3 caracteres.";
    else if (form.title.length > 50) newErrors.title = "Máximo 50 caracteres.";
    else if (
      achievements.some(
        a => a.title.toLowerCase() === form.title.trim().toLowerCase() && a.id !== form.id
      )
    ) {
      newErrors.title = "Ya existe un logro con este título.";
    }

    if (!form.description.trim()) newErrors.description = "La descripción es obligatoria.";
    else if (form.description.length < 5) newErrors.description = "Mínimo 5 caracteres.";
    else if (form.description.length > 300) newErrors.description = "Máximo 300 caracteres.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!validate()) return; // Si hay errores, no hace nada

    if (form.id !== null) {
      // Editar logro
      setAchievements(achievements.map(a => (a.id === form.id ? form : a)));
      fetch(`http://localhost:5000/api/achievements/${form.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      }).catch(err => console.error(err));
    } else {
      // Agregar logro nuevo
      const newAch = { ...form, id: Date.now() };
      setAchievements([...achievements, newAch]);
      fetch("http://localhost:5000/api/achievements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAch)
      }).catch(err => console.error(err));
    }

    setForm({ id: null, title: "", description: "" });
    setErrors({});
  };

  const handleEdit = ach => setForm(ach);
  const handleDelete = id => setAchievements(achievements.filter(a => a.id !== id));

  return (
    <section style={{ padding: "40px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "30px" }}>🏆 Logros 🏆</h2>

      <div
        style={{
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
          justifyContent: "center",
          marginBottom: "30px"
        }}
      >
        {achievements.map(ach => (
          <div
            key={ach.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "10px",
              padding: "15px",
              width: "200px",
              position: "relative",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <button
              onClick={() => handleEdit(ach)}
              style={{
                position: "absolute",
                top: "5px",
                left: "5px",
                background: "#007BFF",
                color: "#fff",
                border: "none",
                borderRadius: "50%",
                width: "24px",
                height: "24px",
                cursor: "pointer"
              }}
              title="Editar"
            >
              ✎
            </button>

            <button
              onClick={() => handleDelete(ach.id)}
              style={{
                position: "absolute",
                top: "5px",
                right: "5px",
                background: "#dc3545",
                color: "#fff",
                border: "none",
                borderRadius: "50%",
                width: "24px",
                height: "24px",
                cursor: "pointer"
              }}
              title="Eliminar"
            >
              ✕
            </button>

            <div style={{ fontSize: "30px", marginBottom: "5px" }}>🏆</div>

            <h3>{ach.title}</h3>
            <p>{ach.description}</p>
          </div>
        ))}
      </div>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          maxWidth: "500px",
          margin: "0 auto"
        }}
      >
        <div>
          <label>Título</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
          />
          {errors.title && <p style={{ color: "red", marginTop: "2px" }}>{errors.title}</p>}
        </div>

        <div>
          <label>Descripción</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              resize: "vertical"
            }}
          />
          {errors.description && <p style={{ color: "red", marginTop: "2px" }}>{errors.description}</p>}
        </div>

        <button
          type="submit"
          style={{
            marginTop: "10px",
            padding: "8px 16px",
            background: "#007BFF",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          {form.id !== null ? "Guardar cambios" : "Agregar logro"}
        </button>
      </form>
    </section>
  );
}
