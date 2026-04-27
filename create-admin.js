import bcrypt from 'bcryptjs'
import mysql from 'mysql2/promise'

// ── Change these if you want ──────────────────────────
const ADMIN_EMAIL    = 'admin@explorefrance.com'
const ADMIN_USERNAME = 'admin'
const ADMIN_PASSWORD = 'admin123'
// ─────────────────────────────────────────────────────

// ── Match these to your .env ──────────────────────────
const DB_HOST     = 'localhost'
const DB_USER     = 'root'
const DB_PASSWORD = ''          // ← put your MySQL password here if you have one
const DB_NAME     = 'explore_france'
// ─────────────────────────────────────────────────────

const connection = await mysql.createConnection({
  host: DB_HOST, user: DB_USER, password: DB_PASSWORD, database: DB_NAME,
})

const id            = Math.random().toString(36).substr(2, 9) + Date.now().toString(36)
const password_hash = await bcrypt.hash(ADMIN_PASSWORD, 10)

try {
  await connection.execute(
    'INSERT INTO users (id, email, password_hash, username, role) VALUES (?, ?, ?, ?, ?)',
    [id, ADMIN_EMAIL, password_hash, ADMIN_USERNAME, 'admin']
  )
  console.log('✅ Admin user created!')
  console.log(`   Email:    ${ADMIN_EMAIL}`)
  console.log(`   Password: ${ADMIN_PASSWORD}`)
} catch (err) {
  if (err.code === 'ER_DUP_ENTRY') {
    console.log('⚠️  An admin with that email or username already exists.')
  } else {
    console.error('❌ Error:', err.message)
  }
} finally {
  await connection.end()
}