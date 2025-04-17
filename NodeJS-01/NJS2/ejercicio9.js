const upperCase = require('upper-case').upperCase;
const moment = require('moment');
const axios = require('axios');

console.log(upperCase("hola mundo"));
console.log("Fecha actual:", moment().format("DD-MM-YYYY"));

axios.get('https://api.chucknorris.io/jokes/random').then(response =>
{
    console.log("Frase:", response.data.value);
});
