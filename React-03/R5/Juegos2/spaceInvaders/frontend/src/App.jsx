import React, { useState } from "react";
import Game from "../components/Game";

export default function App() {
  const [playerName, setPlayerName] = useState("");
  const [start, setStart] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (playerName.trim() !== "") setStart(true);
  };

  if (!start) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          width: "100vw",
          backgroundColor: "black",
          color: "white",
          fontFamily: "'Press Start 2P', cursive", // tipografía retro
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontSize: 32, marginBottom: 20 }}> Space Invaders </h1>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Ingresa tu nombre"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              style={{
                padding: "10px",
                fontSize: "14px",
                fontFamily: "'Press Start 2P', cursive",
                background: "black",
                color: "lime",
                border: "2px solid lime",
                textAlign: "center",
              }}
            />
            <br />
            <button
              type="submit"
              style={{
                marginTop: 20,
                padding: "10px 20px",
                fontSize: "14px",
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
        </div>
      </div>
    );
  }

  return <Game playerName={playerName} />;
}
