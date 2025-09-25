import React, { useState } from "react";
import Game from "../components/Game1942";

export default function App() {
  const [playerName, setPlayerName] = useState("");
  const [start, setStart] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (playerName.trim() !== "") setStart(true);
  };

  const CANVAS_W = 1918;
  const CANVAS_H = 900;

  if (!start) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: CANVAS_H,
          width: CANVAS_W,
          backgroundColor: "#111",
          color: "white",
          fontFamily: "'Press Start 2P', cursive",
          flexDirection: "column",
          border: "2px solid cyan",
        }}
      >
        <h1 style={{ fontSize: 48, marginBottom: 40, color: "lime" }}>1942</h1>
        <form onSubmit={handleSubmit} style={{ textAlign: "center" }}>
          <input
            type="text"
            placeholder="Ingresa tu nombre"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            style={{
              padding: "10px",
              fontSize: "16px",
              fontFamily: "'Press Start 2P', cursive",
              background: "black",
              color: "lime",
              border: "2px solid lime",
              textAlign: "center",
              marginBottom: "20px",
              width: "300px",
            }}
          />
          <br />
          <button
            type="submit"
            style={{
              padding: "10px 30px",
              fontSize: "16px",
              fontFamily: "'Press Start 2P', cursive",
              background: "black",
              color: "cyan",
              border: "2px solid cyan",
              cursor: "pointer",
            }}
          >
            Jugar
          </button>
        </form>
        <p style={{ marginTop: 50, color: "gray", fontSize: 14 }}>
          ¡Usa las flechas para moverte y espacio para disparar!
        </p>
      </div>
    );
  }

  return <Game playerName={playerName} canvasWidth={CANVAS_W} canvasHeight={CANVAS_H} />;
}
