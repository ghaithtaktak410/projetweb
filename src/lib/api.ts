import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// =============== REGIONS ===============

export async function fetchRegions() {
  try {
    const { data } = await api.get('/regions')
    return data
  } catch (error) {
    console.error('Error fetching regions:', error)
    throw error
  }
}

export async function fetchRegion(id: string) {
  try {
    const { data } = await api.get(`/regions/${id}`)
    return data
  } catch (error) {
    console.error('Error fetching region:', error)
    throw error
  }
}

export async function createRegion(region: { name: string; description: string; image_url?: string; highlights?: string[] }) {
  try {
    const { data } = await api.post('/regions', region)
    return data
  } catch (error) {
    console.error('Error creating region:', error)
    throw error
  }
}

export async function updateRegion(id: string, region: { name: string; description: string; image_url?: string; highlights?: string[] }) {
  try {
    const { data } = await api.put(`/regions/${id}`, region)
    return data
  } catch (error) {
    console.error('Error updating region:', error)
    throw error
  }
}

export async function deleteRegion(id: string) {
  try {
    const { data } = await api.delete(`/regions/${id}`)
    return data
  } catch (error) {
    console.error('Error deleting region:', error)
    throw error
  }
}

// =============== QUIZZES ===============

export async function fetchQuizzes() {
  try {
    const { data } = await api.get('/quizzes')
    return data
  } catch (error) {
    console.error('Error fetching quizzes:', error)
    throw error
  }
}

export async function fetchQuiz(id: string) {
  try {
    const { data } = await api.get(`/quizzes/${id}`)
    return data
  } catch (error) {
    console.error('Error fetching quiz:', error)
    throw error
  }
}

export async function createQuiz(quiz: {
  title: string
  description: string
  region_id?: string | null
  difficulty?: 'easy' | 'medium' | 'hard'
  questions?: any[]
}) {
  try {
    const { data } = await api.post('/quizzes', quiz)
    return data
  } catch (error) {
    console.error('Error creating quiz:', error)
    throw error
  }
}

export async function updateQuiz(id: string, quiz: {
  title: string
  description: string
  region_id?: string | null
  difficulty?: 'easy' | 'medium' | 'hard'
  questions?: any[]
}) {
  try {
    const { data } = await api.put(`/quizzes/${id}`, quiz)
    return data
  } catch (error) {
    console.error('Error updating quiz:', error)
    throw error
  }
}

export async function deleteQuiz(id: string) {
  try {
    const { data } = await api.delete(`/quizzes/${id}`)
    return data
  } catch (error) {
    console.error('Error deleting quiz:', error)
    throw error
  }
}

// =============== HEALTH CHECK ===============

export async function checkHealth() {
  try {
    const { data } = await api.get('/health')
    return data
  } catch (error) {
    console.error('Error checking health:', error)
    throw error
  }
}
