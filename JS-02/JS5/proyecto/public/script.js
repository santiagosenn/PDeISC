// Importa la clase CZooAnimal desde la ruta publica que sirve el servidor Express
import { CZooAnimal } from '/js-outside/CZooAnimal.js';

// Array donde se almacenan los animales creados
const animales = [];

// Referencias a elementos del DOM
const form = document.getElementById('animalForm');      
const resultadosDiv = document.getElementById('resultados');  
const tablaDiv = document.getElementById('tabla');            

// Escucha el evento submit del formulario
form.addEventListener('submit', (e) => {
  e.preventDefault(); 

  // Obtiene los valores ingresados en el formulario y los convierte al tipo adecuado
  const id = parseInt(document.getElementById('idAnimal').value);
  const nombre = document.getElementById('nombre').value.trim();
  const jaula = parseInt(document.getElementById('jaula').value);
  const tipo = parseInt(document.getElementById('tipo').value);
  const peso = parseFloat(document.getElementById('peso').value);

  if (!id || !nombre || !jaula || !tipo || !peso) {
    alert('Por favor, completa todos los campos correctamente.');
    return;
  }

  // Creo un nuevo objeto CZooAnimal con los datos ingresados
  const nuevoAnimal = new CZooAnimal(id, nombre, jaula, tipo, peso);

  // Agrego el nuevo animal al array de animales
  animales.push(nuevoAnimal);

  // Limpio el formulario y pone el foco en el primer campo para ingresar otro animal facilmente
  form.reset();
  form.idAnimal.focus();

  // Actualiza la visualizacion de resultados y tabla en la pagina
  actualizarResultados();
  actualizarTabla();
});

// Funcion que actualiza el contenido HTML del div de resultados con la info solicitada
function actualizarResultados() {
  const jaula5Menor3kg = animales.filter(a => a.JaulaNumero === 5 && a.peso < 3).length;

  const felinosEntre2y5 = animales.filter(
    a => a.IdTypeAnimal === 1 && a.JaulaNumero >= 2 && a.JaulaNumero <= 5
  ).length;

  const animalJaula4 = animales.find(a => a.JaulaNumero === 4 && a.peso < 120);
  const nombreJaula4 = animalJaula4 ? animalJaula4.nombre : 'No encontrado';

  resultadosDiv.innerHTML = `
    <p><strong>Cantidad de animales en jaula 5 con peso menor a 3kg:</strong> ${jaula5Menor3kg}</p>
    <p><strong>Cantidad de felinos en jaulas 2 a 5:</strong> ${felinosEntre2y5}</p>
    <p><strong>Nombre del animal en jaula 4 con peso menor a 120:</strong> ${nombreJaula4}</p>
  `;
}

// Funcion que actualiza la tabla HTML con todos los animales agregados
function actualizarTabla() {
  if (animales.length === 0) {
    tablaDiv.innerHTML = '<p>No hay animales cargados aún.</p>';
    return;
  }

  // Construyo el encabezado de la tabla con columnas
  let tablaHTML = `<table>
    <thead>
      <tr>
        <th>ID</th><th>Nombre</th><th>Jaula</th><th>Tipo</th><th>Peso (kg)</th>
      </tr>
    </thead>
    <tbody>`;

  for (const animal of animales) {
    tablaHTML += `<tr>
      <td>${animal.IdAnimal}</td>
      <td>${animal.nombre}</td>
      <td>${animal.JaulaNumero}</td>
      <td>${tipoTexto(animal.IdTypeAnimal)}</td>
      <td>${animal.peso.toFixed(2)}</td>
    </tr>`;
  }

  tablaHTML += '</tbody></table>';

  tablaDiv.innerHTML = tablaHTML;
}

// Funcion auxiliar que convierte el id del tipo de animal en texto legible
function tipoTexto(idTipo) {
  switch(idTipo) {
    case 1: return 'Felino';
    case 2: return 'Ave';
    case 3: return 'Reptil';
    default: return 'Desconocido';
  }
}
