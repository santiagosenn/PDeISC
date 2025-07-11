let frutas = [];
let amigos = [];
let numeros = [];

//Declaro los arrays//

function agregarElemento(array, valor, listaID) {
    array.push(valor);
    const ul = document.getElementById(listaID);
    const li = document.createElement("li");
    li.textContent = valor;
    ul.appendChild(li);
}

//Creo la funcion para agregar elementos dentro del array

function agregarSiEsMayor(array, valor, listaID) {
    const mensajeError = document.getElementById("mensaje-error");
    
    if (array.length === 0 || valor > array[array.length - 1]) {
        agregarElemento(array, valor, listaID);
        mensajeError.textContent = "";
    } else {
        mensajeError.textContent = "Solo se pueden agregar números mayores al último.";
    }
}

//Creo la funcion para que no se permita agregar un numero mas grande que al anterior en la lista de numeros

document.addEventListener("DOMContentLoaded", () => {

    const formFrutas = document.getElementById("form-frutas");
    formFrutas.addEventListener("submit", (e) => {
        e.preventDefault();
        const input = document.getElementById("input-fruta");
        agregarElemento(frutas, input.value.trim(), "lista-frutas");
        input.value = "";
    });

    const formAmigos = document.getElementById("form-amigos");
    formAmigos.addEventListener("submit", (e) => {
        e.preventDefault();
        const input = document.getElementById("input-amigo");
        agregarElemento(amigos, input.value.trim(), "lista-amigos");
        input.value = "";
    });

    const formNumeros = document.getElementById("form-numeros");
    formNumeros.addEventListener("submit", (e) => {
        e.preventDefault();
        const input = document.getElementById("input-numero");
        const valor = parseFloat(input.value);
        agregarSiEsMayor(numeros, valor, "lista-numeros");
        input.value = "";
    });
});

//creo las funciones para agregar elementos dependiendo de la lista
