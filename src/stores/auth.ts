import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { AuthUser } from '../types'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser | null>(null)
  const initialized = ref(false)
  const loading = ref(false)
  const error = ref<string | null>(null)

  function getToken(): string | null {
    return localStorage.getItem('auth_token')
  }

  function setToken(token: string) {
    localStorage.setItem('auth_token', token)
  }

  function clearToken() {
    localStorage.removeItem('auth_token')
  }

  async function initialize() {
    const token = getToken()
    if (token) {
      try {
        const res = await fetch(`${API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (res.ok) {
          const { user: u } = await res.json()
          user.value = {
            id: u.id,
            email: u.email,
            profile: { id: u.id, username: u.username, role: u.role, created_at: u.created_at }
          }
        } else {
          clearToken()
        }
      } catch {
        clearToken()
      }
    }
    initialized.value = true
  }

  async function register(email: string, password: string, username: string) {
    loading.value = true
    error.value = null
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, username })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Registration failed')

      setToken(data.token)
      user.value = {
        id: data.user.id,
        email: data.user.email,
        profile: { id: data.user.id, username: data.user.username, role: data.user.role, created_at: new Date().toISOString() }
      }
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Registration failed'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function login(email: string, password: string) {
    loading.value = true
    error.value = null
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Login failed')

      setToken(data.token)
      user.value = {
        id: data.user.id,
        email: data.user.email,
        profile: { id: data.user.id, username: data.user.username, role: data.user.role, created_at: new Date().toISOString() }
      }
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Login failed'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    clearToken()
    user.value = null
  }

  function clearError() {
    error.value = null
  }

  return { user, initialized, loading, error, initialize, register, login, logout, clearError }
})