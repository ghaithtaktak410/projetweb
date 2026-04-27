<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({ username: '', email: '', password: '', confirmPassword: '' })
const errors = reactive({ username: '', email: '', password: '', confirmPassword: '' })
const submitError = ref('')

function validate() {
  errors.username = ''
  errors.email = ''
  errors.password = ''
  errors.confirmPassword = ''
  let valid = true

  if (!form.username.trim()) {
    errors.username = 'Username is required'
    valid = false
  } else if (form.username.length < 3) {
    errors.username = 'Username must be at least 3 characters'
    valid = false
  }

  if (!form.email.trim()) {
    errors.email = 'Email is required'
    valid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Please enter a valid email address'
    valid = false
  }

  if (!form.password) {
    errors.password = 'Password is required'
    valid = false
  } else if (form.password.length < 6) {
    errors.password = 'Password must be at least 6 characters'
    valid = false
  }

  if (form.password !== form.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match'
    valid = false
  }

  return valid
}

async function handleSubmit() {
  submitError.value = ''
  if (!validate()) return
  authStore.clearError()

  try {
    await authStore.register(form.email, form.password, form.username)
    router.push('/')
  } catch (e: unknown) {
    submitError.value = e instanceof Error ? e.message : 'Registration failed. Please try again.'
  }
}
</script>

<template>
  <div class="auth-page">
    <div class="auth-split">
      <div class="auth-visual">
        <img src="https://images.pexels.com/photos/1595385/pexels-photo-1595385.jpeg?auto=compress&cs=tinysrgb&w=900" alt="Provence" />
        <div class="visual-overlay">
          <div class="visual-content">
            <h2>Join Us</h2>
            <p>Create your free account and start exploring France with our interactive quizzes.</p>
          </div>
        </div>
      </div>

      <div class="auth-form-wrap">
        <div class="auth-form-inner">
          <router-link to="/" class="auth-logo">🇫🇷 Explore France</router-link>
          <h1 class="form-title">Create Account</h1>
          <p class="form-subtitle">Sign up to get started</p>

          <div v-if="submitError" class="alert-error">{{ submitError }}</div>

          <form @submit.prevent="handleSubmit" novalidate>
            <div class="field" :class="{ 'has-error': errors.username }">
              <label>Username</label>
              <input
                v-model="form.username"
                type="text"
                placeholder="johndoe"
                autocomplete="username"
              />
              <span class="field-error">{{ errors.username }}</span>
            </div>

            <div class="field" :class="{ 'has-error': errors.email }">
              <label>Email Address</label>
              <input
                v-model="form.email"
                type="email"
                placeholder="you@example.com"
                autocomplete="email"
              />
              <span class="field-error">{{ errors.email }}</span>
            </div>

            <div class="field" :class="{ 'has-error': errors.password }">
              <label>Password</label>
              <input
                v-model="form.password"
                type="password"
                placeholder="••••••••"
                autocomplete="new-password"
              />
              <span class="field-error">{{ errors.password }}</span>
            </div>

            <div class="field" :class="{ 'has-error': errors.confirmPassword }">
              <label>Confirm Password</label>
              <input
                v-model="form.confirmPassword"
                type="password"
                placeholder="••••••••"
                autocomplete="new-password"
              />
              <span class="field-error">{{ errors.confirmPassword }}</span>
            </div>

            <button type="submit" class="submit-btn" :disabled="authStore.loading">
              <span v-if="authStore.loading" class="btn-spinner"></span>
              <span v-else>Create Account</span>
            </button>
          </form>

          <p class="auth-switch">
            Already have an account?
            <router-link to="/login">Sign in here</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
}

.auth-split {
  display: flex;
  width: 100%;
}

.auth-visual {
  flex: 1;
  position: relative;
  display: none;
}

.auth-visual img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.visual-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(237,41,57,0.8) 0%, rgba(0,0,0,0.4) 100%);
  display: flex;
  align-items: flex-end;
  padding: 3rem;
}

.visual-content {
  color: #fff;
}

.visual-content h2 {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 2.5rem;
  margin: 0 0 0.75rem;
  color: #FFD700;
}

.visual-content p {
  color: rgba(255,255,255,0.85);
  font-size: 1rem;
  line-height: 1.6;
  max-width: 360px;
}

.auth-form-wrap {
  width: 100%;
  max-width: 480px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1.5rem;
  background: #fff;
}

.auth-form-inner {
  width: 100%;
  max-width: 380px;
}

.auth-logo {
  display: block;
  text-decoration: none;
  color: #002395;
  font-weight: 700;
  font-size: 1rem;
  margin-bottom: 2.5rem;
}

.form-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 1.9rem;
  color: #1a1a2e;
  margin: 0 0 0.4rem;
}

.form-subtitle {
  color: #888;
  font-size: 0.9rem;
  margin: 0 0 2rem;
}

.alert-error {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  margin-bottom: 1.25rem;
}

.field {
  margin-bottom: 1rem;
}

.field label {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.4rem;
}

.field input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1.5px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.95rem;
  font-family: inherit;
  background: #fff;
  transition: border-color 0.2s, box-shadow 0.2s;
  box-sizing: border-box;
  color: #1a1a2e;
}

.field input::placeholder { color: #aaa; }

.field input:focus {
  outline: none;
  border-color: #002395;
  box-shadow: 0 0 0 3px rgba(0,35,149,0.1);
}

.has-error input {
  border-color: #ef4444;
}

.has-error input:focus {
  box-shadow: 0 0 0 3px rgba(239,68,68,0.1);
}

.field-error {
  display: block;
  color: #ef4444;
  font-size: 0.78rem;
  margin-top: 0.3rem;
  min-height: 1rem;
}

.submit-btn {
  width: 100%;
  background: #ED2939;
  color: #fff;
  border: none;
  padding: 0.875rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
}

.submit-btn:hover:not(:disabled) { background: #c82231; }
.submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }

.btn-spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255,255,255,0.4);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.auth-switch {
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.875rem;
  color: #666;
}

.auth-switch a {
  color: #002395;
  font-weight: 600;
  text-decoration: none;
}

.auth-switch a:hover { text-decoration: underline; }

@media (min-width: 768px) {
  .auth-visual {
    display: block;
    max-width: 55%;
  }
}
</style>
