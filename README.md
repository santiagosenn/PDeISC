Estructura del proyecto

```
PDeISC/
├─ Proyectos/
│  ├─ Final/
│     ├─ backend/
│        ├─ db.js                # Configuración de la base de datos
│        ├─ server.js            # Servidor principal con rutas y autenticación
│        ├─ uploads/             # Carpeta donde se guardan imágenes
│        └─ .env                 # Variables de entorno locales (no subir a GitHub)
│     ├─ frontend/
```

Requisitos

* Node.js >= 18
* MySQL o MariaDB
* npm
* Git
* Cualquier navegador para pruebas

Instalación

1. Clonar el repositorio

```
git clone https://github.com/santiagosenn/PDeISC.git
cd PDeISC/Proyectos/Final/backend
```

2. Instalar dependencias

```
npm install
```

3. Configurar variables de entorno
   Crear un archivo `.env` en la carpeta `backend/` con los siguientes valores:

```env
SESSION_SECRET=tu_session_secret_aleatorio
GOOGLE_CLIENT_ID=tu_client_id_de_google
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
FACEBOOK_APP_ID=tu_app_id_de_facebook
FACEBOOK_APP_SECRET=
FACEBOOK_CALLBACK_URL=http://localhost:3000/auth/facebook/callback
FRONTEND_URL=exp://localhost:8081
```

4. Configurar la base de datos
   Crear la base de datos y la tabla de usuarios y recetas según tu proyecto. Por ejemplo, en MySQL:

```
CREATE DATABASE pdeisc;
USE pdeisc;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    contraseña VARCHAR(255),
    google_id VARCHAR(255),
    facebook_id VARCHAR(255),
    email VARCHAR(255),
    foto_perfil VARCHAR(255),
    auth_provider ENUM('local','google','facebook'),
    es_admin TINYINT(1) DEFAULT 0
);

CREATE TABLE recetas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    ingredientes TEXT NOT NULL,
    paso_a_paso TEXT NOT NULL,
    metodo_coccion VARCHAR(255),
    tipo_corte VARCHAR(255),
    tiempo_preparacion VARCHAR(255),
    foto_url VARCHAR(255),
    aprobada TINYINT(1) DEFAULT 0,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);
```

Ejecutar el proyecto

Iniciar el servidor:

```
node server.js
```

El servidor correrá en:

```
http://localhost:3000
```

* Carpeta de uploads: `backend/uploads/`
  
* Usuario admin por defecto:

  * Usuario: `admin`
  * Contraseña: `1234`

Autenticación

Local

* Registro: `POST /registro`

  * Campos: `nombre`, `contraseña`
* Login: `POST /login`

  * Campos: `nombre`, `contraseña`

Google OAuth

* Inicio: `GET /auth/google`
* Callback: `GET /auth/google/callback`

Facebook OAuth

* Inicio: `GET /auth/facebook`

* Callback: `GET /auth/facebook/callback`

* Logout: `GET /logout`

Endpoints principales

Recetas

* `POST /recetas` → Crear nueva receta
* `GET /recetas` → Obtener recetas aprobadas
* `GET /recetas/pendientes` → Obtener recetas pendientes (solo admin)
* `GET /recetas/:id` → Obtener receta específica
* `GET /recetas/usuario/:usuarioId` → Obtener recetas de un usuario
* `PUT /recetas/:id` → Actualizar receta (propietario)
* `DELETE /recetas/:id` → Eliminar receta (propietario o admin)

Administración (solo admin)

* `GET /admin/recetas` → Obtener todas las recetas
* `PUT /admin/recetas/:id/aprobar` → Aprobar o rechazar receta
* `DELETE /admin/recetas/:id` → Eliminar receta

Imágenes

* `POST /uploads` → Subir imagen en base64

  * Campos: `imagen` (base64), `extension` (jpg, png, gif, webp)

Usuarios

* `GET /usuarios/:id` → Obtener usuario por ID
* `GET /usuarios/nombre/:nombre` → Obtener usuario por nombre


Funcionalidades técnicas

* Express como framework principal
* Passport.js para autenticación social y local
* MySQL como base de datos
* dotenv para cargar variables de entorno
* body-parser para parsear JSON y formularios grandes
* cors para permitir peticiones desde frontend
* express-session para manejo de sesiones
* uploads permite almacenar imágenes en servidor
* Rutas protegidas con permisos de usuario y admin
* Manejo de errores y logs detallados en consola
* Creación dinámica de usuarios social login
* Validaciones de campos obligatorios y formatos de imagen

