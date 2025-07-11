//declaro los arrays

const suma = [];
const multiplicar = [];
const precios = [];

function actualizarLista(array, ulId) {
    const ul = document.getElementById(ulId);
    ul.innerHTML = "";
    array.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item;
        ul.appendChild(li);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    //Hago que el usuario peuda sumar los elementos dentro del array
    document.getElementById("form-suma").addEventListener("submit", e => {
        e.preventDefault();
        const input = document.getElementById("input-suma");
        const valor = parseFloat(input.value);
        if (!isNaN(valor)) {
            suma.push(valor);
            actualizarLista(suma, "lista-suma");
        }
        input.value = "";
    });

    document.getElementById("btn-sumar").addEventListener("click", () => {
        const resultado = suma.reduce((acc, val) => acc + val, 0);
        document.getElementById("resultado-suma").textContent = `Resultado: ${resultado}`;
    });

    //Hago que el usuario peuda multiplicar los elementos dentro del array
    document.getElementById("form-multiplicar").addEventListener("submit", e => {
        e.preventDefault();
        const input = document.getElementById("input-multiplicar");
        const valor = parseFloat(input.value);
        if (!isNaN(valor)) {
            multiplicar.push(valor);
            actualizarLista(multiplicar, "lista-multiplicar");
        }
        input.value = "";
    });

    document.getElementById("btn-multiplicar").addEventListener("click", () => {
        const resultado = multiplicar.reduce((acc, val) => acc * val, 1);
        document.getElementById("resultado-multiplicar").textContent = `Resultado: ${resultado}`;
    });

    // hago que el usuario pueda agregar precios
    document.getElementById("form-precios").addEventListener("submit", e => {
        e.preventDefault();
        const input = document.getElementById("input-precios");
        const valor = parseFloat(input.value);
        if (!isNaN(valor)) {
            precios.push(valor);
            actualizarLista(precios, "lista-precios");
        }
        input.value = "";
    });

    document.getElementById("btn-total-precios").addEventListener("click", () => {
        const resultado = precios.reduce((acc, val) => acc + val, 0);
        document.getElementById("resultado-precios").textContent = `Total: $${resultado.toFixed(2)}`;
    });
});
