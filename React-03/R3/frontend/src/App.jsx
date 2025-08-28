import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [usuarios, setUsuarios] = useState([]);
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    direccion: "",
    telefono: "",
    celular: "",
    fecha_nacimiento: "",
    email: ""
  });
  const [editId, setEditId] = useState(null); // Para saber si estamos editando

  // Cargar usuarios
  const cargarUsuarios = async () => {
    const res = await axios.get("http://localhost:3001/usuarios");
    setUsuarios(res.data);
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      // Modificar usuario
      await axios.put(`http://localhost:3001/usuarios/${editId}`, form);
      setEditId(null);
    } else {
      // Agregar usuario
      await axios.post("http://localhost:3001/usuarios", form);
    }
    setForm({ nombre:"", apellido:"", direccion:"", telefono:"", celular:"", fecha_nacimiento:"", email:"" });
    cargarUsuarios();
  };

  // Editar usuario
  const handleEdit = (usuario) => {
    setForm({
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      direccion: usuario.direccion,
      telefono: usuario.telefono,
      celular: usuario.celular,
      fecha_nacimiento: usuario.fecha_nacimiento,
      email: usuario.email
    });
    setEditId(usuario.id);
  };

  // Eliminar usuario
  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:3001/usuarios/${id}`);
    cargarUsuarios();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Usuarios</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        {Object.keys(form).map((field) => (
          <div key={field} style={{ marginBottom: "5px" }}>
            <input
              type="text"
              name={field}
              placeholder={field}
              value={form[field]}
              onChange={handleChange}
              style={{ padding: "5px", width: "300px" }}
            />
          </div>
        ))}
        <button type="submit">{editId ? "Modificar" : "Agregar"}</button>
      </form>

      <table border="1" cellPadding="5">
        <thead>
          <tr>
            {["id", "nombre", "apellido", "direccion", "telefono", "celular", "fecha_nacimiento", "email", "acciones"].map((h) => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.nombre}</td>
              <td>{u.apellido}</td>
              <td>{u.direccion}</td>
              <td>{u.telefono}</td>
              <td>{u.celular}</td>
              <td>{u.fecha_nacimiento}</td>
              <td>{u.email}</td>
              <td>
                <button onClick={() => handleEdit(u)}>Editar</button>{" "}
                <button onClick={() => handleDelete(u.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
