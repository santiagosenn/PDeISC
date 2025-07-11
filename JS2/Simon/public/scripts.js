// Declaro los botones que voy a utilizar
const botones = document.querySelectorAll('.boton');
const colores = ['verde', 'rojo', 'amarillo', 'azul'];

// Declaro las variables que voy a usar dentro del juego
let secuenciaMaquina = [];   
let secuenciaJugador = [];   
let ronda = 0;               
let esperandoInput = false;  
let nombreJugador = '';      
let puntajeMaximo = 0;       

// Declaro los lementos del DOM
const formRegistro = document.getElementById('formRegistro');
const pantallaRegistro = document.getElementById('pantalla-registro');
const pantallaJuego = document.getElementById('pantalla-juego');
const jugadorTexto = document.getElementById('jugador');
const puntajeMaximoTexto = document.getElementById('puntajeMaximo');

// Creo y agrego un elemento que muestra el puntaje actual
const puntajeTexto = document.createElement('h2');
puntajeTexto.textContent = `Puntaje: 0`;
pantallaJuego.appendChild(puntajeTexto);

// Creo boton para reiniciar el juego despues de perder
const botonReiniciar = document.createElement('button');
botonReiniciar.textContent = 'Jugar de nuevo';
botonReiniciar.style.display = 'none';
botonReiniciar.style.padding = '10px 20px';
botonReiniciar.style.fontSize = '1rem';
botonReiniciar.style.marginTop = '20px';
botonReiniciar.style.cursor = 'pointer';
pantallaJuego.appendChild(botonReiniciar);

// Creo el evento que se inicia al enviar el formulario de registro
formRegistro.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Obteno nombre ingresado
    nombreJugador = document.getElementById('nombre').value.trim();
    if (nombreJugador === '') return; // Validación

    try {
        // Envio nombre al servidor
        const respuesta = await fetch('/registrar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre: nombreJugador })
        });

        const data = await respuesta.json();
        console.log('Registrado en servidor:', data);

        // Cambio de pantalla y comenzar el juego
        jugadorTexto.textContent = `Jugador: ${nombreJugador}`;
        pantallaRegistro.style.display = 'none';
        pantallaJuego.style.display = 'block';
        nuevaRonda();
    } catch (error) {
        console.error('Error al registrar:', error);
    }                                     
});

// Funcion que ilumina un boton
function iluminar(boton) {
    boton.style.filter = 'brightness(1.8) drop-shadow(0 0 10px white)';
    boton.style.opacity = '1';
    setTimeout(() => {
        boton.style.filter = 'none';
        boton.style.opacity = '0.8';
    }, 500); 
}

// Reproduce la secuencia de la maquina visualmente
function reproducirSecuencia() {
    esperandoInput = false;
    let i = 0;

    const intervalo = setInterval(() => {
        const color = secuenciaMaquina[i];
        const boton = document.getElementById(color);
        iluminar(boton);
        i++;

        // Cuando termina la secuencia, se habilita la entrada del jugador
        if (i >= secuenciaMaquina.length) {
            clearInterval(intervalo);
            esperandoInput = true;
        }
    }, 700);
}

// Inicia una nueva ronda, agregando un color nuevo a la secuencia
function nuevaRonda() {
    ronda++;
    puntajeTexto.textContent = `Puntaje: ${ronda - 1}`;
    const nuevoColor = colores[Math.floor(Math.random() * colores.length)];
    secuenciaMaquina.push(nuevoColor); 
    secuenciaJugador = []; 
    setTimeout(reproducirSecuencia, 1000); 
}

// Evento al hacer clic en cada boton de color
botones.forEach(boton => {
    boton.addEventListener('click', () => {
        if (!esperandoInput) return; 

        const colorClicado = boton.id;
        secuenciaJugador.push(colorClicado); 
        iluminar(boton); 

        const indice = secuenciaJugador.length - 1;

        // Verifica si el jugador se equivocó
        if (secuenciaJugador[indice] !== secuenciaMaquina[indice]) {
            perder(); 
            return;
        }

        // Si la secuencia esta completa y es correcta, pasa a la siguiente ronda
        if (secuenciaJugador.length === secuenciaMaquina.length) {
            esperandoInput = false;
            setTimeout(nuevaRonda, 1000);
        }
    });
});

// Funcion que se llama cuando el jugador pierde
function perder() {
    esperandoInput = false;
    const puntajeFinal = ronda - 1;
    puntajeTexto.textContent = `Juego terminado. Puntaje final: ${puntajeFinal}`;

    // Actualizo el puntaje maximo si corresponde
    if (puntajeFinal > puntajeMaximo) {
        puntajeMaximo = puntajeFinal;
        puntajeMaximoTexto.textContent = `Puntaje máximo: ${puntajeMaximo}`;
    }

    // Envio el puntaje al servidor
    fetch('/puntaje', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: nombreJugador, puntaje: puntajeFinal })
    })
    .then(res => res.json())
    .then(data => console.log('Puntaje enviado:', data))
    .catch(err => console.error('Error al enviar puntaje:', err));

    
    botonReiniciar.style.display = 'inline-block';
}

// Reinicio el juego al hacer clic en el boton "Jugar de nuevo"
botonReiniciar.addEventListener('click', () => {
    secuenciaMaquina = [];
    secuenciaJugador = [];
    ronda = 0;
    botonReiniciar.style.display = 'none';
    nuevaRonda(); 
});