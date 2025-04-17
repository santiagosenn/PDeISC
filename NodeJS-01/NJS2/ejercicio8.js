const url = require('url');

const direccion = 'http://localhost:3000/archivo.html?nombre=Ana&edad=20';
const datos = url.parse(direccion, true);

console.log("Host:", datos.host);
console.log("Pathname:", datos.pathname);
console.log("Search Params:", datos.query);
