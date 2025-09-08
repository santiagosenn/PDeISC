import { useEffect, useState } from "react";

export default function Skills() {
  const predefinedSkills = [
    "HTML",
    "CSS",
    "JavaScript",
    "React",
    "Node.js",
    "MySQL",
    "MongoDB",
    "Git",
    "Docker"
  ];

  const [skills, setSkills] = useState([]); // Empieza vacío
  const [customSkill, setCustomSkill] = useState("");
  const [error, setError] = useState("");

  // No cargamos automáticamente skills al inicio
  // Solo dejé este useEffect por si querés sincronizar con backend
  useEffect(() => {
    fetch("http://localhost:5000/api/skills")
      .then((res) => res.json())
      .then((data) => {
        // Comentamos esta línea para que no aparezcan tags automáticamente
        // if (Array.isArray(data)) setSkills(data.map((s) => s.skill));
      })
      .catch((err) => console.error("Error cargando skills:", err));
  }, []);

  const saveSkill = (skill) => {
    fetch("http://localhost:5000/api/skills", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ skill })
    }).catch((err) => console.error("Error guardando skill:", err));
  };

  const handleSelect = (e) => {
    const value = e.target.value;
    if (value && !skills.includes(value)) {
      setSkills([...skills, value]);
      saveSkill(value);
    }
    e.target.value = "";
  };

  const handleAddCustom = () => {
    const skill = customSkill.trim();
    if (!/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]{2,}$/.test(skill)) {
      setError("Solo letras, mínimo 2 caracteres.");
      return;
    }
    if (skills.includes(skill)) {
      setError("Esa habilidad ya fue añadida.");
      return;
    }
    setSkills([...skills, skill]);
    saveSkill(skill);
    setCustomSkill("");
    setError("");
  };

  const removeSkill = (skill) => {
    setSkills(skills.filter((s) => s !== skill));
    fetch(`http://localhost:5000/api/skills/${encodeURIComponent(skill)}`, {
      method: "DELETE"
    }).catch((err) => console.error("Error eliminando skill:", err));
  };

  return (
    <section style={{ padding: "40px", textAlign: "center", maxWidth: "800px", margin: "0 auto" }}>
      <h2>Habilidades</h2>

      {/* Tags de habilidades */}
      <div style={{ margin: "15px 0", display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
        {skills.map((s) => (
          <span
            key={s}
            style={{
              display: "inline-block",
              background: "#007BFF",
              color: "#fff",
              padding: "5px 10px",
              borderRadius: "15px",
              margin: "5px",
              cursor: "pointer",
              fontSize: "14px"
            }}
            onClick={() => removeSkill(s)}
            title="Click para eliminar"
          >
            {s} ✕
          </span>
        ))}
      </div>

      {/* Contenedor principal para select y habilidad personalizada */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "20px", flexWrap: "wrap", marginTop: "10px" }}>
        {/* Select de habilidades */}
        <select
          onChange={handleSelect}
          defaultValue=""
          style={{
            padding: "6px 10px",
            borderRadius: "4px",
            border: "1px solid #007BFF",
            background: "#007BFF",
            color: "#fff",
            cursor: "pointer",
            minWidth: "180px",
            fontSize: "14px",
            flexGrow: 1
          }}
        >
          <option value="" disabled>
            Selecciona una habilidad...
          </option>
          {predefinedSkills.map((s) => (
            <option key={s} value={s} style={{ color: "#000" }}>
              {s}
            </option>
          ))}
        </select>

        {/* Contenedor para input y botón */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", flexGrow: 1 }}>
          <input
            type="text"
            value={customSkill}
            onChange={(e) => setCustomSkill(e.target.value)}
            placeholder="Habilidad personalizada"
            style={{
              padding: "5px 8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              minWidth: "140px",
              height: "30px",
              fontSize: "14px",
              marginBottom: "5px"
            }}
          />
          <button
            onClick={handleAddCustom}
            style={{
              padding: "6px 12px",
              borderRadius: "4px",
              border: "none",
              background: "#007BFF",
              color: "#fff",
              cursor: "pointer",
              alignSelf: "flex-start"
            }}
          >
            Añadir
          </button>
        </div>
      </div>

      {error && <p style={{ color: "red", fontSize: "12px", marginTop: "5px" }}>{error}</p>}
    </section>
  );
}
