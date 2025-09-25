// src/components/Game1942.jsx
import React, { useRef, useEffect, useState } from "react";

function rectsCollide(a, b) {
  return !(
    a.x + a.w < b.x ||
    a.x > b.x + b.w ||
    a.y + a.h < b.y ||
    a.y > b.y + b.h
  );
}

export default function Game1942({ playerName, canvasWidth, canvasHeight }) {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const animationRef = useRef(null);

  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [highScores, setHighScores] = useState([]);
  const [loadingScores, setLoadingScores] = useState(false);

  const playerRef = useRef({ x: 0, y: 0, w: 40, h: 40, speed: 5, lastShot: 0 });
  const bulletsRef = useRef([]);
  const enemiesRef = useRef([]);
  const enemyBulletsRef = useRef([]);
  const playerHitRef = useRef(false);

  // refs para controlar el loop de forma fiable (evita problemas por cierres)
  const isGameOverRef = useRef(false);
  const isGameWonRef = useRef(false);

  const createEnemies = (lvl) => {
    const enemies = [];
    const rows = 2 + Math.floor(lvl / 2);
    const cols = 5 + lvl;
    const spacing = 80;
    const startX = 50;
    const startY = 50;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        enemies.push({
          x: startX + c * spacing,
          y: startY + r * spacing,
          w: 35,
          h: 35,
          alive: true,
          speed: 5 + lvl * 0.3,
          direction: 1,
          lastShot: 0,
        });
      }
    }
    return enemies;
  };

  // helper para finalizar el juego (actualiza state + refs)
  const endGame = (won = false) => {
    if (won) {
      setGameWon(true);
      isGameWonRef.current = true;
    } else {
      setGameOver(true);
      isGameOverRef.current = true;
    }
  };

  // inicializa y corre el loop; se re-ejecuta cuando cambian level / gameOver / gameWon
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // usar props si vienen, si no fallback a window
    canvas.width = canvasWidth || window.innerWidth;
    canvas.height = canvasHeight || window.innerHeight;
    canvas.style.display = "block";
    const ctx = canvas.getContext("2d");
    ctxRef.current = ctx;

    // posicion inicial del jugador
    const player = playerRef.current;
    player.x = canvas.width / 2 - player.w / 2;
    player.y = canvas.height - player.h - 10;

    // reset simples al arrancar / cambiar nivel
    bulletsRef.current = [];
    enemyBulletsRef.current = [];
    enemiesRef.current = createEnemies(level);
    playerHitRef.current = false;

    // set refs de control de estado (si se re-inicia)
    isGameOverRef.current = gameOver;
    isGameWonRef.current = gameWon;

    const keys = {};
    const onKeyDown = (e) => (keys[e.key] = true);
    const onKeyUp = (e) => (keys[e.key] = false);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    const loop = () => {
      update(keys, canvas.width, canvas.height);
      draw(ctx, canvas.width, canvas.height);
      if (!isGameOverRef.current && !isGameWonRef.current) {
        animationRef.current = requestAnimationFrame(loop);
      } else {
        // cuando termina, dibujamos una vez más para "congelar" la pantalla final
        draw(ctx, canvas.width, canvas.height);
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };

    // empezar loop
    animationRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      animationRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level, gameOver, gameWon, canvasWidth, canvasHeight]);

  // cuando termina (gameOver/gameWon) => guardar puntaje y traer lista desde backend
  useEffect(() => {
    if (!gameOver && !gameWon) return;

    let mounted = true;
    (async () => {
      try {
        setLoadingScores(true);
        // Guardar puntaje (esperamos que termine antes de pedir la lista)
        await fetch("http://localhost:3001/scores1942", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ player: playerName, score }),
        });

        // Obtener lista actualizada
        const res = await fetch("http://localhost:3001/scores1942");
        const data = await res.json();
        if (mounted) setHighScores(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error guardando/leyendo puntajes:", err);
        if (mounted) setHighScores([]);
      } finally {
        if (mounted) setLoadingScores(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [gameOver, gameWon, playerName, score]);

  const update = (keys, canvasW, canvasH) => {
    const player = playerRef.current;

    // movimiento
    if (keys["ArrowLeft"]) player.x -= player.speed;
    if (keys["ArrowRight"]) player.x += player.speed;
    if (keys["ArrowUp"]) player.y -= player.speed;
    if (keys["ArrowDown"]) player.y += player.speed;
    player.x = Math.max(0, Math.min(canvasW - player.w, player.x));
    player.y = Math.max(0, Math.min(canvasH - player.h, player.y));

    // disparo
    if (keys[" "]) {
      const now = Date.now();
      if (!player.lastShot || now - player.lastShot > 300) {
        bulletsRef.current.push({
          x: player.x + player.w / 2 - 2,
          y: player.y,
          w: 4,
          h: 10,
          speed: 8,
        });
        player.lastShot = now;
      }
    }

    // mover balas del jugador
    bulletsRef.current.forEach((b) => (b.y -= b.speed));
    bulletsRef.current = bulletsRef.current.filter((b) => b.y > 0 && !b.hit);

    // detectar borde para los enemigos y moverlos
    let changeDirection = false;
    let shouldMoveDown = false;

    enemiesRef.current.forEach((e) => {
      if (e.alive) {
        const nextX = e.x + e.direction * 2;
        if (nextX <= 0 || nextX + e.w >= canvasW) {
          changeDirection = true;
          shouldMoveDown = true;
        }
      }
    });

    enemiesRef.current.forEach((e) => {
      if (e.alive) {
        if (changeDirection) e.direction *= -1;
        if (shouldMoveDown) e.y += 20;
        else e.x += e.direction * 6;

        if (e.y + e.h > canvasH - 100) {
          endGame(false);
          return;
        }

        if (!e.lastShot || Date.now() - e.lastShot > 1500) {
          if (Math.random() < 0.03) {
            enemyBulletsRef.current.push({
              x: e.x + e.w / 2 - 2,
              y: e.y + e.h,
              w: 4,
              h: 8,
              speed: 4,
              hit: false,
            });
            e.lastShot = Date.now();
          }
        }
      }
    });

    // colision jugador-enemigo
    if (!playerHitRef.current) {
      for (let i = 0; i < enemiesRef.current.length; i++) {
        const e = enemiesRef.current[i];
        if (e.alive && rectsCollide(e, player)) {
          e.alive = false;
          damagePlayer();
          break;
        }
      }
    }

    enemiesRef.current = enemiesRef.current.filter((e) => e.alive);

    // balas enemigas
    if (!playerHitRef.current) {
      for (let i = 0; i < enemyBulletsRef.current.length; i++) {
        const b = enemyBulletsRef.current[i];
        b.y += b.speed;
        if (!b.hit && rectsCollide(b, player)) {
          b.hit = true;
          damagePlayer();
          break;
        }
      }
    }

    enemyBulletsRef.current = enemyBulletsRef.current.filter(
      (b) => !b.hit && b.y < canvasH
    );

    // colisiones balas jugador con enemigos
    for (let i = 0; i < bulletsRef.current.length; i++) {
      const b = bulletsRef.current[i];
      if (b.hit) continue;
      for (let j = 0; j < enemiesRef.current.length; j++) {
        const e = enemiesRef.current[j];
        if (e.alive && rectsCollide(b, e)) {
          e.alive = false;
          b.hit = true;
          setScore((prev) => prev + 10);
          break;
        }
      }
    }

    // subir nivel / ganar
    if (enemiesRef.current.length === 0) {
      if (level < 3) {
        enemyBulletsRef.current = [];
        bulletsRef.current = [];
        setLevel((prev) => prev + 1);
      } else {
        endGame(true);
      }
    }
  };

  const damagePlayer = () => {
    if (playerHitRef.current) return;
    playerHitRef.current = true;

    setLives((prev) => {
      const newLives = prev - 1;
      if (newLives <= 0) endGame(false);
      return newLives;
    });

    setTimeout(() => {
      playerHitRef.current = false;
    }, 500);
  };

  // dibujado principal (se usa para todas las frames)
  const draw = (ctx, canvasW, canvasH) => {
    // fondo
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvasW, canvasH);

    // jugador
    const p = playerRef.current;
    if (!playerHitRef.current || Math.floor(Date.now() / 100) % 2) {
      ctx.fillStyle = "blue";
      ctx.fillRect(p.x, p.y, p.w, p.h);
      ctx.fillStyle = "lightblue";
      ctx.fillRect(p.x + 5, p.y + 5, p.w - 10, p.h - 10);
      ctx.fillStyle = "darkblue";
      ctx.fillRect(p.x + p.w / 2 - 2, p.y - 5, 4, 8);
    }

    // balas jugador
    ctx.fillStyle = "yellow";
    bulletsRef.current.forEach((b) => {
      if (!b.hit) ctx.fillRect(b.x, b.y, b.w, b.h);
    });

    // enemigos
    ctx.fillStyle = "red";
    enemiesRef.current.forEach((e) => {
      if (e.alive) {
        ctx.fillRect(e.x, e.y, e.w, e.h);
        ctx.fillStyle = "darkred";
        ctx.fillRect(e.x + 2, e.y + 2, e.w - 4, e.h - 4);
        ctx.fillStyle = "red";
      }
    });

    // balas enemigas
    ctx.fillStyle = "orange";
    enemyBulletsRef.current.forEach((b) => {
      if (!b.hit) ctx.fillRect(b.x, b.y, b.w, b.h);
    });

    // UI
    ctx.fillStyle = "white";
    ctx.font = "16px monospace";
    ctx.fillText(`Score: ${score}`, 10, 20);
    ctx.fillText(`Nivel: ${level}`, 10, 40);
    ctx.fillText(`Vidas: ${lives}`, canvasW - 100, 20);
    ctx.font = "12px monospace";
    ctx.fillText("Flechas: Mover | Espacio: Disparar", 10, canvasH - 20);

    // Si terminó, atenuar el fondo (la UI final se muestra en overlay HTML)
    if (isGameOverRef.current || isGameWonRef.current) {
      ctx.fillStyle = "rgba(0,0,0,0.6)";
      ctx.fillRect(0, 0, canvasW, canvasH);
      ctx.fillStyle = isGameOverRef.current ? "red" : "lime";
      ctx.font = "48px monospace";
      ctx.textAlign = "center";
      ctx.fillText(
        isGameOverRef.current ? "GAME OVER" : "¡GANASTE!",
        canvasW / 2,
        canvasH / 2 - 30
      );
      ctx.font = "24px monospace";
      ctx.fillStyle = "white";
      ctx.fillText(`Score Final: ${score}`, canvasW / 2, canvasH / 2 + 20);
      ctx.textAlign = "left";
    }
  };

  // Reiniciar la partida (reintentar)
  const resetGame = () => {
    // reset states
    setScore(0);
    setLives(3);
    setLevel(1);
    setGameOver(false);
    setGameWon(false);
    setHighScores([]);
    isGameOverRef.current = false;
    isGameWonRef.current = false;

    // reset refs
    const canvas = canvasRef.current;
    if (canvas) {
      playerRef.current.x = (canvas.width || (canvasWidth || window.innerWidth)) / 2 - playerRef.current.w / 2;
      playerRef.current.y = (canvas.height || (canvasHeight || window.innerHeight)) - playerRef.current.h - 10;
    }
    playerHitRef.current = false;
    bulletsRef.current = [];
    enemyBulletsRef.current = [];
    enemiesRef.current = createEnemies(1);

    // el useEffect que controla el loop detectará el cambio y reiniciará el loop
  };

  // Contenedor relativo para overlay HTML
  const wrapperStyle = {
    position: "relative",
    width: canvasWidth || "100vw",
    height: canvasHeight || "100vh",
    overflow: "hidden",
  };

  // Overlay modal style
  const overlayStyle = {
    position: "absolute",
    left: 0,
    top: 0,
    width: "100%",
    height: "100%",
    display: isGameOverRef.current || isGameWonRef.current ? "flex" : "none",
    alignItems: "center",
    justifyContent: "center",
    pointerEvents: isGameOverRef.current || isGameWonRef.current ? "auto" : "none",
  };

  const modalStyle = {
    background: "rgba(10,10,10,0.95)",
    color: "white",
    padding: 20,
    border: "3px solid cyan",
    borderRadius: 8,
    minWidth: 320,
    maxWidth: "90%",
    maxHeight: "80%",
    overflowY: "auto",
    textAlign: "center",
    fontFamily: "monospace",
  };

  return (
    <div style={wrapperStyle}>
      <canvas ref={canvasRef} style={{ display: "block", width: "100%", height: "100%" }} />

      <div style={overlayStyle}>
        <div style={modalStyle}>
          <h2 style={{ margin: 0, color: isGameOverRef.current ? "red" : "lime" }}>
            {isGameOverRef.current ? "GAME OVER" : isGameWonRef.current ? "¡GANASTE!" : ""}
          </h2>
          <p style={{ marginTop: 8 }}>Score Final: <strong>{score}</strong></p>

          <div style={{ marginTop: 12 }}>
            <h3 style={{ margin: "10px 0", color: "cyan" }}>🏆 Tabla de Puntajes</h3>

            {loadingScores ? (
              <p>Cargando puntajes...</p>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse", color: "lime" }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "left", padding: "6px 8px" }}>#</th>
                    <th style={{ textAlign: "left", padding: "6px 8px" }}>Jugador</th>
                    <th style={{ textAlign: "right", padding: "6px 8px" }}>Puntos</th>
                    <th style={{ textAlign: "right", padding: "6px 8px" }}>Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {highScores.length === 0 ? (
                    <tr><td colSpan="4" style={{ padding: 8 }}>No hay puntajes</td></tr>
                  ) : (
                    highScores.map((s, i) => (
                      <tr key={s.id || i} style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                        <td style={{ padding: "6px 8px" }}>{i + 1}</td>
                        <td style={{ padding: "6px 8px" }}>{s.player}</td>
                        <td style={{ padding: "6px 8px", textAlign: "right" }}>{s.score}</td>
                        <td style={{ padding: "6px 8px", textAlign: "right" }}>
                          {s.created_at ? new Date(s.created_at).toLocaleString() : ""}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>

          <div style={{ marginTop: 16, display: "flex", gap: 10, justifyContent: "center" }}>
            <button
              onClick={resetGame}
              style={{
                padding: "8px 14px",
                background: "black",
                color: "cyan",
                border: "2px solid cyan",
                cursor: "pointer",
                fontFamily: "monospace",
              }}
            >
              Reintentar
            </button>

            <button
              onClick={() => {
                // volver a pantalla de inicio: para eso, tiramos evento custom para que App.jsx lo capture si lo necesita.
                // Si no capturás, podés recargar la página con window.location.reload()
                const evt = new CustomEvent("game-exit");
                window.dispatchEvent(evt);
              }}
              style={{
                padding: "8px 14px",
                background: "black",
                color: "lime",
                border: "2px solid lime",
                cursor: "pointer",
                fontFamily: "monospace",
              }}
            >
              Volver al menú
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
