function agregarParrafo() {
    const contenedor = document.getElementById('contenedor');
    contenedor.innerHTML += '<p>nao.</p>';
}

function agregarImagen() {
    const contenedor = document.getElementById('contenedor');
    contenedor.innerHTML += '<img src="img/perro.jpg" alt="Imagen de perro" style="width:150px" />';
}

function agregarLista() {
    const contenedor = document.getElementById('contenedor');
    contenedor.innerHTML += '<ul><li>Elemento 1</li><li>Elemento 2</li><li>Elemento 3</li></ul>';
}

function agregarEnlace() {
    const contenedor = document.getElementById('contenedor');
    contenedor.innerHTML += '<a href="https://www.google.com" target="_blank">Ir a Google</a>';
}

function agregarTabla() {
    const contenedor = document.getElementById('contenedor');
    contenedor.innerHTML += `
        <table border="1">
            <tr>
                <th>Nombre</th>
                <th>Edad</th>
            </tr>
            <tr>
                <td>Santi</td>
                <td>19</td>
            </tr>
            <tr>
                <td>Catalina</td>
                <td>20</td>
            </tr>
        </table>
    `;
}

