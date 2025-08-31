import { useEffect, useState } from "react";
import axios from "axios";
import { Helmet } from "react-helmet";
import './App.css';

function App() {
  const [usuarios, setUsuarios] = useState([]);
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    calle: "",
    numero_calle: "",
    telefono: "",
    celular: "",
    fecha_nacimiento: "",
    email: ""
  });
  const [editId, setEditId] = useState(null);
  const [errores, setErrores] = useState({});

  const cargarUsuarios = async () => {
    try {
      const res = await axios.get("http://localhost:3001/usuarios");
      const datos = res.data.map(u => ({
        ...u,
        fecha_nacimiento: u.fecha_nacimiento ? u.fecha_nacimiento.split('T')[0] : ""
      }));
      setUsuarios(datos);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrores({ ...errores, [e.target.name]: "" });
  };

  const validarForm = () => {
    const { nombre, apellido, calle, numero_calle, telefono, celular, fecha_nacimiento, email } = form;
    const nuevoErrores = {};
    const soloLetras = /^[A-Za-zÀ-ÿ\s]+$/;
    const soloNumeros = /^[0-9]+$/;

    if (!nombre) nuevoErrores.nombre = "El nombre es obligatorio";
    else if (!soloLetras.test(nombre)) nuevoErrores.nombre = "Solo se permiten letras";
    else if (nombre.trim().length < 2) nuevoErrores.nombre = "El nombre debe tener al menos 2 letras";

    if (!apellido) nuevoErrores.apellido = "El apellido es obligatorio";
    else if (!soloLetras.test(apellido)) nuevoErrores.apellido = "Solo se permiten letras";
    else if (apellido.trim().length < 2) nuevoErrores.apellido = "El apellido debe tener al menos 2 letras";

    if (!calle) nuevoErrores.calle = "La calle es obligatoria";
    else if (!soloLetras.test(calle)) nuevoErrores.calle = "La calle solo puede contener letras y espacios";

    if (!numero_calle) nuevoErrores.numero_calle = "El número de calle es obligatorio";
    else if (!soloNumeros.test(numero_calle)) nuevoErrores.numero_calle = "Solo se permiten números";

    if (telefono && (!soloNumeros.test(telefono) || telefono.length < 8)) {
      nuevoErrores.telefono = "El teléfono debe tener al menos 8 dígitos y solo números";
    }

    if (!celular) nuevoErrores.celular = "El celular es obligatorio";
    else if (!soloNumeros.test(celular)) nuevoErrores.celular = "Solo números permitidos";
    else if (celular.length < 10) nuevoErrores.celular = "Celular muy corto, mínimo 10 dígitos";

    if (!fecha_nacimiento) nuevoErrores.fecha_nacimiento = "La fecha es obligatoria";
    else if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha_nacimiento))
      nuevoErrores.fecha_nacimiento = "Formato inválido, use AAAA-MM-DD";
    else if (new Date(fecha_nacimiento) >= new Date())
      nuevoErrores.fecha_nacimiento = "La fecha debe ser anterior a hoy";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) nuevoErrores.email = "El email es obligatorio";
    else if (!emailRegex.test(email)) nuevoErrores.email = "Email inválido";

    setErrores(nuevoErrores);
    return Object.keys(nuevoErrores).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarForm()) return;

    const dataEnviar = {
      ...form,
      direccion: `${form.calle} ${form.numero_calle}`
    };
    delete dataEnviar.calle;
    delete dataEnviar.numero_calle;

    if (editId) {
      await axios.put(`http://localhost:3001/usuarios/${editId}`, dataEnviar);
      setEditId(null);
    } else {
      await axios.post("http://localhost:3001/usuarios", dataEnviar);
    }

    setForm({
      nombre: "",
      apellido: "",
      calle: "",
      numero_calle: "",
      telefono: "",
      celular: "",
      fecha_nacimiento: "",
      email: ""
    });
    setErrores({});
    cargarUsuarios();
  };

  const handleEdit = (usuario) => {
    let calle = "";
    let numero_calle = "";
    if (usuario.direccion) {
      const partes = usuario.direccion.split(" ");
      numero_calle = partes.pop();
      calle = partes.join(" ");
    }

    setForm({ 
      ...usuario, 
      calle,
      numero_calle,
      fecha_nacimiento: usuario.fecha_nacimiento || "" 
    });
    setEditId(usuario.id);
    setErrores({});
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:3001/usuarios/${id}`);
    cargarUsuarios();
  };

  return (
    <>
      <Helmet>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Helmet>

      <div className="form-container">
        <h1>Usuarios</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input type="text" name="nombre" placeholder="Ingrese su nombre" value={form.nombre} onChange={handleChange} />
            {errores.nombre && <div className="error-message">{errores.nombre}</div>}
          </div>

          <div className="form-group">
            <input type="text" name="apellido" placeholder="Ingrese su apellido" value={form.apellido} onChange={handleChange} />
            {errores.apellido && <div className="error-message">{errores.apellido}</div>}
          </div>

          <div className="direccion-group">
            <div className="direccion-row">
              <input type="text" name="calle" placeholder="Calle (solo letras)" value={form.calle} onChange={handleChange} />
              <input type="text" name="numero_calle" placeholder="N°" value={form.numero_calle} onChange={handleChange} />
            </div>
            {errores.calle && <div className="error-message">{errores.calle}</div>}
            {errores.numero_calle && <div className="error-message">{errores.numero_calle}</div>}
          </div>

          <div className="form-group">
            <input type="text" name="telefono" placeholder="Teléfono fijo (opcional)" value={form.telefono} onChange={handleChange} />
            {errores.telefono && <div className="error-message">{errores.telefono}</div>}
          </div>

          <div className="form-group">
            <input type="text" name="celular" placeholder="Celular (obligatorio)" value={form.celular} onChange={handleChange} />
            {errores.celular && <div className="error-message">{errores.celular}</div>}
          </div>

          <div className="form-group">
            <input type="date" name="fecha_nacimiento" value={form.fecha_nacimiento} onChange={handleChange} />
            {errores.fecha_nacimiento && <div className="error-message">{errores.fecha_nacimiento}</div>}
          </div>

          <div className="form-group">
            <input type="text" name="email" placeholder="Correo electrónico" value={form.email} onChange={handleChange} />
            {errores.email && <div className="error-message">{errores.email}</div>}
          </div>

          <button type="submit">{editId ? "Modificar" : "Agregar"}</button>
        </form>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              {["id", "nombre", "apellido", "direccion", "telefono", "celular", "fecha_nacimiento", "email", "acciones"].map(h => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {usuarios.map(u => (
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
    </>
  );
}

export default App;
