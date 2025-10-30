// backend/server.js
const express = require('express');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();

// Configurar CORS
const cors = require('cors');
app.use(cors({
  origin: ['http://localhost:8081', 'http://localhost:19006', 'http://192.168.1.100:8081'],
  credentials: true
}));

app.use(express.json());

// Configurar conexión MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'oauth_app_nueva',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

// Configurar multer para subidas de archivos
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Solo imágenes (JPEG, PNG) y PDF permitidos'));
    }
  }
});

// Middleware para verificar JWT
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token requerido' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token inválido' });
  }
};

// Crear tablas en la BD
async function initDatabase() {
  const connection = await pool.getConnection();
  try {
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        google_id VARCHAR(255) UNIQUE,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        profile_picture LONGTEXT,
        provider VARCHAR(50) DEFAULT 'google',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS profiles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT UNIQUE NOT NULL,
        phone VARCHAR(20),
        address TEXT,
        latitude DECIMAL(10, 8),
        longitude DECIMAL(11, 8),
        document_type VARCHAR(50),
        document_scan LONGTEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    
    console.log('✓ Tablas creadas correctamente');
  } catch (err) {
    console.error('Error al crear tablas:', err.message);
  } finally {
    connection.release();
  }
}

initDatabase();

// ========== AUTENTICACIÓN GOOGLE ==========

app.post('/api/auth/google', async (req, res) => {
  let connection;
  try {
    const { idToken, accessToken } = req.body;
    const token = idToken || accessToken;

    if (!token) {
      return res.status(400).json({ error: 'Token requerido' });
    }

    console.log('📱 Token recibido:', token.substring(0, 50) + '...');

    let tokenInfo;
    try {
      // Intenta verificar como ID Token
      tokenInfo = await axios.get(
        `https://www.googleapis.com/oauth2/v1/tokeninfo?id_token=${token}`
      );
      console.log('✓ ID Token verificado');
    } catch (err) {
      try {
        // Si falla, intenta como Access Token
        tokenInfo = await axios.get(
          `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${token}`
        );
        console.log('✓ Access Token verificado');
      } catch (err2) {
        console.error('Error al verificar token:', err2.response?.data || err2.message);
        return res.status(400).json({ error: 'Token inválido o expirado' });
      }
    }

    const email = tokenInfo.data.email;
    const name = tokenInfo.data.name || 'Usuario';
    const picture = tokenInfo.data.picture || '';
    const googleId = tokenInfo.data.user_id || tokenInfo.data.sub;

    console.log('📧 Email:', email);
    console.log('👤 Nombre:', name);

    connection = await pool.getConnection();

    // Buscar usuario existente
    const [existingUser] = await connection.query(
      'SELECT * FROM users WHERE email = ? OR google_id = ?',
      [email, googleId]
    );

    let userId;

    if (existingUser.length > 0) {
      userId = existingUser[0].id;
      console.log('👤 Usuario existente:', userId);
      
      // Actualizar usuario
      await connection.query(
        'UPDATE users SET google_id = ?, name = ?, profile_picture = ? WHERE id = ?',
        [googleId, name, picture, userId]
      );
    } else {
      console.log('🆕 Creando nuevo usuario');
      
      // Crear nuevo usuario
      const [result] = await connection.query(
        'INSERT INTO users (google_id, email, name, profile_picture) VALUES (?, ?, ?, ?)',
        [googleId, email, name, picture]
      );
      userId = result.insertId;

      // Crear perfil vacío
      await connection.query(
        'INSERT INTO profiles (user_id) VALUES (?)',
        [userId]
      );
      
      console.log('✓ Nuevo usuario creado:', userId);
    }

    // Obtener usuario con perfil
    const [user] = await connection.query(
      `SELECT u.*, p.phone, p.address, p.latitude, p.longitude, 
              p.document_type, p.document_scan 
       FROM users u 
       LEFT JOIN profiles p ON u.id = p.user_id 
       WHERE u.id = ?`,
      [userId]
    );

    const userdata = user[0];
    const jwtToken = jwt.sign(
      { id: userId, email: userdata.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('✓ JWT generado para:', email);

    res.json({
      token: jwtToken,
      user: {
        id: userdata.id,
        email: userdata.email,
        name: userdata.name,
        profilePicture: userdata.profile_picture,
        provider: 'google',
        profile: {
          phone: userdata.phone || '',
          address: userdata.address || '',
          latitude: userdata.latitude,
          longitude: userdata.longitude,
          documentScan: userdata.document_scan,
          documentType: userdata.document_type || ''
        }
      }
    });
  } catch (err) {
    console.error('❌ Error en autenticación:', err.message);
    res.status(400).json({ error: 'Error en autenticación: ' + err.message });
  } finally {
    if (connection) connection.release();
  }
});

// ========== PERFIL DE USUARIO ==========

// Obtener perfil
app.get('/api/profile', verifyToken, async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const [user] = await connection.query(
      `SELECT u.*, p.phone, p.address, p.latitude, p.longitude, 
              p.document_type, p.document_scan 
       FROM users u 
       LEFT JOIN profiles p ON u.id = p.user_id 
       WHERE u.id = ?`,
      [req.user.id]
    );

    if (user.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const userdata = user[0];
    res.json({
      id: userdata.id,
      email: userdata.email,
      name: userdata.name,
      profilePicture: userdata.profile_picture,
      provider: userdata.provider,
      profile: {
        phone: userdata.phone || '',
        address: userdata.address || '',
        latitude: userdata.latitude,
        longitude: userdata.longitude,
        documentScan: userdata.document_scan,
        documentType: userdata.document_type || ''
      }
    });
  } catch (err) {
    console.error('❌ Error:', err.message);
    res.status(500).json({ error: 'Error al obtener perfil' });
  } finally {
    if (connection) connection.release();
  }
});

// Actualizar perfil
app.put('/api/profile', verifyToken, async (req, res) => {
  let connection;
  try {
    const { name, phone, address, latitude, longitude, documentType } = req.body;
    connection = await pool.getConnection();

    // Actualizar datos del usuario
    if (name) {
      await connection.query(
        'UPDATE users SET name = ? WHERE id = ?',
        [name, req.user.id]
      );
    }

    // Actualizar perfil
    const updates = [];
    const values = [];

    if (phone !== undefined) {
      updates.push('phone = ?');
      values.push(phone);
    }
    if (address !== undefined) {
      updates.push('address = ?');
      values.push(address);
    }
    if (latitude !== undefined) {
      updates.push('latitude = ?');
      values.push(latitude);
    }
    if (longitude !== undefined) {
      updates.push('longitude = ?');
      values.push(longitude);
    }
    if (documentType !== undefined) {
      updates.push('document_type = ?');
      values.push(documentType);
    }

    if (updates.length > 0) {
      values.push(req.user.id);
      await connection.query(
        `UPDATE profiles SET ${updates.join(', ')} WHERE user_id = ?`,
        values
      );
    }

    // Obtener usuario actualizado
    const [user] = await connection.query(
      `SELECT u.*, p.phone, p.address, p.latitude, p.longitude, 
              p.document_type, p.document_scan 
       FROM users u 
       LEFT JOIN profiles p ON u.id = p.user_id 
       WHERE u.id = ?`,
      [req.user.id]
    );

    const userdata = user[0];
    res.json({
      message: 'Perfil actualizado',
      user: {
        id: userdata.id,
        email: userdata.email,
        name: userdata.name,
        profilePicture: userdata.profile_picture,
        provider: userdata.provider,
        profile: {
          phone: userdata.phone || '',
          address: userdata.address || '',
          latitude: userdata.latitude,
          longitude: userdata.longitude,
          documentScan: userdata.document_scan,
          documentType: userdata.document_type || ''
        }
      }
    });
  } catch (err) {
    console.error('❌ Error:', err.message);
    res.status(500).json({ error: 'Error al actualizar perfil' });
  } finally {
    if (connection) connection.release();
  }
});

// Subir foto de perfil
app.post('/api/profile/picture', verifyToken, upload.single('picture'), async (req, res) => {
  let connection;
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se subió archivo' });
    }

    const photoPath = `/uploads/${req.file.filename}`;
    connection = await pool.getConnection();

    await connection.query(
      'UPDATE users SET profile_picture = ? WHERE id = ?',
      [photoPath, req.user.id]
    );

    const [user] = await connection.query(
      `SELECT u.*, p.phone, p.address, p.latitude, p.longitude, 
              p.document_type, p.document_scan 
       FROM users u 
       LEFT JOIN profiles p ON u.id = p.user_id 
       WHERE u.id = ?`,
      [req.user.id]
    );

    const userdata = user[0];
    res.json({
      message: 'Foto actualizada',
      user: {
        id: userdata.id,
        email: userdata.email,
        name: userdata.name,
        profilePicture: userdata.profile_picture,
        provider: userdata.provider,
        profile: {
          phone: userdata.phone || '',
          address: userdata.address || '',
          latitude: userdata.latitude,
          longitude: userdata.longitude,
          documentScan: userdata.document_scan,
          documentType: userdata.document_type || ''
        }
      }
    });
  } catch (err) {
    console.error('❌ Error:', err.message);
    res.status(500).json({ error: 'Error al subir foto' });
  } finally {
    if (connection) connection.release();
  }
});

