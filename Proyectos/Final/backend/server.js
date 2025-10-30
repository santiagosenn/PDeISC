require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const db = require('./db');

const app = express();
const PORT = 3000;

// Crear carpeta para imágenes si no existe
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

app.use(cors({
  origin: true,
  credentials: true
}));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Configurar sesión (necesaria para Passport)
app.use(session({
  secret: process.env.SESSION_SECRET || 'tu_session_secret_aleatorio_aqui',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false, // Cambiar a true en producción con HTTPS
    maxAge: 24 * 60 * 60 * 1000 // 24 horas
  }
}));

// Inicializar Passport
app.use(passport.initialize());
app.use(passport.session());

// Serializar usuario
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserializar usuario
passport.deserializeUser((id, done) => {
  db.query('SELECT * FROM usuarios WHERE id = ?', [id], (err, results) => {
    if (err) return done(err);
    done(null, results[0]);
  });
});

// ========== ESTRATEGIA GOOGLE ==========
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/auth/google/callback'
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log('🔍 Buscando usuario con Google ID:', profile.id);

        // Buscar usuario existente por Google ID
        db.query('SELECT * FROM usuarios WHERE google_id = ?', [profile.id], (err, results) => {
          if (err) return done(err);

          if (results.length > 0) {
            // Usuario existe
            console.log('✅ Usuario encontrado:', results[0].nombre);
            return done(null, results[0]);
          }

          // Crear nuevo usuario
          const nuevoUsuario = {
            nombre: profile.displayName.replace(/\s+/g, '_').toLowerCase() + '_' + Date.now(),
            google_id: profile.id,
            email: profile.emails && profile.emails[0] ? profile.emails[0].value : null,
            foto_perfil: profile.photos && profile.photos[0] ? profile.photos[0].value : null,
            auth_provider: 'google',
            contraseña: null,
            es_admin: 0
          };

          const insertQuery = 'INSERT INTO usuarios (nombre, google_id, email, foto_perfil, auth_provider, contraseña, es_admin) VALUES (?, ?, ?, ?, ?, NULL, 0)';

          db.query(insertQuery, [
            nuevoUsuario.nombre,
            nuevoUsuario.google_id,
            nuevoUsuario.email,
            nuevoUsuario.foto_perfil,
            nuevoUsuario.auth_provider
          ], (err, result) => {
            if (err) {
              console.error('❌ Error al crear usuario con Google:', err);
              return done(err);
            }

            nuevoUsuario.id = result.insertId;
            console.log('✅ Nuevo usuario creado con Google:', nuevoUsuario.nombre);
            return done(null, nuevoUsuario);
          });
        });
      } catch (error) {
        console.error('❌ Error en estrategia de Google:', error);
        return done(error);
      }
    }
  ));
  console.log('✅ Google OAuth configurado');
} else {
  console.log('⚠️ Google OAuth no configurado - faltan credenciales en .env');
}

// ========== ESTRATEGIA FACEBOOK ==========
if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
  passport.use(new FacebookStrategy({
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL || 'http://localhost:3000/auth/facebook/callback',
      profileFields: ['id', 'displayName', 'photos', 'email']
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log('🔍 Buscando usuario con Facebook ID:', profile.id);

        // Buscar usuario existente por Facebook ID
        db.query('SELECT * FROM usuarios WHERE facebook_id = ?', [profile.id], (err, results) => {
          if (err) return done(err);

          if (results.length > 0) {
            // Usuario existe
            console.log('✅ Usuario encontrado:', results[0].nombre);
            return done(null, results[0]);
          }

          // Crear nuevo usuario
          const nuevoUsuario = {
            nombre: profile.displayName.replace(/\s+/g, '_').toLowerCase() + '_' + Date.now(),
            facebook_id: profile.id,
            email: profile.emails && profile.emails[0] ? profile.emails[0].value : null,
            foto_perfil: profile.photos && profile.photos[0] ? profile.photos[0].value : null,
            auth_provider: 'facebook',
            contraseña: null,
            es_admin: 0
          };

          const insertQuery = 'INSERT INTO usuarios (nombre, facebook_id, email, foto_perfil, auth_provider, contraseña, es_admin) VALUES (?, ?, ?, ?, ?, NULL, 0)';

          db.query(insertQuery, [
            nuevoUsuario.nombre,
            nuevoUsuario.facebook_id,
            nuevoUsuario.email,
            nuevoUsuario.foto_perfil,
            nuevoUsuario.auth_provider
          ], (err, result) => {
            if (err) {
              console.error('❌ Error al crear usuario con Facebook:', err);
              return done(err);
            }

            nuevoUsuario.id = result.insertId;
            console.log('✅ Nuevo usuario creado con Facebook:', nuevoUsuario.nombre);
            return done(null, nuevoUsuario);
          });
        });
      } catch (error) {
        console.error('❌ Error en estrategia de Facebook:', error);
        return done(error);
      }
    }
  ));
  console.log('✅ Facebook OAuth configurado');
} else {
  console.log('⚠️ Facebook OAuth no configurado - faltan credenciales en .env');
}

