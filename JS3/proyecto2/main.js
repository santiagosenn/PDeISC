// Importamos modulos nativos de Node.js necesarios para crear el servidor y manipular archivos
const http = require('http');
const fs = require('fs');
const path = require('path');
const querystring = require('querystring');

/**
Funcion que recibe un array de numeros y los clasifica en utiles y no utiles
 @param {Array} numeros 
 @returns {Object} 
 */

function filtrarNumeros(numeros) {
  const utiles = [];
  const noUtiles = [];

  numeros.forEach(num => {
    const str = num.toString(); // Convertimos el numero a string para analizar caracteres
    if (str[0] === str[str.length - 1]) { // Compara primer y ultimo caracter
      utiles.push(Number(num)); // Si coinciden, lo agregamos a utiles 
    } else {
      noUtiles.push(Number(num));
    }
  });

  // Ordenamos los numeros utiles en orden ascendente
  utiles.sort((a, b) => a - b);

  return { utiles, noUtiles };
}

// Creamos el servidor HTTP
const server = http.createServer((req, res) => {
  if (req.method === 'GET' && (req.url === '/' || req.url === '/index.html')) {
    fs.readFile('./public/index.html', (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end('Error al cargar index.html');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });

  } else if (req.method === 'GET' && req.url === '/styles.css') {
    fs.readFile('./public/styles.css', (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end();
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/css' });
      res.end(data);
    });

  // Ruta para procesar el formulario 
  } else if (req.method === 'POST' && req.url === '/procesar') {
    let body = '';
    req.on('data', chunk => (body += chunk));
    req.on('end', () => {
      const datos = querystring.parse(body);

      // Validamos que se hayan enviado numeros
      if (!datos.numeros) {
        res.writeHead(400);
        return res.end('No se recibieron números');
      }

      // Separamos la cadena de numeros usando coma, espacio o salto de linea como separadores
      const arrayNums = datos.numeros
        .split(/[\s,]+/)  
        .map(n => n.trim()) 
        .filter(n => n !== ''); 

      // Validamos que haya entre 10 y 20 numeros
      if (arrayNums.length < 10 || arrayNums.length > 20) {
        res.writeHead(400);
        return res.end('Debe ingresar entre 10 y 20 números');
      }

      // Guardamos los numeros originales en un archivo numeros.txt
      fs.writeFileSync('numeros.txt', arrayNums.join(','));

      // Aplicamos la función para filtrar los numeros utiles y no utiles
      const { utiles, noUtiles } = filtrarNumeros(arrayNums);

      // Guardamos los números útiles en resultado.txt
      fs.writeFileSync('resultado.txt', utiles.join(','));

      // Calculamos el porcentaje de numeros utiles con dos decimales
      const porcentajeUtiles = ((utiles.length / arrayNums.length) * 100).toFixed(2);

      // Preparamos la respuesta HTML para mostrar los resultados
      const html = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8" />
        <title>Resultado filtrado</title>
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body>
        <h1>Resultado del filtrado</h1>

        <div class="resultado">
          <h2>Números útiles (ordenados)</h2>
          <ul>
            ${utiles.map(n => `<li>${n}</li>`).join('')}
          </ul>

          <p><strong>Total utiles:</strong> ${utiles.length}</p>
          <p><strong>Total no utiles:</strong> ${noUtiles.length}</p>
          <p><strong>Porcentaje utiles:</strong> ${porcentajeUtiles}%</p>

          <a href="/">Volver</a>
        </div>
      </body>
      </html>
      `;

      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(html);
    });

  } else {
    
    res.writeHead(404);
    res.end('No encontrado');
  }
});

// El servidor escucha en el puerto 3000 y muestra un mensaje en consola
server.listen(3000, () => {
  console.log('Servidor escuchando en http://localhost:3000');
});
