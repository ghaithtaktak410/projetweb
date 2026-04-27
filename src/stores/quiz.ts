import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as apiService from '../lib/api'
import type { Quiz, Question, Region, Score } from '../types'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export const useQuizStore = defineStore('quiz', () => {
  const regions = ref<Region[]>([])
  const quizzes = ref<Quiz[]>([])
  const currentQuiz = ref<Quiz | null>(null)
  const currentQuestions = ref<Question[]>([])
  const scores = ref<Score[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchRegions() {
    loading.value = true
    error.value = null
    try {
      regions.value = await apiService.fetchRegions()
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch regions'
    } finally {
      loading.value = false
    }
  }

  async function fetchQuizzes() {
    loading.value = true
    error.value = null
    try {
      quizzes.value = await apiService.fetchQuizzes()
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch quizzes'
    } finally {
      loading.value = false
    }
  }

  async function fetchQuiz(id: string) {
    loading.value = true
    error.value = null
    try {
      const data = await apiService.fetchQuiz(id)
      currentQuiz.value = data
      currentQuestions.value = data.questions || []
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch quiz'
    } finally {
      loading.value = false
    }
  }

  async function saveScore(userId: string, quizId: string, score: number, total: number) {
    const token = localStorage.getItem('auth_token')
    const res = await fetch(`${API_URL}/scores`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ quiz_id: quizId, score, total_questions: total })
    })
    if (!res.ok) throw new Error('Failed to save score')
    return res.json()
  }

  async function fetchUserScores(userId: string) {
    loading.value = true
    error.value = null
    try {
      const token = localStorage.getItem('auth_token')
      const res = await fetch(`${API_URL}/scores/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!res.ok) throw new Error('Failed to fetch scores')
      scores.value = await res.json()
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch scores'
    } finally {
      loading.value = false
    }
  }

  async function fetchAllScores() {
    loading.value = true
    error.value = null
    try {
      const res = await fetch(`${API_URL}/scores`)
      if (!res.ok) throw new Error('Failed to fetch scores')
      scores.value = await res.json()
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch scores'
    } finally {
      loading.value = false
    }
  }

  async function createRegion(region: Partial<Region>) {
    error.value = null
    try {
      await apiService.createRegion(region as any)
      await fetchRegions()
    } catch (err: any) {
      error.value = err.message || 'Failed to create region'
      throw err
    }
  }

  async function updateRegion(id: string, region: Partial<Region>) {
    error.value = null
    try {
      await apiService.updateRegion(id, region as any)
      await fetchRegions()
    } catch (err: any) {
      error.value = err.message || 'Failed to update region'
      throw err
    }
  }

  async function deleteRegion(id: string) {
    error.value = null
    try {
      await apiService.deleteRegion(id)
      regions.value = regions.value.filter(r => r.id !== id)
    } catch (err: any) {
      error.value = err.message || 'Failed to delete region'
      throw err
    }
  }

  async function createQuiz(quiz: Partial<Quiz>, questions: Partial<Question>[]) {
    error.value = null
    try {
      const payload = {
        ...quiz,
        questions: questions.map(q => ({
          question_text: q.question_text,
          options: q.options,
          correct_answer: q.correct_answer,
        }))
      }
      const result = await apiService.createQuiz(payload as any)
      await fetchQuizzes()
      return result
    } catch (err: any) {
      error.value = err.message || 'Failed to create quiz'
      throw err
    }
  }

  async function updateQuiz(id: string, quiz: Partial<Quiz>, questions: Partial<Question>[]) {
    error.value = null
    try {
      const payload = {
        ...quiz,
        questions: questions.map(q => ({
          question_text: q.question_text,
          options: q.options,
          correct_answer: q.correct_answer,
        }))
      }
      await apiService.updateQuiz(id, payload as any)
      await fetchQuizzes()
    } catch (err: any) {
      error.value = err.message || 'Failed to update quiz'
      throw err
    }
  }

  async function deleteQuiz(id: string) {
    error.value = null
    try {
      await apiService.deleteQuiz(id)
      quizzes.value = quizzes.value.filter(q => q.id !== id)
    } catch (err: any) {
      error.value = err.message || 'Failed to delete quiz'
      throw err
    }
  }

  return {
    regions, quizzes, currentQuiz, currentQuestions, scores, loading, error,
    fetchRegions, fetchQuizzes, fetchQuiz, saveScore, fetchUserScores,
    fetchAllScores, createQuiz, updateQuiz, deleteQuiz,
    createRegion, updateRegion, deleteRegion,
  }
})