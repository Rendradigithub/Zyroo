const express = require('express');
const path = require('path');
const cors = require('cors');
const bcrypt = require('bcrypt');
const mysql = require('mysql2');

const app = express();
const PORT = 3000;

// middleware
app.use(cors());
app.use(express.json());

// koneksi ke MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',       // ganti sesuai user MySQL kamu
  password: '',       // isi password MySQL kamu
  database: 'zyroo_accounts'
});

db.connect(err => {
  if (err) {
    console.error('❌ MySQL error:', err);
  } else {
    console.log('✅ Terhubung ke MySQL');
  }
});

// serve static
const publicDir = path.join(__dirname, 'public');
app.use(express.static(publicDir));

// API: register user baru
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.json({ success: false, message: 'Username & password wajib' });

  try {
    const hash = await bcrypt.hash(password, 10);
    const sql = 'INSERT INTO users (username, password) VALUES (?, ?)';
    db.query(sql, [username, hash], (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.json({ success: false, message: 'Username sudah digunakan' });
        }
        return res.json({ success: false, message: 'Error DB', error: err });
      }
      res.json({ success: true, message: 'Registrasi berhasil!' });
    });
  } catch (err) {
    res.json({ success: false, message: 'Gagal hash password' });
  }
});

// API: login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.json({ success: false, message: 'Username & password wajib' });
  }

  const sql = 'SELECT * FROM users WHERE username = ?';
  db.query(sql, [username], async (err, results) => {
    if (err) return res.json({ success: false, message: 'Error DB' });
    if (results.length === 0) return res.json({ success: false, message: 'User tidak ditemukan' });

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      res.json({ success: true, message: 'Login berhasil!' });
    } else {
      res.json({ success: false, message: 'Password salah' });
    }
  });
});

// fallback handler
app.use((req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

console.log("Static dir:", publicDir);


app.listen(PORT, () => {
  console.log(`✅ Server berjalan di http://127.0.0.1:${PORT}`);
});
