function copiarPrimerosTres() {
    const input = document.getElementById("numeros").value;
    const numeros = input.split(",").map(n => parseInt(n.trim()));
    const copia = numeros.slice(0, 3);
    mostrarResultado(copia, "resultado1");
}

function copiarParcialPeliculas() {
    const input = document.getElementById("peliculas").value;
    const peliculas = input.split(",").map(p => p.trim());
    const copia = peliculas.slice(2, 5);
    mostrarResultado(copia, "resultado2");
}

function ultimosTres() {
    const input = document.getElementById("datos").value;
    const datos = input.split(",").map(d => d.trim());
    const copia = datos.slice(-3);
    mostrarResultado(copia, "resultado3");
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