// Servir archivos estáticos de la carpeta uploads
app.use('/uploads', express.static('uploads'));

// ========== RUTAS DE AUTENTICACIÓN SOCIAL ==========

// Google - Iniciar autenticación
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google - Callback
app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/failure' }),
  (req, res) => {
    const user = {
      id: req.user.id,
      nombre: req.user.nombre,
      email: req.user.email,
      foto_perfil: req.user.foto_perfil,
      isAdmin: req.user.es_admin === 1
    };
    
    const frontendUrl = process.env.FRONTEND_URL || 'exp://localhost:8081';
    const userData = encodeURIComponent(JSON.stringify(user));
    res.redirect(`${frontendUrl}/--/auth-callback?user=${userData}`);
  }
);

// Facebook - Iniciar autenticación
app.get('/auth/facebook',
  passport.authenticate('facebook', { scope: ['email'] })
);

// Facebook - Callback
app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/auth/failure' }),
  (req, res) => {
    const user = {
      id: req.user.id,
      nombre: req.user.nombre,
      email: req.user.email,
      foto_perfil: req.user.foto_perfil,
      isAdmin: req.user.es_admin === 1
    };
    
    const frontendUrl = process.env.FRONTEND_URL || 'exp://localhost:8081';
    const userData = encodeURIComponent(JSON.stringify(user));
    res.redirect(`${frontendUrl}/--/auth-callback?user=${userData}`);
  }
);

// Ruta de fallo
app.get('/auth/failure', (req, res) => {
  res.status(401).json({ error: 'Autenticación fallida' });
});

// Cerrar sesión
app.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Error al cerrar sesión' });
    }
    res.json({ success: true, message: 'Sesión cerrada' });
  });
});

// ========== RUTAS ORIGINALES ==========

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ mensaje: '🥩 API de Recetas de Carne funcionando ✅' });
});

// Endpoint para subir imagen (BASE64)
app.post('/uploads', (req, res) => {
  try {
    const { imagen, extension } = req.body;

    if (!imagen) {
      return res.status(400).json({ error: 'No se recibió ninguna imagen' });
    }

    if (!imagen.startsWith('data:image/')) {
      return res.status(400).json({ error: 'Formato de imagen inválido' });
    }

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const safeExtension = (extension || 'jpg').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    const finalExtension = allowedExtensions.includes(safeExtension) ? safeExtension : 'jpg';

    const filename = `receta-${uniqueSuffix}.${finalExtension}`;
    const filepath = path.join(uploadsDir, filename);

    const base64Data = imagen.replace(/^data:image\/\w+;base64,/, '');
    if (!base64Data || base64Data.length === 0) {
      return res.status(400).json({ error: 'Datos de imagen base64 inválidos' });
    }

    let buffer;
    try {
      buffer = Buffer.from(base64Data, 'base64');
    } catch (bufferError) {
      console.error('❌ Error al decodificar base64:', bufferError);
      return res.status(400).json({ error: 'Error al decodificar imagen base64' });
    }

    if (buffer.length === 0) {
      return res.status(400).json({ error: 'Imagen vacía o corrupta' });
    }

    try {
      fs.writeFileSync(filepath, buffer);
    } catch (writeError) {
      console.error('❌ Error al escribir archivo:', writeError);
      return res.status(500).json({ error: 'Error al guardar imagen en el servidor' });
    }

    const imageUrl = `http://127.0.0.1:${PORT}/uploads/${filename}`;
    console.log('✅ Imagen subida exitosamente:', imageUrl);

    res.json({
      success: true,
      url: imageUrl,
      filename: filename,
      size: buffer.length
    });
  } catch (error) {
    console.error('❌ Error general al subir imagen:', error);
    res.status(500).json({ error: 'Error interno del servidor: ' + error.message });
  }
});

