// Variables que voy a usar para hacer que funcione el juego
let contraMaquina = false;              
let nombreUsuario = "";                 
let victorias = 0;                     
let esperandoSegundoJugador = false;   
let jugadaJugador1 = null;             

// Funcion que se ejecuta al elegir el modo de juego
function iniciarJuego(modo) {
  contraMaquina = modo === "maquina"; // Si se elige el modo "maquina", se activa el juego contra la computadora
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

    // Envia solicitud al servidor para registrar al usuario
    fetch("/registrar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre: nombreUsuario }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al registrar usuario");
        return res.json();
      })
      .then(() => {
        // Configura la interfaz para mostrar los datos del usuario y el juego
        document.getElementById("registro").style.display = "none";
        document.getElementById("infoUsuario").style.display = "block";
        document.getElementById("juego").style.display = "block";
        document.getElementById("reiniciar").style.display = "inline-block";
        document.getElementById("nombreMostrado").textContent = `Jugador: ${nombreUsuario}`;
        return fetch(`/usuario/${nombreUsuario}`);
      })
      .then((res) => res.json())
      .then((data) => {
        victorias = data.victorias || 0;
        document.getElementById("victorias").textContent = victorias;
        document.getElementById("resultado").textContent = "";
      })
      .catch(() => alert("Error registrando o cargando datos."));
}

// Funcion que procesa una jugada del usuario
function hacerJugada(jugada) {
  if (contraMaquina) {
    // Si se juega contra la maquina, elige jugada aleatoria
    const jugadaMaquina = ["piedra", "papel", "tijera"][Math.floor(Math.random() * 3)];
    mostrarResultado(jugada, jugadaMaquina);
  } else {
    // Modo de dos jugadores
    if (!esperandoSegundoJugador) {
      // Primer jugador hace su jugada
      jugadaJugador1 = jugada;
      esperandoSegundoJugador = true;
      document.getElementById("resultado").textContent = "Turno del segundo jugador, elegí tu jugada";
    } else {
      // Segundo jugador hace su jugada y se muestra el resultado
      mostrarResultado(jugadaJugador1, jugada);
      esperandoSegundoJugador = false;
      jugadaJugador1 = null;
    }
  }
}

// Funcion que muestra el resultado entre dos jugadas
function mostrarResultado(j1, j2) {
    const resultado = determinarGanador(j1, j2); 
    let textoResultado = `Jugador 1: ${j1} vs Jugador 2: ${j2}. `;

    if (resultado === 0) {
      textoResultado += "¡Empate!";
    } else if (resultado === 1) {
      textoResultado += "¡Ganó Jugador 1!";
      
    
      if (contraMaquina || (!contraMaquina && jugadaJugador1 === j1)) {
        victorias++;
        document.getElementById("victorias").textContent = victorias;
        actualizarPuntajeServidor();
      }
    } else {
      textoResultado += "¡Ganó Jugador 2!";
    }

    document.getElementById("resultado").textContent = textoResultado;
}

// funcion para determinar quien gana entre dos jugadas
function determinarGanador(j1, j2) {
    if (j1 === j2) return 0; // Empate
    if (
      (j1 === "piedra" && j2 === "tijera") ||
      (j1 === "papel" && j2 === "piedra") ||
      (j1 === "tijera" && j2 === "papel")
    ) {
      return 1; 
    }
    return 2; 
}

// Envia el puntaje actualizado al servidor
function actualizarPuntajeServidor() {
    fetch("/puntaje", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre: nombreUsuario, puntaje: victorias }),
    });
}

// Reinicia todo el estado del juego
function reiniciarJuego() {
  victorias = 0;
  document.getElementById("victorias").textContent = victorias;
  document.getElementById("resultado").textContent = "";
  document.getElementById("modoJuego").style.display = "block";
  document.getElementById("registro").style.display = "none";
  document.getElementById("infoUsuario").style.display = "none";
  document.getElementById("juego").style.display = "none";
  document.getElementById("reiniciar").style.display = "none";
  contraMaquina = false;
  nombreUsuario = "";
  esperandoSegundoJugador = false;
  jugadaJugador1 = null;
  document.getElementById("nombreUsuario").value = "";
}
