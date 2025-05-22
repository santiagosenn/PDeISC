//dclaro los vectores

let numeros = [];
let palabras = [];
let usuarios = [];

//creo la funcion para agregar un numero

function agregarNumero() {
  const input = document.getElementById('numeroInput');
  if (input.value !== "") {
    numeros.push(Number(input.value));
    input.value = "";
    mostrarLista('listaNumeros', numeros);
  }
}

//creo la funcion para filtrar los numeros mayores a diez

function filtrarMayores() {
  const resultado = numeros.filter(n => n > 10);
  mostrarLista('resultadoNumeros', resultado);
}

//creo la funcion para agregar palabrras

function agregarPalabra() {
  const input = document.getElementById('palabraInput');
  if (input.value.trim() !== "") {
    palabras.push(input.value.trim());
    input.value = "";
    mostrarLista('listaPalabras', palabras);
  }
}

//creo la funcion para filtrar las palabras mas largas que cinco letras

function filtrarLargas() {
  const resultado = palabras.filter(p => p.length > 5);
  mostrarLista('resultadoPalabras', resultado);
}

//creo la funcion para agregar a un usuario

function agregarUsuario() {
  const nombre = document.getElementById('nombreUsuario').value.trim();
  const estado = document.getElementById('estadoUsuario').value === "true";
  if (nombre !== "") {
    usuarios.push({ nombre, activo: estado });
    document.getElementById('nombreUsuario').value = "";
    mostrarLista('listaUsuarios', usuarios.map(u => `${u.nombre} - ${u.activo ? 'Activo' : 'Inactivo'}`));
  }
}

//creo la funcion para filtrar los activos

function filtrarActivos() {
  const activos = usuarios.filter(u => u.activo);
  mostrarLista('resultadoUsuarios', activos.map(u => `${u.nombre} - Activo`));
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
