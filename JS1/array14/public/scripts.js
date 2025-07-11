//declaro los vectores

let letras = [];
let numeros = [];

//creo la funcion para agregar una letra

function agregarLetra() {
  const letra = document.getElementById("letra").value.trim();
  if (letra) {
    letras.push(letra);
    document.getElementById("letra").value = "";
    mostrarLista(letras, "listaLetras");
  }
}

//creo la funcion para agregar un numero

function agregarNumero() {
  const numero = document.getElementById("numero").value;
  if (numero !== "") {
    numeros.push(Number(numero));
    document.getElementById("numero").value = "";
    mostrarLista(numeros, "listaNumeros");
  }
}

function mostrarLista(array, elementoId) {
  const ul = document.getElementById(elementoId);
  ul.innerHTML = "";
  array.forEach((item, i) => {
    const li = document.createElement("li");
    li.textContent = `${i + 1}. ${item}`;
    ul.appendChild(li);
  });
}

//creo la funcion para invertir las letras dentro del array

function invertirLetras() {
  const resultado = [...letras].reverse();
  document.getElementById("resultadoLetras").textContent = `Invertido: ${resultado.join(", ")}`;
}

//creo la funcion para invertir los numeros dentro dell array

function invertirNumeros() {
  const resultado = [...numeros].reverse();
  document.getElementById("resultadoNumeros").textContent = `Invertido: ${resultado.join(", ")}`;
}

//creo la funcion para invertir texto

function invertirTexto() {
  const texto = document.getElementById("texto").value;
  const invertido = texto.split("").reverse().join("");
  document.getElementById("resultadoTexto").textContent = `Texto invertido: ${invertido}`;
}
