// Obtenemos los elementos del DOM necesarios
const form = document.getElementById('formNumeros'); 
const input = document.getElementById('numero');
const lista = document.getElementById('listaNumeros');
const guardarBtn = document.getElementById('guardarBtn');

// Arreglo donde se guardaran los numeros ingresados
let numeros = [];

// Evento cuando se envia el formulario
form.addEventListener('submit', (e) => {
    e.preventDefault(); 
    const num = parseInt(input.value); 
    if (isNaN(num)) return; 
    
    // Verificamos que no se hayan superado los 20 numeros
    if (numeros.length < 20) {
      numeros.push(num); // Agregamos el numero al array
      mostrarNumeros(); // Actualizamos la lista en pantalla

      // Si ya hay 10 numeros, habilitamos el boton de guardar
      if (numeros.length >= 10) {
        guardarBtn.disabled = false;
      }
    }

    input.value = ''; 
});

// Evento para guardar los numeros en el archivo
guardarBtn.addEventListener('click', () => {
    fetch('/guardar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ numeros }) 
    })
    .then(res => res.text()) 
    .then(msg => {
      alert(msg); 
    });
  });

  // Funcion para mostrar los numeros ingresados dentro del div
  function mostrarNumeros() {
      lista.innerHTML = '<h3>Números ingresados:</h3><ul>' +
        numeros.map(n => `<li>${n}</li>`).join('') + // Mostramos cada numero como item de lista
        '</ul>';
}
