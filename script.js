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
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(cors({ origin: true, credentials: true }))
app.use(cookieParser())

const publicDir = path.join(__dirname, 'public')
app.use(express.static(publicDir))
console.log('Static dir:', publicDir)

// === Auth endpoints ===
app.post('/api/register', async (req, res) => {
  const { email, password, username } = req.body || {}
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email & password wajib' })
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { username } },
  })
  if (error) return res.status(400).json({ success: false, message: error.message })
  res.json({ success: true, message: 'Registrasi berhasil', user: data.user })
})

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body || {}
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return res.status(400).json({ success: false, message: error.message })

  res.cookie('access_token', data.session.access_token, {
    httpOnly: true,
    sameSite: 'lax',
  })
  res.json({ success: true, message: 'Login berhasil', user: data.user })
})

app.post('/api/logout', async (req, res) => {
  await supabase.auth.signOut()
  res.clearCookie('access_token')
  res.json({ success: true, message: 'Logout berhasil' })
})

// === Auth middleware ===
async function authMiddleware(req, res, next) {
  const token = req.cookies?.access_token
  if (!token) return res.status(401).json({ success: false, message: 'Unauthorized' })
  const { data, error } = await supabase.auth.getUser(token)
  if (error || !data.user) return res.status(401).json({ success: false, message: 'Invalid token' })
  req.user = data.user
  next()
}

// === CRUD Portfolio ===
app.post('/api/portfolio', authMiddleware, async (req, res) => {
  const { title, category, description, link_demo } = req.body || {}
  if (!title || !category)
    return res.status(400).json({ success: false, message: 'Title & category wajib' })

  const { data, error } = await supabase
    .from('portfolio')
    .insert([{ user_id: req.user.id, title, category, description, link_demo }])
    .select()

  if (error) return res.status(500).json({ success: false, message: error.message })
  res.json({ success: true, message: 'Portfolio created', item: data[0] })
})

app.get('/api/portfolio', async (req, res) => {
  const { user_id, category } = req.query
  let query = supabase.from('portfolio').select('*').order('created_at', { ascending: false })
  if (user_id) query = query.eq('user_id', user_id)
  if (category) query = query.eq('category', category)

  const { data, error } = await query
  if (error) return res.status(500).json({ success: false, message: error.message })
  res.json({ success: true, items: data })
})

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
  res.json({ success: true, message: 'Portfolio updated', item: data[0] })
})

app.delete('/api/portfolio/:id', authMiddleware, async (req, res) => {
  const id = req.params.id
  const { error } = await supabase.from('portfolio').delete().eq('id', id).eq('user_id', req.user.id)
  if (error) return res.status(500).json({ success: false, message: error.message })
  res.json({ success: true, message: 'Portfolio deleted' })
})

// === Upload File ke Supabase Storage ===
app.post('/api/upload', authMiddleware, async (req, res) => {
  // contoh upload file dummy; di front-end nanti gunakan formData
  const filePath = path.join(__dirname, 'public', 'default.jpg')
  const fileBuffer = fs.readFileSync(filePath)

  const { data, error } = await supabase.storage
    .from('images')
    .upload(`user_${req.user.id}/${Date.now()}.jpg`, fileBuffer, {
      contentType: 'image/jpeg',
    })

  if (error) return res.status(500).json({ success: false, message: error.message })
  const publicUrl = supabase.storage.from('images').getPublicUrl(data.path).data.publicUrl
  res.json({ success: true, url: publicUrl })
})

// === Fallback ke index.html ===
app.use((req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'))
})

app.listen(PORT, () => console.log(`✅ Server berjalan di http://127.0.0.1:${PORT}`))
