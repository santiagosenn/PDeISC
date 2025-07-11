// Declaro variables que voy a usar para que el juego funcione 
let tablero = Array(9).fill(null); 
let jugador = "X"; 
let juegoTerminado = false; 
let contraMaquina = false; 
let nombreUsuario = ""; 
let victorias = 0; 

// Declaro elementos del DOM necesarios para el juego
const tableroDiv = document.getElementById("tablero");
const mensaje = document.getElementById("mensajeTurno"); 

// Funcion para iniciar el juego en el modo seleccionado
function iniciarJuego(modo) {
    contraMaquina = modo === "maquina"; 
    document.getElementById("modoJuego").style.display = "none";
    document.getElementById("registro").style.display = "block";
}

// Funcion para registrar al usuario
function registrarUsuario() {
    const input = document.getElementById("nombreUsuario");
    nombreUsuario = input.value.trim(); 

    if (!nombreUsuario) {
      alert("Por favor ingresá un nombre válido.");
      return;
    }

    // Enviar el nombre al servidor para registrarlo
    fetch('/registrar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: nombreUsuario })
    })
    .then(res => {
      // Si el usuario ya existe, lo carga desde el servidor
      if (res.status === 409) {
        alert("El usuario ya existe. Continuando...");
        return fetch(`/usuario/${nombreUsuario}`);
      }
      if (!res.ok) throw new Error("Error al registrar usuario");
      return res.json();
    })
    .then(data => {
      if(data.mensaje) console.log(data.mensaje);
      return fetch(`/usuario/${nombreUsuario}`); 
    })
    .then(res => res.json())
    .then(data => {
      victorias = data.victorias || 0; 
      document.getElementById("victorias").textContent = victorias;
      mostrarTablero(); 
    })
    .catch(err => {
      alert(err.message); 
    });
}

// Funcion que muestra el tablero y oculta los formularios
function mostrarTablero() {
    document.getElementById("registro").style.display = "none";
    document.getElementById("tablero").style.display = "grid";
    document.getElementById("reiniciar").style.display = "inline-block";
    document.getElementById("infoUsuario").style.display = "block";
    document.getElementById("nombreMostrado").textContent = `Jugador: ${nombreUsuario}`;
    mensaje.textContent = `Turno de X`;
    crearTablero();
}

// Funcion que reinicia el contenido visual y logico del tablero
function crearTablero() {
    tableroDiv.innerHTML = ""; 
    tablero = Array(9).fill(null); 
    jugador = "X"; 
    juegoTerminado = false;

    // Crea 9 celdas para el tablero y les asigna eventos de clic
    for (let i = 0; i < 9; i++) {
      const celda = document.createElement("div");
      celda.classList.add("celda");
      celda.addEventListener("click", () => hacerJugada(i)); 
      tableroDiv.appendChild(celda);
    }
}

// Funcion que maneja cada jugada
function hacerJugada(i) {
    if (tablero[i] || juegoTerminado) return; 

    tablero[i] = jugador; 
    actualizarTablero(); 

    // Verifica si hay un ganador
    if (verificarGanador()) {
      mensaje.textContent = `¡Ganó ${jugador}!`;
      juegoTerminado = true;

      // Si el ganador es el jugador X, se actualiza el contador y se guarda en el servidor
      if (jugador === "X") {
        victorias++;
        document.getElementById("victorias").textContent = victorias;

        fetch('/puntaje', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nombre: nombreUsuario, puntaje: victorias })
        }).then(res => {
          if (!res.ok) {
            console.error("Error al actualizar puntaje");
          }
        });
      }

    // Si todas las celdas estan llenas y no hay ganador, es empate
    } else if (tablero.every(c => c)) {
      mensaje.textContent = "¡Empate!";
      juegoTerminado = true;
    } else {
      // Cambia el turno al otro jugador
      jugador = jugador === "X" ? "O" : "X";
      mensaje.textContent = `Turno de ${jugador}`;

      // Si se juega contra la maquina y es su turno, juega automaticamente despues de medio segundo
      if (contraMaquina && jugador === "O" && !juegoTerminado) {
        setTimeout(() => {
          const vacias = tablero.map((c, idx) => c === null ? idx : null).filter(i => i !== null);
          const eleccion = vacias[Math.floor(Math.random() * vacias.length)];
          hacerJugada(eleccion); // La maquina hace una jugada aleatoria
        }, 500);
      }
    }
}

// Funcion que actualiza visualmente el tablero
function actualizarTablero() {
    const celdas = document.querySelectorAll(".celda");
    celdas.forEach((celda, i) => {
      celda.textContent = tablero[i] || "";
    });
}

// Funcion que verifica si algun jugador gano
function verificarGanador() {
    const combinaciones = [
      [0,1,2],[3,4,5],[6,7,8], 
      [0,3,6],[1,4,7],[2,5,8], 
      [0,4,8],[2,4,6]          
    ];

    // Retorna true si alguna combinacion es ganadora
    return combinaciones.some(([a,b,c]) => 
      tablero[a] && tablero[a] === tablero[b] && tablero[a] === tablero[c]
    );
}

// Funcion para reiniciar la partida sin reiniciar usuario ni modo de juego
function reiniciarJuego() {
    crearTablero();
    mensaje.textContent = `Turno de X`;
}
