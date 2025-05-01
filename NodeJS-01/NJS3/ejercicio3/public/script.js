function contarHijos() {
    const contenedor = document.getElementById('contenedor');
  
    const cantidadHijos = contenedor.children.length;
  
    const resultado = document.getElementById('resultado');
    resultado.textContent = `El contenedor tiene ${cantidadHijos} hijos.`;
}
