function mostrarDatos(event) {
    event.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const genero = document.querySelector('input[name="genero"]:checked')?.value;
    const correo = document.getElementById('correo').value;
    const edad = document.getElementById('edad').value;
    const aficiones = [];
    document.querySelectorAll('input[name="aficiones"]:checked').forEach((checkbox) => {
        aficiones.push(checkbox.value);
  });
    const pais = document.getElementById('pais').value;

    const resultado = `
        <h1>Datos del Registro</h1>
        <p><strong>Nombre:</strong> ${nombre}</p>
        <p><strong>Género:</strong> ${genero}</p>
        <p><strong>Correo Electrónico:</strong> ${correo}</p>
        <p><strong>Edad:</strong> ${edad}</p>
        <p><strong>Aficiones:</strong> ${aficiones.length > 0 ? aficiones.join(', ') : 'Ninguna'}</p>
        <p><strong>País:</strong> ${pais}</p>
    `;
    document.getElementById('resultado').innerHTML = resultado;
}
