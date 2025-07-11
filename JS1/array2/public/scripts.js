//declaro los vectores

let animales = [];
let productos = [];

//creo una funcion para que reciba un vector y actualice la lista

function actualizarLista(array, listaID) {
    const ul = document.getElementById(listaID);
    ul.innerHTML = "";
    array.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item;
        ul.appendChild(li);
    });
} 

//creo la funcion para eliminar el ultimo elemento

function eliminarUltimo(array, listaID, mensajeID, nombreElemento) {
    const mensaje = document.getElementById(mensajeID);
    if (array.length === 0) {
        mensaje.textContent = `No hay ${nombreElemento}s para eliminar.`;
        return;
    }
    const eliminado = array.pop();
    actualizarLista(array, listaID);
    mensaje.textContent = `${nombreElemento.charAt(0).toUpperCase() + nombreElemento.slice(1)} eliminado: ${eliminado}`;
}

document.addEventListener("DOMContentLoaded", () => {
    actualizarLista(animales, "lista-animales");
    actualizarLista(productos, "lista-productos");

    const formAnimales = document.getElementById("form-animales");
    formAnimales.addEventListener("submit", e => {
        e.preventDefault();
        const input = document.getElementById("input-animal");
        const valor = input.value.trim();
        if (valor) {
            animales.push(valor);
            actualizarLista(animales, "lista-animales");
            document.getElementById("mensaje-pop-animal").textContent = "";
        }
        input.value = "";
    });

    const formProductos = document.getElementById("form-productos");
    formProductos.addEventListener("submit", e => {
        e.preventDefault();
        const input = document.getElementById("input-producto");
        const valor = input.value.trim();
        if (valor) {
            productos.push(valor);
            actualizarLista(productos, "lista-productos");
            document.getElementById("mensaje-pop-producto").textContent = "";
        }
        input.value = "";
    });
    
    //Le dio la funcion a los botones para eliminar los elementos

    document.getElementById("btn-pop-animal").addEventListener("click", () => {
        eliminarUltimo(animales, "lista-animales", "mensaje-pop-animal", "animal");
    });

    document.getElementById("btn-pop-producto").addEventListener("click", () => {
        eliminarUltimo(productos, "lista-productos", "mensaje-pop-producto", "producto");
    });
});
