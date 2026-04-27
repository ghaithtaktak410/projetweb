<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useQuizStore } from '../stores/quiz'

const quizStore = useQuizStore()
const selectedQuiz = ref<string>('all')

const leaderboardData = computed(() => {
  const scoreMap: Record<string, { username: string; total: number; attempts: number; percentage: number }> = {}

  for (const score of quizStore.scores) {
    if (selectedQuiz.value !== 'all' && score.quiz_id !== selectedQuiz.value) continue

    const username = (score as any).profiles?.username ?? 'Anonymous'
    if (!scoreMap[username]) {
      scoreMap[username] = { username, total: 0, attempts: 0, percentage: 0 }
    }

    scoreMap[username].total += score.score
    scoreMap[username].attempts += 1
  }

  return Object.values(scoreMap)
    .map(item => ({
      ...item,
      percentage: Math.round((item.total / (item.attempts * 4)) * 100)
    }))
    .sort((a, b) => b.percentage - a.percentage)
})

onMounted(() => {
  quizStore.fetchAllScores()
  quizStore.fetchQuizzes()
})
</script>

<template>
  <div class="leaderboard-page">
    <div class="leaderboard-header">
      <div class="leaderboard-header-inner">
        <h1>🏆 Leaderboard</h1>
        <p>Top performers in French culture quizzes</p>
      </div>
    </div>

    <div class="leaderboard-container">
      <!-- Quiz Filter -->
      <div class="filter-section">
        <select v-model="selectedQuiz" class="quiz-filter">
          <option value="all">All Quizzes</option>
          <option v-for="quiz in quizStore.quizzes" :key="quiz.id" :value="quiz.id">
            {{ quiz.title }}
          </option>
        </select>
      </div>

      <!-- Leaderboard Table -->
      <div v-if="quizStore.loading" class="loading">
        <div class="spinner"></div>
        <p>Loading leaderboard…</p>
      </div>

      <div v-else-if="leaderboardData.length === 0" class="empty-state">
        <p>No scores yet. Be the first to take a quiz!</p>
      </div>

      <div v-else class="leaderboard-table-wrap">
        <table class="leaderboard-table">
          <thead>
            <tr>
              <th class="rank">Rank</th>
              <th class="player">Player</th>
              <th class="attempts">Attempts</th>
              <th class="score">Total Points</th>
              <th class="percentage">Avg Score</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(entry, idx) in leaderboardData" :key="entry.username" :class="{ top: idx < 3 }">
              <td class="rank">
                <span v-if="idx === 0" class="medal">🥇</span>
                <span v-else-if="idx === 1" class="medal">🥈</span>
                <span v-else-if="idx === 2" class="medal">🥉</span>
                <span v-else class="rank-num">#{{ idx + 1 }}</span>
              </td>
              <td class="player">{{ entry.username }}</td>
              <td class="attempts">{{ entry.attempts }}</td>
              <td class="score">{{ entry.total }}</td>
              <td class="percentage">
                <span class="score-badge" :class="{ great: entry.percentage >= 70, ok: entry.percentage >= 50 }">
                  {{ entry.percentage }}%
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.leaderboard-page {
  min-height: 100vh;
  background: #F8F5F0;
  padding-top: 64px;
}

.leaderboard-header {
  background: linear-gradient(135deg, #FFD700 0%, #ED2939 100%);
  color: #1a1a2e;
  padding: 3rem 0;
}

.leaderboard-header-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.leaderboard-header h1 {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 2.5rem;
  margin: 0 0 0.5rem;
}

.leaderboard-header p {
  font-size: 1rem;
  opacity: 0.85;
  margin: 0;
}

.leaderboard-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 1.5rem 4rem;
}

.filter-section {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
}

.quiz-filter {
  padding: 0.75rem 1rem;
  border: 1.5px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.95rem;
  font-family: inherit;
  background: #fff;
  cursor: pointer;
  transition: border-color 0.2s;
}

.quiz-filter:focus {
  outline: none;
  border-color: #002395;
  box-shadow: 0 0 0 3px rgba(0,35,149,0.1);
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #eee;
  border-top-color: #FFD700;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin { to { transform: rotate(360deg); } }

.empty-state {
  background: #fff;
  border-radius: 12px;
  padding: 3rem;
  text-align: center;
  color: #888;
  font-size: 1rem;
}

.leaderboard-table-wrap {
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  border: 1px solid #e5e7eb;
}

.leaderboard-table {
  width: 100%;
  border-collapse: collapse;
}

.leaderboard-table thead {
  background: linear-gradient(to right, #002395, #1a1a60);
  color: #fff;
}

.leaderboard-table th {
  padding: 1.25rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.9rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.leaderboard-table td {
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #f0f0f0;
}

.leaderboard-table tbody tr {
  transition: background 0.2s;
}

.leaderboard-table tbody tr:hover {
  background: #f9f9f9;
}

.leaderboard-table tbody tr.top {
  background: #fffbeb;
}

.leaderboard-table tbody tr.top:hover {
  background: #fef3c7;
}

.rank {
  width: 80px;
  font-weight: 600;
}

.medal {
  font-size: 1.25rem;
}

.rank-num {
  color: #888;
  font-weight: 600;
}

.player {
  font-weight: 600;
  color: #1a1a2e;
  min-width: 150px;
}

.attempts {
  text-align: center;
  color: #666;
}

.score {
  text-align: center;
  font-weight: 600;
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 1.1rem;
}

.percentage {
  text-align: center;
}

.score-badge {
  display: inline-block;
  padding: 0.3rem 0.75rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.85rem;
  background: #e5e7eb;
  color: #666;
}

.score-badge.great {
  background: #d1fae5;
  color: #065f46;
}

.score-badge.ok {
  background: #fef3c7;
  color: #92400e;
}

@media (max-width: 768px) {
  .leaderboard-table {
    font-size: 0.85rem;
  }

  .leaderboard-table th,
  .leaderboard-table td {
    padding: 0.75rem 0.5rem;
  }

  .rank { width: 60px; }

  .player {
    min-width: 100px;
  }
}
</style>
