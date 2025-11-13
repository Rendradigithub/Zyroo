// === server.js ===
import express from 'express'
import path from 'path'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { fileURLToPath } from 'url'
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

dotenv.config()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// === Supabase client ===
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
)

const app = express()
const PORT = process.env.PORT || 3000

// === Middleware umum ===
app.use(express.json({ limit: '10mb' }))
app.use(cors({ origin: true, credentials: true }))
app.use(cookieParser())

const publicDir = path.join(__dirname, 'public')
app.use(express.static(publicDir))
console.log('📁 Static dir:', publicDir)

// === AUTH ===

// Register user
app.post('/api/register', async (req, res) => {
  const { email, password, username } = req.body || {}
  if (!email || !password)
    return res.status(400).json({ success: false, message: 'Email & password wajib diisi.' })

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { username } }
  })
  if (error) return res.status(400).json({ success: false, message: error.message })
  res.json({ success: true, message: 'Registrasi berhasil', user: data.user })
})

// Login user
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body || {}
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return res.status(400).json({ success: false, message: error.message })

  res.cookie('access_token', data.session.access_token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production'
  })
  res.json({ success: true, message: 'Login berhasil', user: data.user })
})

// Logout user
app.post('/api/logout', async (req, res) => {
  res.clearCookie('access_token')
  res.json({ success: true, message: 'Logout berhasil' })
})

// === Middleware auth ===
async function authMiddleware(req, res, next) {
  const token = req.cookies?.access_token
  if (!token)
    return res.status(401).json({ success: false, message: 'Unauthorized' })

  const { data, error } = await supabase.auth.getUser(token)
  if (error || !data.user)
    return res.status(401).json({ success: false, message: 'Token tidak valid' })

  req.user = data.user
  next()
}

// === CRUD PORTFOLIO ===

// Create
app.post('/api/portfolio', authMiddleware, async (req, res) => {
  const { title, category, description, link_demo } = req.body || {}
  if (!title || !category)
    return res.status(400).json({ success: false, message: 'Title & category wajib.' })

  const { data, error } = await supabase
    .from('portfolio')
    .insert([{ user_id: req.user.id, title, category, description, link_demo }])
    .select()

  if (error) return res.status(500).json({ success: false, message: error.message })
  res.json({ success: true, message: 'Portfolio berhasil dibuat', item: data[0] })
})

// Read
app.get('/api/portfolio', async (req, res) => {
  const { user_id, category } = req.query
  let query = supabase.from('portfolio').select('*').order('created_at', { ascending: false })
  if (user_id) query = query.eq('user_id', user_id)
  if (category) query = query.eq('category', category)

  const { data, error } = await query
  if (error) return res.status(500).json({ success: false, message: error.message })
  res.json({ success: true, items: data })
})

// Update
app.put('/api/portfolio/:id', authMiddleware, async (req, res) => {
  const id = req.params.id
  const updates = req.body || {}

  const { data, error } = await supabase
    .from('portfolio')
    .update(updates)
    .eq('id', id)
    .eq('user_id', req.user.id)
    .select()

  if (error) return res.status(500).json({ success: false, message: error.message })
  res.json({ success: true, message: 'Portfolio berhasil diperbarui', item: data[0] })
})

// Delete
app.delete('/api/portfolio/:id', authMiddleware, async (req, res) => {
  const id = req.params.id
  const { error } = await supabase
    .from('portfolio')
    .delete()
    .eq('id', id)
    .eq('user_id', req.user.id)

  if (error) return res.status(500).json({ success: false, message: error.message })
  res.json({ success: true, message: 'Portfolio berhasil dihapus' })
})

// === Upload ke Supabase Storage ===
app.post('/api/upload', authMiddleware, async (req, res) => {
  try {
    const filePath = path.join(__dirname, 'public', 'default.jpg')
    const fileBuffer = fs.readFileSync(filePath)

    const { data, error } = await supabase.storage
      .from('images')
      .upload(`user_${req.user.id}/${Date.now()}.jpg`, fileBuffer, {
        contentType: 'image/jpeg',
        upsert: false
      })

    if (error) throw error

    const publicUrl = supabase.storage.from('images').getPublicUrl(data.path).data.publicUrl
    res.json({ success: true, url: publicUrl })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// === Fallback ke index.html ===
app.use((req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'))
})

// === Jalankan server ===
app.listen(PORT, () => {
  console.log(`✅ Server berjalan di http://127.0.0.1:${PORT}`)
})
