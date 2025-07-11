//creo la funcion para ver si cierta palabra esta dentro del vector

function buscarPalabra() {
    const palabras = document.getElementById("palabras").value.split(",").map(p => p.trim().toLowerCase());
    const palabraBuscar = document.getElementById("palabraBuscar").value.trim().toLowerCase();
    const existe = palabras.includes(palabraBuscar);
    const resultado = existe ? `Sí, la palabra "${palabraBuscar}" está en el array.` : `No, la palabra "${palabraBuscar}" no está.`;
    mostrarResultado([resultado], "resultado1");
}

//Creo la funcion para buscar si esta un color en especifico

function buscarColor() {
    const colores = document.getElementById("colores").value.split(",").map(c => c.trim().toLowerCase());
    const colorBuscar = document.getElementById("colorBuscar").value.trim().toLowerCase();
    const existe = colores.includes(colorBuscar);
    const resultado = existe ? `Sí, el color "${colorBuscar}" está presente.` : `No, el color "${colorBuscar}" no está.`;
    mostrarResultado([resultado], "resultado2");
}

//Creo la funcion para verificar cierto numero y sumarlo

function verificarYAgregar() {
    const numeros = document.getElementById("numeros").value.split(",").map(n => parseInt(n.trim()));
    const numeroNuevo = parseInt(document.getElementById("numeroNuevo").value.trim());

    const resultado = [];
    if (numeros.includes(numeroNuevo)) {
        resultado.push(`El número ${numeroNuevo} ya está en el array.`);
    } else {
        numeros.push(numeroNuevo);
        resultado.push(`El número ${numeroNuevo} fue agregado. Nuevo array: ${numeros.join(", ")}`);
    }

    mostrarResultado(resultado, "resultado3");
}

function mostrarResultado(array, id) {
    const ul = document.getElementById(id);
    ul.innerHTML = "";
    array.forEach(e => {
        const li = document.createElement("li");
        li.textContent = e;
        ul.appendChild(li);
    });
}
