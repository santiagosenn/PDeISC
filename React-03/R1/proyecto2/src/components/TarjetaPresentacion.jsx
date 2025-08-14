import React from "react";
import "./TarjetaPresentacion.css";

function TarjetaPresentacion({ nombre, apellido, profesion, imagen }) {
  return (
    <div className="tarjeta">
      <img src={imagen} alt={`${nombre} ${apellido}`} className="tarjeta-img" />
      <h2>{nombre} {apellido}</h2>
      <p>{profesion}</p>
    </div>
  );
}

export default TarjetaPresentacion;
