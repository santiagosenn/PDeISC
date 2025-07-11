//declaro los vectores

let nombres = [];
let numeros = [];
let objetos = [];

//creo la funcion para agarrrar un vector y crear una lista

function agregarNombre() {
  const input = document.getElementById('nombreInput');
  if (input.value.trim() !== "") {
    nombres.push(input.value.trim());
    input.value = "";
    mostrarLista('listaNombres', nombres);
  }
}

//creo la funcion para saludar a cada uno de los elementos

function saludarNombres() {
  const salida = document.getElementById('resultadoNombres');
  salida.innerHTML = "";
  nombres.forEach(nombre => {
    const li = document.createElement("li");
    li.textContent = `Hola, ${nombre}!`;
    salida.appendChild(li);
  });
}

//creo la funcion para agregar un numero

function agregarNumero() {
  const input = document.getElementById('numeroInput');
  if (input.value !== "") {
    numeros.push(Number(input.value));
    input.value = "";
    mostrarLista('listaNumeros', numeros);
  }
}

//creo la funcion para multiplicar por dos cada elemento

function doblarNumeros() {
  const salida = document.getElementById('resultadoNumeros');
  salida.innerHTML = "";
  numeros.forEach(n => {
    const li = document.createElement("li");
    li.textContent = n * 2;
    salida.appendChild(li);
  });
}

//creo la funcion para agregar y mostrar un elemento

function agregarObjeto() {
  const nombre = document.getElementById('objNombre').value.trim();
  const edad = document.getElementById('objEdad').value.trim();
  if (nombre && edad) {
    objetos.push({ nombre, edad: Number(edad) });
    document.getElementById('objNombre').value = "";
    document.getElementById('objEdad').value = "";
    mostrarObjetosLista();
  }
}

function mostrarObjetos() {
  const salida = document.getElementById('resultadoObjetos');
  salida.innerHTML = "";
  objetos.forEach(obj => {
    const li = document.createElement("li");
    li.textContent = `${obj.nombre} tiene ${obj.edad} años.`;
    salida.appendChild(li);
  });
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

function mostrarObjetosLista() {
  const ul = document.getElementById('listaObjetos');
  ul.innerHTML = "";
  objetos.forEach(obj => {
    const li = document.createElement("li");
    li.textContent = `${obj.nombre} (${obj.edad})`;
    ul.appendChild(li);
  });
}
