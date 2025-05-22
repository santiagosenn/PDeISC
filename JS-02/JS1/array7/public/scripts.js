//declaro los vectores

let palabras = [];
let numeros = [];
let ciudades = [];

//creo la funcion para agarrar un vector y actualizar la lista

function actualizarLista(array, idLista) {
    const ul = document.getElementById(idLista);
    ul.innerHTML = "";
    array.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item;
        ul.appendChild(li);
    });
}

//creo las funciones para crear un nuevo elemento dentro del vector y luego para buscar un elemento dentro del vector

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("form-palabras").addEventListener("submit", e => {
        e.preventDefault();
        const palabra = document.getElementById("input-palabra").value.trim();
        if (palabra) {
            palabras.push(palabra);
            actualizarLista(palabras, "lista-palabras");
        }
        document.getElementById("input-palabra").value = "";
    });

    document.getElementById("btn-buscar-palabra").addEventListener("click", () => {
        const buscada = document.getElementById("buscar-palabra").value.trim();
        const idx = palabras.indexOf(buscada);
        const res = document.getElementById("resultado-palabra");
        res.textContent = idx !== -1
            ? `"${buscada}" está en la posición ${idx}`
            : `"${buscada}" no se encontró.`;
    });

    document.getElementById("form-numeros").addEventListener("submit", e => {
        e.preventDefault();
        const num = parseInt(document.getElementById("input-numero").value);
        if (!isNaN(num)) {
            numeros.push(num);
            actualizarLista(numeros, "lista-numeros");
        }
        document.getElementById("input-numero").value = "";
    });

    document.getElementById("btn-buscar-numero").addEventListener("click", () => {
        const buscado = parseInt(document.getElementById("buscar-numero").value);
        const idx = numeros.indexOf(buscado);
        const res = document.getElementById("resultado-numero");
        res.textContent = idx !== -1
            ? `El número ${buscado} está en la posición ${idx}`
            : `El número ${buscado} no se encontró.`;
    });

    document.getElementById("form-ciudades").addEventListener("submit", e => {
        e.preventDefault();
        const ciudad = document.getElementById("input-ciudad").value.trim();
        if (ciudad) {
            ciudades.push(ciudad);
            actualizarLista(ciudades, "lista-ciudades");
        }
        document.getElementById("input-ciudad").value = "";
    });

    document.getElementById("btn-buscar-ciudad").addEventListener("click", () => {
        const buscada = document.getElementById("buscar-ciudad").value.trim();
        const idx = ciudades.indexOf(buscada);
        const res = document.getElementById("resultado-ciudad");
        res.textContent = idx !== -1
            ? `"${buscada}" está en la posición ${idx}`
            : `"${buscada}" no se encontró.`;
    });
});
