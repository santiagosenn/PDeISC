//declaro los vectores

let colores = [];
let tareas = [];
let usuarios = [];

//creo la funcion para que agarre un vector y actualice la lista

function actualizarLista(array, listaID) {
    const ul = document.getElementById(listaID);
    ul.innerHTML = "";
    array.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item;
        ul.appendChild(li);
    });
}

//creo la funcion para agregar el nuevo elemento al principio

function agregarAlPrincipio(array, valor, listaID) {
    array.unshift(valor);
    actualizarLista(array, listaID);
}

document.addEventListener("DOMContentLoaded", () => {
    actualizarLista(colores, "lista-colores");
    actualizarLista(tareas, "lista-tareas");
    actualizarLista(usuarios, "lista-usuarios");

    //Cambio las funcionalidadespor defecto de los formularios

    const formColores = document.getElementById("form-colores");
    formColores.addEventListener("submit", e => {
        e.preventDefault();
        const input = document.getElementById("input-color");
        const valor = input.value.trim();
        if (valor) {
            agregarAlPrincipio(colores, valor, "lista-colores");
        }
        input.value = "";
    });

    const formTareas = document.getElementById("form-tareas");
    formTareas.addEventListener("submit", e => {
        e.preventDefault();
        const input = document.getElementById("input-tarea");
        const valor = input.value.trim();
        if (valor) {
            agregarAlPrincipio(tareas, valor, "lista-tareas");
        }
        input.value = "";
    });

    const formUsuarios = document.getElementById("form-usuarios");
    formUsuarios.addEventListener("submit", e => {
        e.preventDefault();
        const input = document.getElementById("input-usuario");
        const valor = input.value.trim();
        if (valor) {
            agregarAlPrincipio(usuarios, valor, "lista-usuarios");
        }
        input.value = "";
    });
});
