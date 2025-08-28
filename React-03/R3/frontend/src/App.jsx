import { useEffect, useState } from "react";
import axios from "axios";
import './App.css';

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
  const [editId, setEditId] = useState(null);
  const [errores, setErrores] = useState({});

  const cargarUsuarios = async () => {
    const res = await axios.get("http://localhost:3001/usuarios");
    setUsuarios(res.data);
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrores({ ...errores, [e.target.name]: "" });
  };

  const validarForm = () => {
    const { nombre, apellido, direccion, telefono, celular, fecha_nacimiento, email } = form;
    const nuevoErrores = {};
    const soloLetras = /^[A-Za-zÀ-ÿ\s]+$/;

    if (!nombre) nuevoErrores.nombre = "El nombre es obligatorio";
    else if (!soloLetras.test(nombre)) nuevoErrores.nombre = "Solo se permiten letras";
    else if (nombre.trim().length < 2) nuevoErrores.nombre = "El nombre debe tener al menos 2 letras";

    if (!apellido) nuevoErrores.apellido = "El apellido es obligatorio";
    else if (!soloLetras.test(apellido)) nuevoErrores.apellido = "Solo se permiten letras";
    else if (apellido.trim().length < 2) nuevoErrores.apellido = "El apellido debe tener al menos 2 letras";

    const dirRegex = /^[A-Za-z0-9\s]+\/[0-9]+$/;
    if (!direccion) nuevoErrores.direccion = "La dirección es obligatoria";
    else if (!dirRegex.test(direccion)) nuevoErrores.direccion = "Debe tener formato 'Calle/Numero'";

    const soloNumeros = /^[0-9]+$/;
    if (!telefono) nuevoErrores.telefono = "El teléfono es obligatorio";
    else if (!soloNumeros.test(telefono)) nuevoErrores.telefono = "Solo números permitidos";
    else if (telefono.length < 8) nuevoErrores.telefono = "Teléfono muy corto, mínimo 8 dígitos";

    if (!celular) nuevoErrores.celular = "El celular es obligatorio";
    else if (!soloNumeros.test(celular)) nuevoErrores.celular = "Solo números permitidos";
    else if (celular.length < 10) nuevoErrores.celular = "Celular muy corto, mínimo 10 dígitos";

    const fechaRegex = /^([0-2]\d|3[0-1])\/(0\d|1[0-2])\/\d{2,4}$/;
    if (!fecha_nacimiento) nuevoErrores.fecha_nacimiento = "La fecha es obligatoria";
    else if (!fechaRegex.test(fecha_nacimiento)) nuevoErrores.fecha_nacimiento = "Formato 'DD/MM/AA' o 'DD/MM/AAAA'";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) nuevoErrores.email = "El email es obligatorio";
    else if (!emailRegex.test(email)) nuevoErrores.email = "Email inválido";

    setErrores(nuevoErrores);
    return Object.keys(nuevoErrores).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarForm()) return;

    if (editId) {
      await axios.put(`http://localhost:3001/usuarios/${editId}`, form);
      setEditId(null);
    } else {
      await axios.post("http://localhost:3001/usuarios", form);
    }

    setForm({
      nombre: "",
      apellido: "",
      direccion: "",
      telefono: "",
      celular: "",
      fecha_nacimiento: "",
      email: ""
    });
    setErrores({});
    cargarUsuarios();
  };

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
    setErrores({});
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:3001/usuarios/${id}`);
    cargarUsuarios();
  };

  return (
    <div className="container">
      <h1>Usuarios</h1>

      <form onSubmit={handleSubmit}>
        {Object.keys(form).map((field) => (
          <div className="form-group" key={field}>
            <input
              type="text"
              name={field}
              placeholder={field}
              value={form[field]}
              onChange={handleChange}
            />
            {errores[field] && <div className="error-message">{errores[field]}</div>}
          </div>
        ))}
        <button type="submit">{editId ? "Modificar" : "Agregar"}</button>
      </form>

      <table>
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
