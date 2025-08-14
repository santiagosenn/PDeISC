import React, { useState } from "react";
import "./contador.css";

function Contador() {
  const [contador, setContador] = useState(0);

  return (
    <div className="contador">
      <h1>{contador}</h1>
      <div className="botones">
        <button onClick={() => setContador(contador - 1)}>-</button>
        <button onClick={() => setContador(contador + 1)}>+</button>
      </div>
    </div>
  );
}

export default Contador;