// Endpoint de REGISTRO
app.post('/registro', (req, res) => {
  const { nombre, contraseña } = req.body;

  console.log('📝 Intento de registro:', { nombre });

  if (!nombre || !contraseña) {
    return res.status(400).json({ error: 'Faltan datos' });
  }

  if (contraseña.length < 4) {
    return res.status(400).json({ error: 'La contraseña debe tener al menos 4 caracteres' });
  }

  const checkQuery = 'SELECT * FROM usuarios WHERE nombre = ?';
  db.query(checkQuery, [nombre], (err, results) => {
    if (err) {
      console.error('❌ Error al verificar usuario:', err);
      return res.status(500).json({ error: 'Error en el servidor' });
    }

    if (results.length > 0) {
      return res.status(400).json({ error: 'El usuario ya existe' });
    }

    const insertQuery = 'INSERT INTO usuarios (nombre, contraseña, es_admin, auth_provider) VALUES (?, ?, 0, "local")';
    db.query(insertQuery, [nombre, contraseña], (err, result) => {
      if (err) {
        console.error('❌ Error al registrar usuario:', err);
        return res.status(500).json({ error: 'Error al registrar usuario' });
      }

      console.log('✅ Usuario registrado exitosamente:', nombre);
      res.json({
        success: true,
        message: 'Usuario registrado exitosamente',
        userId: result.insertId
      });
    });
  });
});

// Ruta de LOGIN
app.post('/login', (req, res) => {
  const { nombre, contraseña } = req.body;

  console.log('🔐 Intento de login:', { nombre });

  if (!nombre || !contraseña) {
    return res.status(400).json({ error: 'Faltan datos' });
  }

  // Login como ADMIN fijo
  if (nombre === 'admin' && contraseña === '1234') {
    console.log('✅ Login de ADMIN exitoso');
    return res.json({
      success: true,
      user: {
        id: 0,
        nombre: 'admin',
        isAdmin: true
      }
    });
  }

  const query = 'SELECT * FROM usuarios WHERE nombre = ? AND contraseña = ?';
  db.query(query, [nombre, contraseña], (err, results) => {
    if (err) {
      console.error('❌ Error al ejecutar la consulta:', err);
      return res.status(500).json({ error: 'Error en el servidor' });
    }

    if (results.length === 0) {
      console.log('❌ Usuario no encontrado o contraseña incorrecta');
      return res.json({ success: false, message: 'Usuario o contraseña incorrectos' });
    }

    const user = results[0];
    console.log('✅ Login exitoso:', nombre);
    res.json({
      success: true,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        foto_perfil: user.foto_perfil,
        isAdmin: user.es_admin === 1
      }
    });
  });
});

//Endpoint para obtener un usuario por su ID
app.get('/usuarios/:id', (req, res) => {
  const { id } = req.params;

  const query = 'SELECT id, nombre, es_admin FROM usuarios WHERE id = ?';
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('❌ Error al obtener usuario:', err);
      return res.status(500).json({ error: 'Error al obtener usuario' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ success: true, usuario: results[0] });
  });
});

