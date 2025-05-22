//declaro los arrays

let numeros = [];
let nombres = [];
let precios = [];

//Creo la funcion para agregar un numero al array

function agregarNumero() {
  const input = document.getElementById('numInput');
  if (input.value !== "") {
    numeros.push(Number(input.value));
    input.value = "";
    mostrarLista('listaNumeros', numeros);
  }
}

//Creo la funcion para multiplicar por tres cada elemento del array
 
function multiplicarPorTres() {
  const resultado = numeros.map(n => n * 3);
  mostrarLista('resultadoNumeros', resultado);
}

//Creo la funcion para agregar un nombre

function agregarNombre() {
  const input = document.getElementById('nombreInput');
  if (input.value.trim() !== "") {
    nombres.push(input.value.trim());
    input.value = "";
    mostrarLista('listaNombres', nombres);
  }
}

//Creo la funcion para convertir en mayuscula cada elemento del array

function nombresAMayusculas() {
  const resultado = nombres.map(n => n.toUpperCase());
  mostrarLista('resultadoNombres', resultado);
}

//creo la funcion para agregar un precio

function agregarPrecio() {
  const input = document.getElementById('precioInput');
  if (input.value !== "") {
    precios.push(Number(input.value));
    input.value = "";
    mostrarLista('listaPrecios', precios);
  }
}

//creo una funcion para agregar el IVA a los precios

function aplicarIVA() {
  const resultado = precios.map(p => (p * 1.21).toFixed(2));
  mostrarLista('resultadoPrecios', resultado);
}

function mostrarLista(id, arr) {
  const ul = document.getElementById(id);
  ul.innerHTML = "";
  arr.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    ul.appendChild(li);
  });
}
