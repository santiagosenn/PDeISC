const tiempo = require('./tiempo');
const calculo = require('./calculo');

console.log("Hora actual:", tiempo.horaActual());
console.log("5 + 3 =", calculo.sumar(5, 3));
console.log("10 - 4 =", calculo.restar(10, 4));
