import express from 'express'
import cors from 'cors'
import mysql from 'mysql2/promise'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 5000
const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret_in_production'

app.use(cors())
app.use(express.json())

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'explore_france',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

pool.on('error', (err) => {
  console.error('Database pool error:', err)
})

async function initializeDatabase() {
  const connection = await pool.getConnection()
  try {
    await connection.query(`
      CREATE TABLE IF NOT EXISTS regions (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        image_url VARCHAR(500),
        highlights JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `)

    await connection.query(`
      CREATE TABLE IF NOT EXISTS quizzes (
        id VARCHAR(36) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        region_id VARCHAR(36),
        difficulty ENUM('easy', 'medium', 'hard') DEFAULT 'medium',
        created_by VARCHAR(36),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (region_id) REFERENCES regions(id) ON DELETE SET NULL,
        KEY (created_by)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `)

    await connection.query(`
      CREATE TABLE IF NOT EXISTS questions (
        id VARCHAR(36) PRIMARY KEY,
        quiz_id VARCHAR(36) NOT NULL,
        question_text TEXT NOT NULL,
        options JSON NOT NULL,
        correct_answer VARCHAR(10) NOT NULL,
        order_index INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE,
        KEY (quiz_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `)

    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(36) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255),
        username VARCHAR(255) UNIQUE NOT NULL,
        role ENUM('student', 'admin') DEFAULT 'student',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        KEY (email)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `)

    await connection.query(`
      CREATE TABLE IF NOT EXISTS scores (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36) NOT NULL,
        quiz_id VARCHAR(36) NOT NULL,
        score INT NOT NULL DEFAULT 0,
        total_questions INT NOT NULL DEFAULT 0,
        completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE,
        KEY (user_id),
        KEY (quiz_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `)

    console.log('✓ Database tables initialized')
  } catch (err) {
    console.error('Database initialization error:', err)
  } finally {
    await connection.release()
  }
}

async function getConnection() {
  return await pool.getConnection()
}

function generateId() {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36)
}

async function rowExists(connection, table, condition) {
  const [rows] = await connection.query(`SELECT COUNT(*) as count FROM ${table} WHERE ${condition}`)
  return rows[0].count > 0
}

// ================== AUTH MIDDLEWARE ==================

function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1] // Bearer <token>

  if (!token) {
    return res.status(401).json({ error: 'No token provided' })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
}

// ================== AUTH ROUTES ==================

// POST /api/auth/register
app.post('/api/auth/register', async (req, res) => {
  const { email, password, username } = req.body

  if (!email || !password || !username) {
    return res.status(400).json({ error: 'Email, password, and username are required' })
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' })
  }
  if (username.length < 3) {
    return res.status(400).json({ error: 'Username must be at least 3 characters' })
  }

  const connection = await getConnection()
  try {
    // Check for duplicate email or username
    const [existing] = await connection.query(
      'SELECT id FROM users WHERE email = ? OR username = ?',
      [email, username]
    )
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Email or username already taken' })
    }

    const id = generateId()
    const password_hash = await bcrypt.hash(password, 10)

    await connection.query(
      'INSERT INTO users (id, email, password_hash, username, role) VALUES (?, ?, ?, ?, ?)',
      [id, email, password_hash, username, 'student']
    )

    const token = jwt.sign({ id, email, username, role: 'student' }, JWT_SECRET, { expiresIn: '7d' })

    res.status(201).json({
      token,
      user: { id, email, username, role: 'student' }
    })
  } catch (err) {
    console.error('Register error:', err)
    res.status(500).json({ error: 'Registration failed' })
  } finally {
    connection.release()
  }
})

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' })
  }

  const connection = await getConnection()
  try {
    const [users] = await connection.query(
      'SELECT id, email, password_hash, username, role FROM users WHERE email = ?',
      [email]
    )

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const user = users[0]
    const passwordMatch = await bcrypt.compare(password, user.password_hash)

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({
      token,
      user: { id: user.id, email: user.email, username: user.username, role: user.role }
    })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ error: 'Login failed' })
  } finally {
    connection.release()
  }
})

// GET /api/auth/me  (requires token)
app.get('/api/auth/me', authMiddleware, async (req, res) => {
  const connection = await getConnection()
  try {
    const [users] = await connection.query(
      'SELECT id, email, username, role, created_at FROM users WHERE id = ?',
      [req.user.id]
    )

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json({ user: users[0] })
  } catch (err) {
    console.error('Me error:', err)
    res.status(500).json({ error: 'Failed to fetch user' })
  } finally {
    connection.release()
  }
})

// ================== REGIONS ROUTES ==================

app.get('/api/regions', async (req, res) => {
  try {
    const connection = await getConnection()
    const [regions] = await connection.query('SELECT * FROM regions ORDER BY name')
    connection.release()

    const parsedRegions = regions.map(r => ({
      ...r,
      highlights: r.highlights ? JSON.parse(r.highlights) : []
    }))

    res.json(parsedRegions)
  } catch (err) {
    console.error('Error fetching regions:', err)
    res.status(500).json({ error: 'Failed to fetch regions' })
  }
})

app.get('/api/regions/:id', async (req, res) => {
  try {
    const connection = await getConnection()
    const [regions] = await connection.query('SELECT * FROM regions WHERE id = ?', [req.params.id])
    connection.release()

    if (regions.length === 0) {
      return res.status(404).json({ error: 'Region not found' })
    }

    const region = {
      ...regions[0],
      highlights: regions[0].highlights ? JSON.parse(regions[0].highlights) : []
    }

    res.json(region)
  } catch (err) {
    console.error('Error fetching region:', err)
    res.status(500).json({ error: 'Failed to fetch region' })
  }
})

app.post('/api/regions', async (req, res) => {
  try {
    const { name, description, image_url, highlights } = req.body

    if (!name || !description) {
      return res.status(400).json({ error: 'Name and description are required' })
    }

    const id = generateId()
    const connection = await getConnection()

    await connection.query(
      'INSERT INTO regions (id, name, description, image_url, highlights) VALUES (?, ?, ?, ?, ?)',
      [id, name, description, image_url || '', JSON.stringify(highlights || [])]
    )

    connection.release()

    res.status(201).json({
      id,
      name,
      description,
      image_url,
      highlights: highlights || [],
      created_at: new Date().toISOString()
    })
  } catch (err) {
    console.error('Error creating region:', err)
    res.status(500).json({ error: 'Failed to create region' })
  }
})

app.put('/api/regions/:id', async (req, res) => {
  try {
    const { name, description, image_url, highlights } = req.body

    if (!name || !description) {
      return res.status(400).json({ error: 'Name and description are required' })
    }

    const connection = await getConnection()

    if (!await rowExists(connection, 'regions', `id = '${req.params.id}'`)) {
      connection.release()
      return res.status(404).json({ error: 'Region not found' })
    }

    await connection.query(
      'UPDATE regions SET name = ?, description = ?, image_url = ?, highlights = ? WHERE id = ?',
      [name, description, image_url || '', JSON.stringify(highlights || []), req.params.id]
    )

    connection.release()

    res.json({
      id: req.params.id,
      name,
      description,
      image_url,
      highlights: highlights || [],
      updated_at: new Date().toISOString()
    })
  } catch (err) {
    console.error('Error updating region:', err)
    res.status(500).json({ error: 'Failed to update region' })
  }
})

app.delete('/api/regions/:id', async (req, res) => {
  try {
    const connection = await getConnection()

    if (!await rowExists(connection, 'regions', `id = '${req.params.id}'`)) {
      connection.release()
      return res.status(404).json({ error: 'Region not found' })
    }

    await connection.query('DELETE FROM regions WHERE id = ?', [req.params.id])
    connection.release()

    res.json({ success: true, message: 'Region deleted' })
  } catch (err) {
    console.error('Error deleting region:', err)
    res.status(500).json({ error: 'Failed to delete region' })
  }
})

// ================== QUIZZES ROUTES ==================

app.get('/api/quizzes', async (req, res) => {
  try {
    const connection = await getConnection()
    const [quizzes] = await connection.query(`
      SELECT q.*, r.name as region_name
      FROM quizzes q
      LEFT JOIN regions r ON q.region_id = r.id
      ORDER BY q.created_at DESC
    `)
    connection.release()

    const parsedQuizzes = quizzes.map(q => ({
      ...q,
      regions: q.region_id ? { id: q.region_id, name: q.region_name } : null
    }))

    res.json(parsedQuizzes)
  } catch (err) {
    console.error('Error fetching quizzes:', err)
    res.status(500).json({ error: 'Failed to fetch quizzes' })
  }
})

app.get('/api/quizzes/:id', async (req, res) => {
  try {
    const connection = await getConnection()
    const [quizzes] = await connection.query(`
      SELECT q.*, r.name as region_name
      FROM quizzes q
      LEFT JOIN regions r ON q.region_id = r.id
      WHERE q.id = ?
    `, [req.params.id])

    if (quizzes.length === 0) {
      connection.release()
      return res.status(404).json({ error: 'Quiz not found' })
    }

    const quiz = {
      ...quizzes[0],
      regions: quizzes[0].region_id ? { id: quizzes[0].region_id, name: quizzes[0].region_name } : null
    }

    const [questions] = await connection.query(
      'SELECT * FROM questions WHERE quiz_id = ? ORDER BY order_index',
      [req.params.id]
    )

    const parsedQuestions = questions.map(q => ({
      ...q,
      options: q.options ? JSON.parse(q.options) : []
    }))

    connection.release()

    res.json({ ...quiz, questions: parsedQuestions })
  } catch (err) {
    console.error('Error fetching quiz:', err)
    res.status(500).json({ error: 'Failed to fetch quiz' })
  }
})

app.post('/api/quizzes', async (req, res) => {
  try {
    const { title, description, region_id, difficulty, questions } = req.body

    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' })
    }

    const quizId = generateId()
    const connection = await getConnection()

    await connection.query(
      'INSERT INTO quizzes (id, title, description, region_id, difficulty, created_by) VALUES (?, ?, ?, ?, ?, ?)',
      [quizId, title, description, region_id || null, difficulty || 'medium', 'admin']
    )

    if (questions && questions.length > 0) {
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i]
        const questionId = generateId()
        await connection.query(
          'INSERT INTO questions (id, quiz_id, question_text, options, correct_answer, order_index) VALUES (?, ?, ?, ?, ?, ?)',
          [questionId, quizId, q.question_text, JSON.stringify(q.options || []), q.correct_answer, i]
        )
      }
    }

    connection.release()

    res.status(201).json({
      id: quizId,
      title,
      description,
      region_id,
      difficulty: difficulty || 'medium',
      questions: questions || [],
      created_at: new Date().toISOString()
    })
  } catch (err) {
    console.error('Error creating quiz:', err)
    res.status(500).json({ error: 'Failed to create quiz' })
  }
})

app.put('/api/quizzes/:id', async (req, res) => {
  try {
    const { title, description, region_id, difficulty, questions } = req.body

    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' })
    }

    const connection = await getConnection()

    if (!await rowExists(connection, 'quizzes', `id = '${req.params.id}'`)) {
      connection.release()
      return res.status(404).json({ error: 'Quiz not found' })
    }

    await connection.query(
      'UPDATE quizzes SET title = ?, description = ?, region_id = ?, difficulty = ? WHERE id = ?',
      [title, description, region_id || null, difficulty || 'medium', req.params.id]
    )

    await connection.query('DELETE FROM questions WHERE quiz_id = ?', [req.params.id])

    if (questions && questions.length > 0) {
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i]
        const questionId = generateId()
        await connection.query(
          'INSERT INTO questions (id, quiz_id, question_text, options, correct_answer, order_index) VALUES (?, ?, ?, ?, ?, ?)',
          [questionId, req.params.id, q.question_text, JSON.stringify(q.options || []), q.correct_answer, i]
        )
      }
    }

    connection.release()

    res.json({
      id: req.params.id,
      title,
      description,
      region_id,
      difficulty: difficulty || 'medium',
      questions: questions || [],
      updated_at: new Date().toISOString()
    })
  } catch (err) {
    console.error('Error updating quiz:', err)
    res.status(500).json({ error: 'Failed to update quiz' })
  }
})

app.delete('/api/quizzes/:id', async (req, res) => {
  try {
    const connection = await getConnection()

    if (!await rowExists(connection, 'quizzes', `id = '${req.params.id}'`)) {
      connection.release()
      return res.status(404).json({ error: 'Quiz not found' })
    }

    await connection.query('DELETE FROM questions WHERE quiz_id = ?', [req.params.id])
    await connection.query('DELETE FROM quizzes WHERE id = ?', [req.params.id])
    connection.release()

    res.json({ success: true, message: 'Quiz deleted' })
  } catch (err) {
    console.error('Error deleting quiz:', err)
    res.status(500).json({ error: 'Failed to delete quiz' })
  }
})

// ================== SCORES ROUTES ==================

// POST /api/scores — save a score
app.post('/api/scores', authMiddleware, async (req, res) => {
  const { quiz_id, score, total_questions } = req.body
  if (!quiz_id || score === undefined || !total_questions) {
    return res.status(400).json({ error: 'quiz_id, score, and total_questions are required' })
  }
  const connection = await getConnection()
  try {
    const id = generateId()
    await connection.query(
      'INSERT INTO scores (id, user_id, quiz_id, score, total_questions) VALUES (?, ?, ?, ?, ?)',
      [id, req.user.id, quiz_id, score, total_questions]
    )
    res.status(201).json({ id, user_id: req.user.id, quiz_id, score, total_questions })
  } catch (err) {
    console.error('Error saving score:', err)
    res.status(500).json({ error: 'Failed to save score' })
  } finally {
    connection.release()
  }
})

// GET /api/scores/me — current user's scores
app.get('/api/scores/me', authMiddleware, async (req, res) => {
  const connection = await getConnection()
  try {
    const [rows] = await connection.query(`
      SELECT s.*, q.title as quiz_title, q.difficulty
      FROM scores s
      JOIN quizzes q ON s.quiz_id = q.id
      WHERE s.user_id = ?
      ORDER BY s.completed_at DESC
    `, [req.user.id])
    res.json(rows)
  } catch (err) {
    console.error('Error fetching user scores:', err)
    res.status(500).json({ error: 'Failed to fetch scores' })
  } finally {
    connection.release()
  }
})

// GET /api/scores — all scores (admin)
app.get('/api/scores', async (req, res) => {
  const connection = await getConnection()
  try {
    const [rows] = await connection.query(`
      SELECT s.*, q.title as quiz_title, u.username
      FROM scores s
      JOIN quizzes q ON s.quiz_id = q.id
      JOIN users u ON s.user_id = u.id
      ORDER BY s.completed_at DESC
    `)
    // Shape data to match what AdminDashboard expects
    const shaped = rows.map(r => ({
      ...r,
      quizzes: { title: r.quiz_title },
      profiles: { username: r.username }
    }))
    res.json(shaped)
  } catch (err) {
    console.error('Error fetching all scores:', err)
    res.status(500).json({ error: 'Failed to fetch scores' })
  } finally {
    connection.release()
  }
})

// ================== HEALTH CHECK ==================

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Initialize and start server
await initializeDatabase()

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
  console.log(`📊 API endpoints available at http://localhost:${PORT}/api`)
})