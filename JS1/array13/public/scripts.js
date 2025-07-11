//declaro los vectores

let numeros = [];
let palabras = [];
let personas = [];

//creo la funcion para agregar numeros

function agregarNumero() {
    const input = document.getElementById("numero");
    const valor = Number(input.value);
    if (!isNaN(valor)) {
        numeros.push(valor);
        actualizarLista(numeros, "listaNumeros");
        input.value = "";
    }
}

//creo la funcion para ordenar los numeros

function ordenarNumeros() {
    const ordenado = [...numeros].sort((a, b) => a - b);
    document.getElementById("resultadoNumeros").textContent = "Ordenado: " + ordenado.join(", ");
}

//creo la funcion para agregar una palabra 

function agregarPalabra() {
    const input = document.getElementById("palabra");
    const valor = input.value.trim();
    if (valor !== "") {
        palabras.push(valor);
        actualizarLista(palabras, "listaPalabras");
        input.value = "";
    }
}

//creo la funcion para ordenar las palabras alfabeticamente

function ordenarPalabras() {
    const ordenado = [...palabras].sort();
    document.getElementById("resultadoPalabras").textContent = "Ordenado: " + ordenado.join(", ");
}

//creo la funcion para agregar a un usuario

function agregarPersona() {
    const nombre = document.getElementById("nombrePersona").value.trim();
    const edad = parseInt(document.getElementById("edadPersona").value);
    if (nombre !== "" && !isNaN(edad)) {
        personas.push({ nombre, edad });
        actualizarLista(personas.map(p => `${p.nombre} (${p.edad})`), "listaPersonas");
        document.getElementById("nombrePersona").value = "";
        document.getElementById("edadPersona").value = "";
    }
}

//creo la funcion para ordenar a los usuarios

function ordenarPersonas() {
    const ordenado = [...personas].sort((a, b) => a.edad - b.edad);
    const resultado = ordenado.map(p => `${p.nombre} (${p.edad})`);
    document.getElementById("resultadoPersonas").textContent = "Ordenado: " + resultado.join(", ");
}

function actualizarLista(array, elementId) {
    const ul = document.getElementById(elementId);
    ul.innerHTML = "";
    array.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item;
        ul.appendChild(li);
    });
}
