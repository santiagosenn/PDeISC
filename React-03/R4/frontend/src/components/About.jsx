import { useEffect, useState } from "react";

export default function Users() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    city: "",
    linkedin: "",
    github: ""
  });

  const [edit, setEdit] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetch("http://localhost:5000/api/users")
      .then(res => res.json())
      .then(data => {
        if (data) setFormData(data);
      });
  }, []);

  const validate = () => {
    const newErrors = {};

    if (!formData.name || !/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]{2,}$/.test(formData.name)) {
      newErrors.name = "Solo letras, mínimo 2 caracteres.";
    }
    if (!formData.email || !/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(formData.email)) {
      newErrors.email = "Email debe ser Gmail válido.";
    }
    if (!formData.phone || !/^[0-9]{8,10}$/.test(formData.phone)) {
      newErrors.phone = "Entre 8 y 10 dígitos.";
    }
    if (!formData.country || !/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]{4,}$/.test(formData.country)) {
      newErrors.country = "Solo letras, mínimo 4 caracteres.";
    }
    if (!formData.city || !/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]{2,}$/.test(formData.city)) {
      newErrors.city = "Solo letras, mínimo 2 caracteres.";
    }
    if (formData.linkedin && !/^https:\/\/(www\.)?linkedin\.com\/.*$/.test(formData.linkedin)) {
      newErrors.linkedin = "URL LinkedIn inválida.";
    }
    if (formData.github && !/^https:\/\/(www\.)?github\.com\/.*$/.test(formData.github)) {
      newErrors.github = "URL GitHub inválida.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = () => {
    if (!validate()) return;

    fetch("http://localhost:5000/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    }).then(() => setEdit(false));
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const placeholders = {
    name: "Ej: Juan Pérez",
    email: "ejemplo@gmail.com",
    phone: "12345678",
    country: "Ej: Argentina",
    city: "Ej: Buenos Aires",
    linkedin: "https://linkedin.com/in/usuario",
    github: "https://github.com/usuario"
  };

  const renderField = (label, field) => (
    <div style={{ display: "flex", flexDirection: "column", flex: "1 1 200px", marginBottom: "15px" }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <b style={{ width: "100px" }}>{label}:</b>
        <div
          contentEditable={edit}
          suppressContentEditableWarning
          style={{
            background: edit ? "#fff" : "transparent",
            border: edit ? "1px solid #ccc" : "none",
            padding: edit ? "6px 8px" : "0",
            borderRadius: "4px",
            minHeight: "24px",
            minWidth: "150px",
            flexGrow: 1,
            color: formData[field] ? "#000" : "#888",
            fontSize: "14px"
          }}
          onFocus={(e) => { if (!formData[field]) e.currentTarget.textContent = ""; }}
          onBlur={(e) => edit && handleChange(field, e.currentTarget.textContent || "")}
        >
          {!formData[field] && edit ? placeholders[field] : formData[field]}
        </div>
      </div>
      {errors[field] && (
        <span style={{ color: "red", fontSize: "12px", marginTop: "2px", whiteSpace: "nowrap" }}>
          {errors[field]}
        </span>
      )}
    </div>
  );

  return (
    <section id="user" style={{ padding: "40px", maxWidth: "800px", margin: "0 auto" }}>
      <h2 style={{ textAlign: "center" }}>Perfil del Usuario</h2>

      {/* Fila 1 - Nombre centrado */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "15px" }}>
        <div style={{ flex: "0 0 400px" }}>
          {renderField("Nombre", "name")}
        </div>
      </div>

      {/* Fila 2 */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
        {renderField("Email", "email")}
        {renderField("Teléfono", "phone")}
      </div>

      {/* Fila 3 */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
        {renderField("País", "country")}
        {renderField("Ciudad", "city")}
      </div>

      {/* Fila 4 */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
        {renderField("LinkedIn", "linkedin")}
        {renderField("GitHub", "github")}
      </div>

      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button
          onClick={edit ? handleUpdate : () => setEdit(true)}
          style={{
            padding: "8px 16px",
            borderRadius: "4px",
            border: "none",
            background: "#007BFF",
            color: "#fff",
            cursor: "pointer"
          }}
        >
          {edit ? "Guardar" : "Editar"}
        </button>
      </div>
    </section>
  );
}