// Subir escaneo de documento
app.post('/api/profile/document', verifyToken, upload.single('document'), async (req, res) => {
  let connection;
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se subió archivo' });
    }

    const documentPath = `/uploads/${req.file.filename}`;
    connection = await pool.getConnection();

    await connection.query(
      'UPDATE profiles SET document_scan = ? WHERE user_id = ?',
      [documentPath, req.user.id]
    );

    const [user] = await connection.query(
      `SELECT u.*, p.phone, p.address, p.latitude, p.longitude, 
              p.document_type, p.document_scan 
       FROM users u 
       LEFT JOIN profiles p ON u.id = p.user_id 
       WHERE u.id = ?`,
      [req.user.id]
    );

    const userdata = user[0];
    res.json({
      message: 'Documento cargado',
      user: {
        id: userdata.id,
        email: userdata.email,
        name: userdata.name,
        profilePicture: userdata.profile_picture,
        provider: userdata.provider,
        profile: {
          phone: userdata.phone || '',
          address: userdata.address || '',
          latitude: userdata.latitude,
          longitude: userdata.longitude,
          documentScan: userdata.document_scan,
          documentType: userdata.document_type || ''
        }
      }
    });
  } catch (err) {
    console.error('❌ Error:', err.message);
    res.status(500).json({ error: 'Error al subir documento' });
  } finally {
    if (connection) connection.release();
  }
});

// Servir archivos estáticos
app.use('/uploads', express.static('uploads'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n🚀 Backend corriendo en puerto ${PORT}`);
  console.log(`📍 API disponible en http://localhost:${PORT}`);
  console.log('✓ Listo para recibir conexiones\n');
});