let contadorNodos = 0;
let nodosGenerados = [];

function crearNodo() {
    const nodoNuevo = document.createElement('a');
    nodoNuevo.href = "https://www.google.com";
    nodoNuevo.textContent = `Enlace ${contadorNodos + 1}`;
    nodoNuevo.id = `nodo${contadorNodos}`;

    nodosGenerados.push(nodoNuevo);

    const contenedor = document.getElementById('nodosGenerados');
    contenedor.appendChild(nodoNuevo);
    contenedor.appendChild(document.createElement('br'));

    contadorNodos++;
}

function modificarAtributo() {
    const nuevoHref = prompt("Introduce la nueva URL para los enlaces:");
  
    nodosGenerados.forEach((nodo, index) => {
        const oldHref = nodo.href;
        nodo.href = nuevoHref;

        const resultado = document.getElementById('resultado');
        resultado.textContent = `Nodo ${index + 1} cambiado de ${oldHref} a ${nuevoHref}.`;
    });
}
