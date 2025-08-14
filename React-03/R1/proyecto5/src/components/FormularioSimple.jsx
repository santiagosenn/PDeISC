import React, { useState } from "react";
import "./FormularioSimple.css";

function FormularioSimple() {
  const [nombre, setNombre] = useState("");
  const [mensaje, setMensaje] = useState("");

  const manejarSubmit = (e) => {
    e.preventDefault(); 
    if (nombre.trim() !== "") {
      setMensaje(`¡Bienvenido/a, ${nombre}!`);
    } else {
      setMensaje("Por favor ingresa tu nombre.");
    }
  };

  return (
    <div className="formulario">
      <h2>Formulario de Bienvenida</h2>
      <form onSubmit={manejarSubmit}>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Ingresa tu nombre"
        />
        <button type="submit">Enviar</button>
      </form>
      {mensaje && <p className="mensaje">{mensaje}</p>}
    </div>
  );
}

export default FormularioSimple;
