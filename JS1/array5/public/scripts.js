let letras = [];

//creo el vector para las letras

function actualizarLista(array, listaID) {
    const ul = document.getElementById(listaID);
    ul.innerHTML = "";
    array.forEach(letra => {
        const li = document.createElement("li");
        li.textContent = letra;
        ul.appendChild(li);
    });
}

//Creo la funcion para agarrar el vector y actualizarlo en la lista

function agregarLetra(letra) {
    letras.push(letra);
    actualizarLista(letras, "lista-letras");
}

//creo la funcion para ingresar la nueva letra en el vector

document.addEventListener("DOMContentLoaded", () => {
    actualizarLista(letras, "lista-letras");

    const form = document.getElementById("form-letras");
    form.addEventListener("submit", e => {
        e.preventDefault();
        const input = document.getElementById("input-letra");
        const valor = input.value.trim();
        if (valor && valor.length === 1) {
            agregarLetra(valor);
        }
        input.value = "";
    });

    document.getElementById("btn-eliminar").addEventListener("click", () => {
        letras.splice(1, 2);
        actualizarLista(letras, "lista-letras");
    });

    document.getElementById("btn-insertar").addEventListener("click", () => {
        letras.splice(1, 0, "Nombre");
        actualizarLista(letras, "lista-letras");
    });

    document.getElementById("btn-reemplazar").addEventListener("click", () => {
        letras.splice(2, 2, "X", "Y");
        actualizarLista(letras, "lista-letras");
    });
});

//le doy funcionalidad a cada uno de los botones
