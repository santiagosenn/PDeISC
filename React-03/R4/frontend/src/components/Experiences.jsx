import { useEffect, useState } from "react";

export default function Experiences() {
  const [experiences, setExperiences] = useState([]);
  const [form, setForm] = useState({ id: null, title: "", company: "", start_date: "", end_date: "" });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetch("http://localhost:5000/api/experiences")
      .then(res => res.json())
      .then(data => setExperiences(data))
      .catch(err => console.error(err));
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const newErrors = {};
    const today = new Date().toISOString().split("T")[0];
    const lettersRegex = /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/;

    // Validación del título
    if (!form.title.trim()) newErrors.title = "El título es obligatorio.";
    else if (!lettersRegex.test(form.title)) newErrors.title = "Solo letras.";
    else if (form.title.length < 3) newErrors.title = "Mínimo 3 caracteres.";
    else if (form.title.length > 50) newErrors.title = "Máximo 50 caracteres.";

    // Validación de la empresa
    if (!form.company.trim()) newErrors.company = "La empresa es obligatoria.";
    else if (!lettersRegex.test(form.company)) newErrors.company = "Solo letras.";
    else if (form.company.length < 2) newErrors.company = "Mínimo 2 caracteres.";
    else if (form.company.length > 50) newErrors.company = "Máximo 50 caracteres.";

    // Validación de fechas
    if (!form.start_date) newErrors.start_date = "Fecha de inicio obligatoria.";
    else if (form.start_date > today) newErrors.start_date = "No puede ser futura.";

    if (!form.end_date) newErrors.end_date = "Fecha de fin obligatoria.";
    else if (form.end_date > today) newErrors.end_date = "No puede ser futura.";
    else if (form.start_date && form.end_date < form.start_date)
      newErrors.end_date = "No puede ser anterior a inicio.";

    // Validación de duplicado completo
    const isDuplicate = experiences.some(exp =>
      exp.id !== form.id &&
      exp.title.toLowerCase() === form.title.trim().toLowerCase() &&
      exp.company.toLowerCase() === form.company.trim().toLowerCase() &&
      exp.start_date === form.start_date &&
      exp.end_date === form.end_date
    );

    if (isDuplicate) {
      newErrors.general = "Ya existe una experiencia idéntica.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!validate()) return;

    if (form.id !== null) {
      // Actualizar estado local directamente
      setExperiences(experiences.map(exp => exp.id === form.id ? form : exp));
      // Actualizar backend
      fetch(`http://localhost:5000/api/experiences/${form.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      }).catch(err => console.error(err));
    } else {
      // Crear nuevo con id temporal
      const newExp = { ...form, id: Date.now() };
      setExperiences([...experiences, newExp]);
      // Enviar al backend
      fetch("http://localhost:5000/api/experiences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newExp)
      }).catch(err => console.error(err));
    }

    setForm({ id: null, title: "", company: "", start_date: "", end_date: "" });
    setErrors({});
  };

  const handleEdit = exp => setForm(exp);
  const handleDelete = id => setExperiences(experiences.filter(exp => exp.id !== id));

  return (
    <section style={{ padding: "40px" }}>
      <h2>Experiencias</h2>

      {errors.general && (
        <p style={{ color: "red", fontWeight: "bold", marginBottom: "10px" }}>
          {errors.general}
        </p>
      )}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {experiences.map(exp => (
          <li
            key={exp.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "8px",
              border: "1px solid #ccc",
              borderRadius: "6px",
              padding: "8px"
            }}
          >
            <span>{exp.title} - {exp.company} ({exp.start_date} → {exp.end_date})</span>
            <div style={{ display: "flex", gap: "5px" }}>
              <button
                onClick={() => handleEdit(exp)}
                style={{ background: "#007BFF", color: "#fff", border: "none", borderRadius: "50%", width: "24px", height: "24px", cursor: "pointer" }}
                title="Editar"
              >✎</button>
              <button
                onClick={() => handleDelete(exp.id)}
                style={{ background: "#dc3545", color: "#fff", border: "none", borderRadius: "50%", width: "24px", height: "24px", cursor: "pointer" }}
                title="Eliminar"
              >✕</button>
            </div>
          </li>
        ))}
      </ul>

      <form onSubmit={handleSubmit} style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "20px" }}>
        <div style={{ flex: "1 1 150px" }}>
          <label>Título</label>
          <input name="title" value={form.title} onChange={handleChange} style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }} />
          {errors.title && <p style={{ color: "red", marginTop: "2px" }}>{errors.title}</p>}
        </div>

        <div style={{ flex: "1 1 150px" }}>
          <label>Empresa</label>
          <input name="company" value={form.company} onChange={handleChange} style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }} />
          {errors.company && <p style={{ color: "red", marginTop: "2px" }}>{errors.company}</p>}
        </div>

        <div style={{ flex: "1 1 120px" }}>
          <label>Fecha de inicio</label>
          <input name="start_date" type="date" value={form.start_date} onChange={handleChange} style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }} />
          {errors.start_date && <p style={{ color: "red", marginTop: "2px" }}>{errors.start_date}</p>}
        </div>

        <div style={{ flex: "1 1 120px" }}>
          <label>Fecha de fin</label>
          <input name="end_date" type="date" value={form.end_date} onChange={handleChange} style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }} />
          {errors.end_date && <p style={{ color: "red", marginTop: "2px" }}>{errors.end_date}</p>}
        </div>

        <div style={{ flexBasis: "100%" }}>
          <button type="submit" style={{ marginTop: "15px", padding: "8px 16px", background: "#007BFF", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}>
            Guardar cambios
          </button>
        </div>
      </form>
    </section>
  );
}
