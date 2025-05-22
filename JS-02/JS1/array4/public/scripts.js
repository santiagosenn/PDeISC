//Declaro los vectores

let numeros = [];
let mensajes = [];
let clientes = [];

//Creo la funcion para que agarre un vector y actualice la lista

function actualizarLista(array, listaID) {
    const ul = document.getElementById(listaID);
    ul.innerHTML = "";
    array.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item;
        ul.appendChild(li);
    });
}

//Creo la funcion para agregar un elemento

function agregarElemento(array, valor, listaID) {
    array.push(valor);
    actualizarLista(array, listaID);
}

//Creo la funcion para eliminar el primer elemento

function quitarPrimerElemento(array, listaID, mensajeID, textoPre) {
    const mensaje = document.getElementById(mensajeID);
    if(array.length === 0) {
        mensaje.textContent = textoPre + "No hay elementos para quitar.";
        return null;
    }
    const eliminado = array.shift();
    actualizarLista(array, listaID);
    mensaje.textContent = `${textoPre}${eliminado}`;
    return eliminado;
}

document.addEventListener("DOMContentLoaded", () => {
    actualizarLista(numeros, "lista-numeros");
    actualizarLista(mensajes, "lista-mensajes");
    actualizarLista(clientes, "lista-clientes");

    //Cambio las funcionalidades por defecto que tienen los formularios

    const formNumeros = document.getElementById("form-numeros");
    formNumeros.addEventListener("submit", e => {
        e.preventDefault();
        const input = document.getElementById("input-numero");
        const valor = parseInt(input.value);
        if(!isNaN(valor)) {
            agregarElemento(numeros, valor, "lista-numeros");
            document.getElementById("mensaje-numero").textContent = "";
        }
        input.value = "";
    });

    document.getElementById("btn-quitar-numero").addEventListener("click", () => {
        quitarPrimerElemento(numeros, "lista-numeros", "mensaje-numero", "Número quitado: ");
    });

    const formMensajes = document.getElementById("form-mensajes");
    formMensajes.addEventListener("submit", e => {
        e.preventDefault();
        const input = document.getElementById("input-mensaje");
        const valor = input.value.trim();
        if(valor) {
            agregarElemento(mensajes, valor, "lista-mensajes");
            document.getElementById("mensaje-mensaje").textContent = "";
        }
        input.value = "";
    });

    document.getElementById("btn-quitar-mensaje").addEventListener("click", () => {
        quitarPrimerElemento(mensajes, "lista-mensajes", "mensaje-mensaje", "Mensaje quitado: ");
    });

    const formClientes = document.getElementById("form-clientes");
    formClientes.addEventListener("submit", e => {
        e.preventDefault();
        const input = document.getElementById("input-cliente");
        const valor = input.value.trim();
        if(valor) {
            agregarElemento(clientes, valor, "lista-clientes");
            document.getElementById("mensaje-cliente").textContent = "";
        }
        input.value = "";
    });

    document.getElementById("btn-atender-cliente").addEventListener("click", () => {
        quitarPrimerElemento(clientes, "lista-clientes", "mensaje-cliente", "Cliente atendido: ");
    });
});
