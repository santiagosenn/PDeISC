import React from "react";
import TarjetaPresentacion from "./components/TarjetaPresentacion";

function App() {
  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}>
      <TarjetaPresentacion
        nombre="Santiago"
        apellido="Senn"
        profesion="Desarrollador Web"
        imagen="https://via.placeholder.com/100"
      />
    </div>
  );
}

export default App;
