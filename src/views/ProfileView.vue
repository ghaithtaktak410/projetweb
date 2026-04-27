<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useQuizStore } from '../stores/quiz'

const authStore = useAuthStore()
const quizStore = useQuizStore()

const user = computed(() => authStore.user)
const scores = computed(() => quizStore.scores)

const stats = computed(() => {
  if (scores.value.length === 0) {
    return { totalQuizzes: 0, averageScore: 0, bestScore: 0, lastAttempt: null }
  }

  const totalQuizzes = scores.value.length
  const averageScore = Math.round(
    scores.value.reduce((sum, s) => sum + (s.score / s.total_questions) * 100, 0) / totalQuizzes
  )
  const bestScore = Math.max(...scores.value.map(s => (s.score / s.total_questions) * 100))
  const lastAttempt = scores.value[0]?.completed_at

  return { totalQuizzes, averageScore, bestScore, lastAttempt }
})

onMounted(() => {
  if (user.value) {
    quizStore.fetchUserScores(user.value.id)
  }
})
</script>

<template>
  <div v-if="user" class="profile-page">
    <div class="profile-header">
      <div class="profile-header-inner">
        <div class="profile-avatar">{{ user.profile?.username?.charAt(0)?.toUpperCase() || 'U' }}</div>
        <div class="profile-info">
          <h1>{{ user.profile?.username || user.email }}</h1>
          <p class="profile-role" :class="user.profile?.role">{{ user.profile?.role || 'student' }}</p>
          <p class="profile-email">{{ user.email }}</p>
        </div>
      </div>
    </div>

    <div class="profile-container">
      <!-- Stats Grid -->
      <div class="stats-section">
        <div class="stat-card">
          <div class="stat-icon">📊</div>
          <div class="stat-content">
            <span class="stat-value">{{ stats.totalQuizzes }}</span>
            <span class="stat-label">Quizzes Taken</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">⭐</div>
          <div class="stat-content">
            <span class="stat-value">{{ stats.averageScore }}%</span>
            <span class="stat-label">Average Score</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🏆</div>
          <div class="stat-content">
            <span class="stat-value">{{ stats.bestScore }}%</span>
            <span class="stat-label">Best Score</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">⏱️</div>
          <div class="stat-content">
            <span class="stat-value">{{ stats.lastAttempt ? new Date(stats.lastAttempt).toLocaleDateString() : '—' }}</span>
            <span class="stat-label">Last Attempt</span>
          </div>
        </div>
      </div>

      <!-- Score History -->
      <div class="history-section">
        <h2>Quiz History</h2>

        <div v-if="quizStore.loading" class="loading">Loading scores…</div>
        <div v-else-if="scores.length === 0" class="empty-state">
          <div class="empty-icon">🎯</div>
          <h3>No Quizzes Yet</h3>
          <p>Start taking quizzes to build your learning record!</p>
          <router-link to="/quizzes" class="btn-start">Browse Quizzes</router-link>
        </div>

        <div v-else class="scores-table-wrap">
          <table class="scores-table">
            <thead>
              <tr>
                <th>Quiz</th>
                <th>Difficulty</th>
                <th>Score</th>
                <th>Percentage</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="score in scores" :key="score.id">
                <td class="quiz-name">{{ (score as any).quizzes?.title ?? 'Unknown' }}</td>
                <td>
                  <span class="difficulty-badge" :class="(score as any).quizzes?.difficulty">
                    {{ (score as any).quizzes?.difficulty || '—' }}
                  </span>
                </td>
                <td>{{ score.score }}/{{ score.total_questions }}</td>
                <td>
                  <span class="score-badge" :class="{ great: Math.round((score.score / score.total_questions) * 100) >= 70, ok: Math.round((score.score / score.total_questions) * 100) >= 50 }">
                    {{ Math.round((score.score / score.total_questions) * 100) }}%
                  </span>
                </td>
                <td class="date-cell">{{ new Date(score.completed_at).toLocaleDateString() }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-page {
  min-height: 100vh;
  background: #F8F5F0;
  padding-top: 64px;
}

.profile-header {
  background: linear-gradient(135deg, #002395 0%, #1a1a60 100%);
  color: #fff;
  padding: 3rem 0;
}

.profile-header-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  align-items: center;
  gap: 2rem;
}

.profile-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: rgba(255,255,255,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: 700;
  color: #FFD700;
  border: 3px solid rgba(255,255,255,0.3);
}

.profile-info h1 {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 2rem;
  margin: 0 0 0.5rem;
}

.profile-role {
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 99px;
  background: rgba(255,255,255,0.15);
  margin: 0 0 0.5rem;
}

.profile-role.admin {
  background: #FFD700;
  color: #002395;
}

.profile-email {
  color: rgba(255,255,255,0.7);
  font-size: 0.9rem;
  margin: 0;
}

.profile-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem 4rem;
}

.stats-section {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.stat-card {
  background: #fff;
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  gap: 1rem;
  align-items: center;
  border: 1px solid #e5e7eb;
  transition: all 0.3s;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 28px rgba(0,0,0,0.08);
}

.stat-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.stat-content {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: #002395;
  line-height: 1;
}

.stat-label {
  font-size: 0.8rem;
  color: #888;
  margin-top: 0.3rem;
  font-weight: 500;
}

.history-section {
  background: #fff;
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid #e5e7eb;
}

.history-section h2 {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 1.5rem;
  color: #1a1a2e;
  margin-top: 0 0 1.5rem;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: #888;
}

.empty-state {
  text-align: center;
  padding: 3rem 2rem;
  color: #888;
}

.empty-icon {
  font-size: 3rem;
  display: block;
  margin-bottom: 1rem;
}

.empty-state h3 {
  font-family: 'Playfair Display', Georgia, serif;
  color: #1a1a2e;
  margin: 0 0 0.5rem;
}

.empty-state p {
  margin: 0 0 1.5rem;
}

.btn-start {
  display: inline-block;
  background: #002395;
  color: #fff !important;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  transition: background 0.2s;
}

.btn-start:hover {
  background: #001a7a;
}

.scores-table-wrap {
  overflow-x: auto;
}

.scores-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.scores-table th {
  background: #f5f5f5;
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #555;
  border-bottom: 2px solid #e5e7eb;
}

.scores-table td {
  padding: 1rem;
  border-bottom: 1px solid #f5f5f5;
}

.scores-table tbody tr:hover {
  background: #f9f9f9;
}

.quiz-name {
  font-weight: 600;
  color: #1a1a2e;
}

.difficulty-badge {
  font-size: 0.75rem;
  padding: 0.25rem 0.6rem;
  border-radius: 99px;
  font-weight: 600;
  text-transform: uppercase;
}

.difficulty-badge.easy {
  background: #d1fae5;
  color: #065f46;
}

.difficulty-badge.medium {
  background: #fef3c7;
  color: #92400e;
}

.difficulty-badge.hard {
  background: #fee2e2;
  color: #991b1b;
}

.score-badge {
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
}

.score-badge.great {
  color: #22c55e;
  background: #f0fdf4;
}

.score-badge.ok {
  color: #f59e0b;
  background: #fffbeb;
}

.date-cell {
  color: #888;
  font-size: 0.85rem;
}

@media (max-width: 1024px) {
  .stats-section {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .profile-header-inner {
    flex-direction: column;
    text-align: center;
  }

  .stats-section {
    grid-template-columns: 1fr;
  }

  .scores-table-wrap {
    font-size: 0.8rem;
  }

  .scores-table th,
  .scores-table td {
    padding: 0.75rem 0.5rem;
  }
}
</style>