//Endpoint para obtener usuario por nombre
app.get('/usuarios/nombre/:nombre', (req, res) => {
  const { nombre } = req.params;

  const query = 'SELECT id, nombre, es_admin FROM usuarios WHERE nombre = ?';
  db.query(query, [nombre], (err, results) => {
    if (err) {
      console.error('❌ Error al obtener usuario por nombre:', err);
      return res.status(500).json({ error: 'Error al obtener usuario' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ success: true, usuario: results[0] });
  });
});

// ============= RUTAS DE RECETAS =============

// Endpoint para crear una nueva receta
app.post('/recetas', (req, res) => {
  const {
    usuario_id,
    nombre,
    descripcion,
    ingredientes,
    paso_a_paso,
    metodo_coccion,
    tipo_corte,
    tiempo_preparacion,
    foto_url
  } = req.body;

  console.log('📝 Creando nueva receta:', { nombre, usuario_id });

  if (!usuario_id || !nombre || !ingredientes || !paso_a_paso) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  const query = `
    INSERT INTO recetas 
    (usuario_id, nombre, descripcion, ingredientes, paso_a_paso, metodo_coccion, tipo_corte, tiempo_preparacion, foto_url, aprobada) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
  `;

  db.query(
    query,
    [usuario_id, nombre, descripcion, ingredientes, paso_a_paso, metodo_coccion, tipo_corte, tiempo_preparacion, foto_url],
    (err, result) => {
      if (err) {
        console.error('❌ Error al crear receta:', err);
        return res.status(500).json({ error: 'Error al crear receta' });
      }

      console.log('✅ Receta creada exitosamente (pendiente de aprobación), ID:', result.insertId);
      res.json({
        success: true,
        message: 'Receta creada exitosamente. Estará visible una vez que sea aprobada.',
        recetaId: result.insertId
      });
    }
  );
});

//Endpoint para obtener TODAS las recetas
app.get('/recetas', (req, res) => {
  const { mostrarTodas } = req.query;

  let query = `
    SELECT r.*, u.nombre as usuario_nombre
    FROM recetas r
    JOIN usuarios u ON r.usuario_id = u.id
  `;

  if (mostrarTodas !== 'true') {
    query += ' WHERE r.aprobada = 1 ';
  }

  query += ' ORDER BY r.fecha_creacion DESC';

  db.query(query, (err, results) => {
    if (err) {
      console.error('❌ Error al obtener recetas:', err);
      return res.status(500).json({ error: 'Error al obtener recetas' });
    }
    res.json({ success: true, recetas: results });
  });
});

//Endpoint de obtener recetas pendientes de aprobación
app.get('/recetas/pendientes', (req, res) => {
  const query = `
    SELECT r.*, u.nombre as usuario_nombre
    FROM recetas r
    JOIN usuarios u ON r.usuario_id = u.id
    WHERE r.aprobada = 0
    ORDER BY r.fecha_creacion DESC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('❌ Error al obtener recetas pendientes:', err);
      return res.status(500).json({ error: 'Error al obtener recetas pendientes' });
    }
    res.json({ success: true, recetas: results });
  });
});

//Endpoint de aprobar/Rechazar una receta
app.put('/recetas/:id/aprobar', (req, res) => {
  const { id } = req.params;
  const { aprobada } = req.body;

  console.log(`${aprobada ? '✅ Aprobando' : '❌ Rechazando'} receta:`, id);

  const query = 'UPDATE recetas SET aprobada = ? WHERE id = ?';

  db.query(query, [aprobada ? 1 : 0, id], (err, result) => {
    if (err) {
      console.error('❌ Error al actualizar estado de receta:', err);
      return res.status(500).json({ error: 'Error al actualizar receta' });
    }

    console.log(`✅ Receta ${aprobada ? 'aprobada' : 'rechazada'} exitosamente`);
    res.json({ success: true, message: `Receta ${aprobada ? 'aprobada' : 'rechazada'} exitosamente` });
  });
});

// Endpoints de RUTAS ADMIN
app.get('/admin/recetas', (req, res) => {
  const { usuario_id } = req.query;
  
  console.log('🔍 Admin obteniendo recetas, usuario_id:', usuario_id);

  if (usuario_id === '0') {
    const query = `
      SELECT r.*, u.nombre as usuario_nombre
      FROM recetas r
      JOIN usuarios u ON r.usuario_id = u.id
      ORDER BY r.fecha_creacion DESC
    `;

    db.query(query, (err, results) => {
      if (err) {
        console.error('❌ Error al obtener todas las recetas (admin):', err);
        return res.status(500).json({ error: 'Error al obtener recetas' });
      }
      
      console.log(`✅ Admin obtuvo ${results.length} recetas`);
      res.json({ success: true, recetas: results });
    });
  } else {
    const query = `
      SELECT r.*, u.nombre as usuario_nombre
      FROM recetas r
      JOIN usuarios u ON r.usuario_id = u.id
      WHERE r.usuario_id = ?
      ORDER BY r.fecha_creacion DESC
    `;

    db.query(query, [usuario_id], (err, results) => {
      if (err) {
        console.error('❌ Error al obtener recetas del usuario:', err);
        return res.status(500).json({ error: 'Error al obtener recetas' });
      }
      res.json({ success: true, recetas: results });
    });
  }
});

app.put('/admin/recetas/:id/aprobar', (req, res) => {
  const { id } = req.params;
  const { usuario_id, aprobar } = req.body;

  console.log(`${aprobar ? '✅ Admin aprobando' : '❌ Admin rechazando'} receta:`, id);

  if (usuario_id !== 0 && usuario_id !== '0') {
    return res.status(403).json({ error: 'No tienes permisos de administrador' });
  }

  if (aprobar) {
    const query = 'UPDATE recetas SET aprobada = 1 WHERE id = ?';
    db.query(query, [id], (err, result) => {
      if (err) {
        console.error('❌ Error al aprobar receta:', err);
        return res.status(500).json({ error: 'Error al aprobar receta' });
      }
      console.log('✅ Receta aprobada por admin');
      res.json({ success: true, message: 'Receta aprobada exitosamente' });
    });
  } else {
    const deleteQuery = 'DELETE FROM recetas WHERE id = ?';
    db.query(deleteQuery, [id], (err, result) => {
      if (err) {
        console.error('❌ Error al rechazar/eliminar receta:', err);
        return res.status(500).json({ error: 'Error al rechazar receta' });
      }
      console.log('✅ Receta rechazada/eliminada por admin');
      res.json({ success: true, message: 'Receta rechazada exitosamente' });
    });
  }
});

app.delete('/admin/recetas/:id', (req, res) => {
  const { id } = req.params;
  const { usuario_id } = req.body;

  console.log('🗑️ Admin eliminando receta:', { id, usuario_id });

  if (usuario_id !== 0 && usuario_id !== '0') {
    return res.status(403).json({ error: 'No tienes permisos de administrador' });
  }

  const checkQuery = 'SELECT foto_url FROM recetas WHERE id = ?';
  db.query(checkQuery, [id], (err, results) => {
    if (err) {
      console.error('❌ Error al verificar receta:', err);
      return res.status(500).json({ error: 'Error al verificar receta' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Receta no encontrada' });
    }

    const fotoUrl = results[0].foto_url;
    if (fotoUrl && fotoUrl.includes('/uploads/')) {
      const filename = fotoUrl.split('/uploads/')[1];
      const filePath = path.join(__dirname, 'uploads', filename);

      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
          console.log('🗑️ Imagen eliminada:', filename);
        } catch (deleteError) {
          console.error('❌ Error al eliminar imagen:', deleteError);
        }
      }
    }

    const deleteQuery = 'DELETE FROM recetas WHERE id = ?';
    db.query(deleteQuery, [id], (err, result) => {
      if (err) {
        console.error('❌ Error al eliminar receta:', err);
        return res.status(500).json({ error: 'Error al eliminar receta' });
      }

      console.log('✅ Receta eliminada por ADMIN');
      res.json({ success: true, message: 'Receta eliminada exitosamente' });
    });
  });
});

//Endpoint de obtener recetas de un usuario específico
app.get('/recetas/usuario/:usuarioId', (req, res) => {
  const { usuarioId } = req.params;

  const query = `
    SELECT r.*, u.nombre as usuario_nombre
    FROM recetas r
    JOIN usuarios u ON r.usuario_id = u.id
    WHERE r.usuario_id = ?
    ORDER BY r.fecha_creacion DESC
  `;

  db.query(query, [usuarioId], (err, results) => {
    if (err) {
      console.error('❌ Error al obtener recetas del usuario:', err);
      return res.status(500).json({ error: 'Error al obtener recetas' });
    }
    res.json({ success: true, recetas: results });
  });
});

//Endpoint de bbtener una receta específica
app.get('/recetas/:id', (req, res) => {
  const { id } = req.params;

  const query = `
    SELECT r.*, u.nombre as usuario_nombre
    FROM recetas r
    JOIN usuarios u ON r.usuario_id = u.id
    WHERE r.id = ?
  `;

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('❌ Error al obtener receta:', err);
      return res.status(500).json({ error: 'Error al obtener receta' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Receta no encontrada' });
    }

    res.json({ success: true, receta: results[0] });
  });
});

//Endpoint de actualizar una receta
app.put('/recetas/:id', (req, res) => {
  const { id } = req.params;
  const {
    usuario_id,
    nombre,
    descripcion,
    ingredientes,
    paso_a_paso,
    metodo_coccion,
    tipo_corte,
    tiempo_preparacion,
    foto_url
  } = req.body;

  console.log('✏️ Actualizando receta:', { id, usuario_id });

  const checkQuery = 'SELECT usuario_id FROM recetas WHERE id = ?';

  db.query(checkQuery, [id], (err, results) => {
    if (err) {
      console.error('❌ Error al verificar receta:', err);
      return res.status(500).json({ error: 'Error al verificar receta' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Receta no encontrada' });
    }

    if (results[0].usuario_id !== usuario_id) {
      return res.status(403).json({ error: 'No tienes permiso para editar esta receta' });
    }

    const updateQuery = `
      UPDATE recetas 
      SET nombre = ?, descripcion = ?, ingredientes = ?, paso_a_paso = ?, 
          metodo_coccion = ?, tipo_corte = ?, tiempo_preparacion = ?, foto_url = ?
      WHERE id = ?
    `;

    db.query(
      updateQuery,
      [nombre, descripcion, ingredientes, paso_a_paso, metodo_coccion, tipo_corte, tiempo_preparacion, foto_url, id],
      (err, result) => {
        if (err) {
          console.error('❌ Error al actualizar receta:', err);
          return res.status(500).json({ error: 'Error al actualizar receta' });
        }

        console.log('✅ Receta actualizada exitosamente');
        res.json({ success: true, message: 'Receta actualizada exitosamente' });
      }
    );
  });
});

// Endpoint de eliminar una receta
app.delete('/recetas/:id', (req, res) => {
  const { id } = req.params;
  const { usuario_id, isAdmin } = req.body;

  console.log('🗑️ Eliminando receta:', { id, usuario_id, isAdmin });

  if (isAdmin) {
    const checkQuery = 'SELECT foto_url FROM recetas WHERE id = ?';

    db.query(checkQuery, [id], (err, results) => {
      if (err) {
        console.error('❌ Error al verificar receta:', err);
        return res.status(500).json({ error: 'Error al verificar receta' });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: 'Receta no encontrada' });
      }

      const fotoUrl = results[0].foto_url;
      if (fotoUrl && fotoUrl.includes('/uploads/')) {
        const filename = fotoUrl.split('/uploads/')[1];
        const filePath = path.join(__dirname, 'uploads', filename);

        if (fs.existsSync(filePath)) {
          try {
            fs.unlinkSync(filePath);
            console.log('🗑️ Imagen eliminada:', filename);
          } catch (deleteError) {
            console.error('❌ Error al eliminar imagen:', deleteError);
          }
        }
      }

      const deleteQuery = 'DELETE FROM recetas WHERE id = ?';

      db.query(deleteQuery, [id], (err, result) => {
        if (err) {
          console.error('❌ Error al eliminar receta:', err);
          return res.status(500).json({ error: 'Error al eliminar receta' });
        }

        console.log('✅ Receta eliminada por ADMIN');
        res.json({ success: true, message: 'Receta eliminada exitosamente' });
      });
    });
    return;
  }

  const checkQuery = 'SELECT usuario_id, foto_url FROM recetas WHERE id = ?';

  db.query(checkQuery, [id], (err, results) => {
    if (err) {
      console.error('❌ Error al verificar receta:', err);
      return res.status(500).json({ error: 'Error al verificar receta' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Receta no encontrada' });
    }

    if (results[0].usuario_id != usuario_id) {
      return res.status(403).json({ error: 'No tienes permiso para eliminar esta receta' });
    }

    const fotoUrl = results[0].foto_url;
    if (fotoUrl && fotoUrl.includes('/uploads/')) {
      const filename = fotoUrl.split('/uploads/')[1];
      const filePath = path.join(__dirname, 'uploads', filename);

      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
          console.log('🗑️ Imagen eliminada:', filename);
        } catch (deleteError) {
          console.error('❌ Error al eliminar imagen:', deleteError);
        }
      }
    }

    const deleteQuery = 'DELETE FROM recetas WHERE id = ?';

    db.query(deleteQuery, [id], (err, result) => {
      if (err) {
        console.error('❌ Error al eliminar receta:', err);
        return res.status(500).json({ error: 'Error al eliminar receta' });
      }

      console.log('✅ Receta eliminada exitosamente');
      res.json({ success: true, message: 'Receta eliminada exitosamente' });
    });
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📁 Carpeta de uploads: ${uploadsDir}`);
  console.log(`👤 Usuario admin: "admin" / Contraseña: "1234"`);
  console.log(`✅ Passport configurado correctamente`);
});