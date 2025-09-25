import React, { useRef, useEffect, useState } from "react";

const CANVAS_W = 1918;
const CANVAS_H = 900;

function rectsCollide(a, b) {
  return !(
    a.x + a.w < b.x ||
    a.x > b.x + b.w ||
    a.y + a.h < b.y ||
    a.y > b.y + b.h
  );
}

export default function Game({ playerName }) {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const [showLevelMessage, setShowLevelMessage] = useState(false);
  const [scores, setScores] = useState([]);
  const [scoreSubmitted, setScoreSubmitted] = useState(false);

  const playerRef = useRef({
    x: CANVAS_W / 2 - 20,
    y: CANVAS_H - 60,
    w: 40,
    h: 20,
    speed: 10,
  });

  const bulletsRef = useRef([]);
  const enemyBulletsRef = useRef([]);
  const enemiesRef = useRef([]);
  const explosionsRef = useRef([]);
  const enemyDirRef = useRef(1);
  const animationRef = useRef(null);
  let enemyMoveTimer = useRef({ t: 0 });
  const shouldMoveDownRef = useRef(false);

  // Crear formación de enemigos según el nivel
  const createEnemies = (currentLevel) => {
    const rows = Math.min(4 + currentLevel, 7);
    const cols = 10;
    const enemies = [];
    
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        let enemyType = 'basic';
        let color = 'lime';
        
        // Definir tipos según la fila y nivel
        if (currentLevel >= 2 && r === 0) {
          enemyType = 'cone'; // Primera fila dispara en cono
          color = 'cyan';
        } else if (currentLevel >= 3 && r === 1) {
          enemyType = 'burst'; // Segunda fila dispara ráfaga
          color = 'magenta';
        }
        
        enemies.push({
          x: 40 + c * 60,
          y: 40 + r * 50,
          w: 32,
          h: 24,
          alive: true,
          type: enemyType,
          color: color,
          lastShot: 0
        });
      }
    }
    return enemies;
  };

  // Cargar scores desde el servidor
  const loadScores = async () => {
    try {
      const response = await fetch('http://localhost:3000/scores');
      const data = await response.json();
      setScores(data);
    } catch (error) {
      console.error('Error cargando scores:', error);
    }
  };

  // Enviar score al servidor
  const submitScore = async () => {
    if (scoreSubmitted) return;
    
    try {
      await fetch('http://localhost:3000/scores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          player: playerName,
          score: score
        }),
      });
      setScoreSubmitted(true);
      await loadScores();
    } catch (error) {
      console.error('Error enviando score:', error);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Cargar scores al iniciar
    loadScores();

    // Crear enemigos para el nivel actual
    enemiesRef.current = createEnemies(level);

    // Mostrar mensaje de nivel más corto
    if (level > 1) {
      setShowLevelMessage(true);
      setTimeout(() => setShowLevelMessage(false), 500); // Mucho más corto
    }

    const keys = {};
    const onKeyDown = (e) => {
      keys[e.key] = true;
      if (e.key.toLowerCase() === "r") restartGame();
    };
    const onKeyUp = (e) => (keys[e.key] = false);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    let lastTime = 0;
    function loop(time) {
      const dt = (time - lastTime) / 16.666;
      lastTime = time;
      update(dt, keys);
      draw(ctx);
      if (!gameOver && !gameWon) animationRef.current = requestAnimationFrame(loop);
    }
    animationRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [level, gameOver, gameWon]);

  // Effect separado para enviar score cuando el juego termina
  useEffect(() => {
    if ((gameOver || gameWon) && score > 0 && !scoreSubmitted) {
      submitScore();
    }
  }, [gameOver, gameWon, score, scoreSubmitted]);

  function update(dt, keys) {
    // Solo pausar controles durante mensaje de nivel, no todo el juego
    const player = playerRef.current;
    
    if (!showLevelMessage) {
      if (keys["ArrowLeft"]) player.x -= player.speed * dt;
      if (keys["ArrowRight"]) player.x += player.speed * dt;
      player.x = Math.max(0, Math.min(CANVAS_W - player.w, player.x));

      if (keys[" "]) {
        const now = Date.now();
        if (!player.lastShot || now - player.lastShot > 400) {
          bulletsRef.current.push({
            x: player.x + player.w / 2 - 2,
            y: player.y - 8,
            w: 4,
            h: 8,
            speed: 10,
          });
          player.lastShot = now;
        }
      }
    }

    bulletsRef.current.forEach((b) => (b.y -= b.speed * dt));
    bulletsRef.current = bulletsRef.current.filter((b) => b.y + b.h > 0);

    // Movimiento de enemigos
    const enemies = enemiesRef.current.filter((e) => e.alive);
    if (enemies.length > 0) {
      const edgeLeft = Math.min(...enemies.map((e) => e.x));
      const edgeRight = Math.max(...enemies.map((e) => e.x + e.w));
      
      if (edgeRight >= CANVAS_W - 10 && enemyDirRef.current === 1) {
        enemyDirRef.current = -1;
        shouldMoveDownRef.current = true;
      } else if (edgeLeft <= 10 && enemyDirRef.current === -1) {
        enemyDirRef.current = 1;
        shouldMoveDownRef.current = true;
      }
      
      if (shouldMoveDownRef.current) {
        enemiesRef.current.forEach((e) => {
          if (e.alive) e.y += 40;
        });
        shouldMoveDownRef.current = false;
      } else {
        enemiesRef.current.forEach((e) => {
          if (e.alive) e.x += enemyDirRef.current * (1.5 + level * 0.3) * dt * 2;
        });
      }
    }

    // Disparos de enemigos con diferentes patrones
    const now = Date.now();
    if (Math.random() < 0.01 + level * 0.005) {
      const shooters = enemies.filter((e) => e.alive && now - e.lastShot > 2000);
      if (shooters.length > 0) {
        const shooter = shooters[Math.floor(Math.random() * shooters.length)];
        shooter.lastShot = now;
        
        if (shooter.type === 'cone') {
          // Disparo en cono (3 balas)
          const angles = [-0.3, 0, 0.3];
          angles.forEach(angle => {
            enemyBulletsRef.current.push({
              x: shooter.x + shooter.w / 2 - 2,
              y: shooter.y + shooter.h,
              w: 8,
              h: 12,
              speed: 12,
              angle: angle
            });
          });
        } else if (shooter.type === 'burst') {
          // Ráfaga de 5 balas
          for (let i = 0; i < 5; i++) {
            setTimeout(() => {
              if (enemyBulletsRef.current) {
                enemyBulletsRef.current.push({
                  x: shooter.x + shooter.w / 2 - 2,
                  y: shooter.y + shooter.h,
                  w: 6,
                  h: 10,
                  speed: 18,
                  angle: 0
                });
              }
            }, i * 100);
          }
        } else {
          // Disparo básico
          enemyBulletsRef.current.push({
            x: shooter.x + shooter.w / 2 - 2,
            y: shooter.y + shooter.h,
            w: 10,
            h: 15,
            speed: 15,
            angle: 0
          });
        }
      }
    }

    // Mover balas enemigas
    enemyBulletsRef.current.forEach((b) => {
      b.y += b.speed * dt;
      if (b.angle) {
        b.x += Math.sin(b.angle) * b.speed * dt * 3;
      }
    });
    enemyBulletsRef.current = enemyBulletsRef.current.filter((b) => 
      b.y < CANVAS_H && b.x > -20 && b.x < CANVAS_W + 20
    );

    // Colisiones balas jugador con enemigos
    bulletsRef.current.forEach((b) => {
      enemiesRef.current.forEach((e) => {
        if (e.alive && rectsCollide(b, e)) {
          e.alive = false;
          b.hit = true;
          
          // Puntuación según tipo de enemigo
          let points = 10;
          if (e.type === 'cone') points = 20;
          if (e.type === 'burst') points = 30;
          
          // Actualizar score
          setScore(prev => prev + points);
          
          explosionsRef.current.push({
            x: e.x + e.w / 2,
            y: e.y + e.h / 2,
            radius: 5,
            life: 20,
          });
        }
      });
    });
    bulletsRef.current = bulletsRef.current.filter((b) => !b.hit);

    // Colisiones balas enemigos con jugador
    enemyBulletsRef.current.forEach((b) => {
      if (rectsCollide(b, player)) {
        b.hit = true;
        setLives(prevLives => {
          const newLives = Math.max(0, prevLives - 1);
          if (newLives <= 0) {
            setGameOver(true);
            cancelAnimationFrame(animationRef.current);
          }
          return newLives;
        });
      }
    });
    enemyBulletsRef.current = enemyBulletsRef.current.filter((b) => !b.hit);

    // Explosiones
    explosionsRef.current.forEach((ex) => {
      ex.radius += 1;
      ex.life -= 1;
    });
    explosionsRef.current = explosionsRef.current.filter((ex) => ex.life > 0);

    // Game over si enemigos bajan demasiado
    const anyReached = enemiesRef.current.some(
      (e) => e.alive && e.y + e.h >= playerRef.current.y
    );
    if (anyReached) {
      setGameOver(true);
      cancelAnimationFrame(animationRef.current);
    }

    // Pasar al siguiente nivel
    if (enemiesRef.current.every((e) => !e.alive)) {
      if (level < 3) {
        setLevel(prev => prev + 1);
      } else {
        // Juego completado - VICTORIA
        setGameWon(true);
        cancelAnimationFrame(animationRef.current);
      }
    }
  }

  function draw(ctx) {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    // Nave del jugador
    const p = playerRef.current;
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.moveTo(p.x + p.w / 2, p.y); 
    ctx.lineTo(p.x, p.y + p.h); 
    ctx.lineTo(p.x + p.w, p.y + p.h); 
    ctx.closePath();
    ctx.fill();

    // Balas jugador
    bulletsRef.current.forEach((b) => {
      ctx.fillStyle = "yellow";
      ctx.fillRect(b.x, b.y, b.w, b.h);
    });

    // Balas enemigos
    enemyBulletsRef.current.forEach((b) => {
      ctx.fillStyle = "red";
      ctx.fillRect(b.x, b.y, b.w, b.h);
    });

    // Enemigos con diferentes colores según tipo
    enemiesRef.current.forEach((e) => {
      if (e.alive) {
        ctx.fillStyle = e.color;
        ctx.fillRect(e.x, e.y, e.w, e.h / 4);
        ctx.fillRect(e.x + e.w / 4, e.y + e.h / 4, e.w / 2, e.h / 2);
        ctx.fillRect(e.x, e.y + (e.h * 3) / 4, e.w, e.h / 4);
        
        // Indicador visual del tipo
        if (e.type === 'cone') {
          ctx.fillStyle = "white";
          ctx.fillRect(e.x + e.w/2 - 2, e.y + e.h/2 - 2, 4, 4);
        } else if (e.type === 'burst') {
          ctx.fillStyle = "white";
          ctx.fillRect(e.x + e.w/2 - 1, e.y + e.h/2 - 1, 2, 2);
          ctx.fillRect(e.x + e.w/2 - 6, e.y + e.h/2 - 1, 2, 2);
          ctx.fillRect(e.x + e.w/2 + 4, e.y + e.h/2 - 1, 2, 2);
        }
      }
    });

    // Explosiones
    explosionsRef.current.forEach((ex) => {
      ctx.fillStyle = "orange";
      ctx.beginPath();
      ctx.arc(ex.x, ex.y, ex.radius, 0, Math.PI * 2);
      ctx.fill();
    });

    // HUD
    ctx.fillStyle = "white";
    ctx.font = "16px monospace";
    ctx.fillText(`Score: ${score}`, 100, 40);
    ctx.fillText(`Nivel: ${level}`, 300, 40);

    // Vidas
    ctx.fillText(`Vidas`, 1600, 40);
    for (let i = 0; i < lives; i++) {
      ctx.fillStyle = "red";
      const x = 1660 + i * 30;
      const y = 15;

      ctx.beginPath();
      ctx.moveTo(x, y + 10);
      ctx.bezierCurveTo(x, y, x - 10, y, x - 10, y + 10);
      ctx.bezierCurveTo(x - 10, y + 20, x, y + 25, x, y + 35);
      ctx.bezierCurveTo(x, y + 25, x + 10, y + 20, x + 10, y + 10);
      ctx.bezierCurveTo(x + 10, y, x, y, x, y + 10);
      ctx.fill();
    }

    // Mensaje de nivel
    if (showLevelMessage) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
      ctx.fillStyle = "yellow";
      ctx.font = "48px monospace";
      const text = `NIVEL ${level}`;
      const textWidth = ctx.measureText(text).width;
      ctx.fillText(text, (CANVAS_W - textWidth) / 2, CANVAS_H / 2);
    }

    // Game Over / Victoria con tabla de puntuaciones
    if (gameOver || gameWon) {
      // Fondo semitransparente
      ctx.fillStyle = "rgba(0, 0, 0, 0.9)";
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
      
      // Mensaje principal
      ctx.fillStyle = gameWon ? "gold" : "red";
      ctx.font = "48px monospace";
      const message = gameWon ? "¡VICTORIA!" : "GAME OVER";
      const messageWidth = ctx.measureText(message).width;
      ctx.fillText(message, (CANVAS_W - messageWidth) / 2, CANVAS_H / 2 - 200);
      
      // Score final
      ctx.fillStyle = "white";
      ctx.font = "24px monospace";
      const scoreText = `Tu puntuación: ${score}`;
      const scoreWidth = ctx.measureText(scoreText).width;
      ctx.fillText(scoreText, (CANVAS_W - scoreWidth) / 2, CANVAS_H / 2 - 150);
      
      // Instrucción de reinicio
      ctx.font = "20px monospace";
      const restartText = 'Presiona "R" para reiniciar';
      const restartWidth = ctx.measureText(restartText).width;
      ctx.fillText(restartText, (CANVAS_W - restartWidth) / 2, CANVAS_H / 2 - 100);
      
      // Tabla de puntuaciones
      ctx.fillStyle = "cyan";
      ctx.font = "20px monospace";
      const titleText = "TOP PUNTUACIONES";
      const titleWidth = ctx.measureText(titleText).width;
      ctx.fillText(titleText, (CANVAS_W - titleWidth) / 2, CANVAS_H / 2 - 50);
      
      ctx.fillStyle = "white";
      ctx.font = "16px monospace";
      scores.slice(0, 10).forEach((scoreEntry, index) => {
        const y = CANVAS_H / 2 - 20 + (index * 25);
        const position = `${index + 1}.`.padEnd(3);
        const name = scoreEntry.player.substring(0, 15).padEnd(16);
        const points = scoreEntry.score.toString();
        const lineText = `${position} ${name} ${points}`;
        const lineWidth = ctx.measureText(lineText).width;
        ctx.fillText(lineText, (CANVAS_W - lineWidth) / 2, y);
      });
    }
  }

  function restartGame() {
    // Limpiar todo
    bulletsRef.current = [];
    enemyBulletsRef.current = [];
    explosionsRef.current = [];
    playerRef.current.x = CANVAS_W / 2 - 20;
    enemyDirRef.current = 1;
    shouldMoveDownRef.current = false;
    enemyMoveTimer.current = { t: 0 };
    
    // Resetear estados
    setScore(0);
    setGameOver(false);
    setGameWon(false);
    setLives(3);
    setLevel(1);
    setShowLevelMessage(false);
    setScoreSubmitted(false);
    
    // Crear nuevos enemigos
    enemiesRef.current = createEnemies(1);
  }

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={CANVAS_W}
        height={CANVAS_H}
        style={{ border: "1px solid #333" }}
      />
    </div>
  );
}