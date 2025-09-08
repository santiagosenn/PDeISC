import React, { useState } from 'react';
import '../App.css';

function Formulario() {
  const [nombre, setNombre] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    // Solo letras y espacios
    const value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]/g, '');
    setNombre(value);
    setError(''); // limpiar error al escribir
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nombreTrim = nombre.trim();

    if (nombreTrim.length < 3) {
      setError('El nombre debe tener al menos 3 letras.');
      setMensaje('');
      return;
    }

    setMensaje(`¡Bienvenido, ${nombreTrim}!`);
    setNombre('');
    setError('');
  };

  return (
    <div className="formulario">
      <h2>Formulario simple</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Tu nombre"
          value={nombre}
          onChange={handleChange}
          className={error ? 'input-error' : ''}
        />
        <button type="submit">Enviar</button>
      </form>
      {error && <p className="error">{error}</p>}
      {mensaje && <p className="mensaje">{mensaje}</p>}
    </div>
  );
}

export default Formulario;
