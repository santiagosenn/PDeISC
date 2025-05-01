let h1Agregado = false;
let imagenAgregada = false;

function agregarH1() {
    if (!h1Agregado) {
        const h1 = document.createElement('h1');
        h1.id = 'titulo';
        h1.textContent = 'Hola DOM';
        document.getElementById('contenedor').appendChild(h1);
        h1Agregado = true;
    }
}

function cambiarTextoH1() {
    const h1 = document.getElementById('titulo');
    if (h1) {
        h1.textContent = 'Chau DOM';
    }
}

function cambiarColorH1() {
    const h1 = document.getElementById('titulo');
    if (h1) {
        h1.style.color = getRandomColor();
    }
}

function agregarImagen() {
    if (!imagenAgregada) {
        const img = document.createElement('img');
        img.id = 'imagen';
        img.src = 'img/gato.jpg'; // Imagen local
        document.getElementById('contenedor').appendChild(img);
        imagenAgregada = true;
    }
}

function cambiarImagen() {
    const img = document.getElementById('imagen');
    if (img) {
        img.src = 'img/perro.jpg'; // Imagen local cambiada
    }
}

function cambiarTamañoImagen() {
    const img = document.getElementById('imagen');
    if (img) {
        img.style.width = '300px'; // Nuevo tamaño
    }
}

function getRandomColor() {
    const letras = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letras[Math.floor(Math.random() * 16)];
    }
    return color;
}
