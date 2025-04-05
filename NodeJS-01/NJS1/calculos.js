
function suma(a, b)
{
    suma = a + b;
    return suma;
}

function resta(a, b)
{
    resta = a - b;
    return resta;
}

function multiplicacion(a, b)
{
    multiplicacion = a * b;
    return multiplicacion;
}

function division(a, b)
{
    division = a / b;
    return division;
}

//creo una funcion para cada calculo

module.exports = {
    suma,
    resta,
    multiplicacion,
    division
};

//exporto el modulo de calculos