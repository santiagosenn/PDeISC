const mysql = require('mysql2');

// Configuración de conexión
const connection = mysql.createConnection({
host: 'localhost',
user: 'root',          // o el usuario que tengas configurado
password: '',          // tu contraseña de MySQL si tenés
database: 'login_db'   // la base de datos creada antes
});

// Probar conexión
connection.connect(err => {
if (err) {
console.error('Error al conectar con la base de datos:', err);
} else {
console.log('Conectado a la base de datos MySQL');
}
});

module.exports = connection;
