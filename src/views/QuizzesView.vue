<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useQuizStore } from '../stores/quiz'
import QuizCard from '../components/QuizCard.vue'

const quizStore = useQuizStore()
const searchQuery = ref('')
const selectedDifficulty = ref<'all' | 'easy' | 'medium' | 'hard'>('all')

const filteredQuizzes = computed(() => {
  let filtered = quizStore.quizzes

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    filtered = filtered.filter(quiz =>
      quiz.title.toLowerCase().includes(q) ||
      quiz.description.toLowerCase().includes(q)
    )
  }

  if (selectedDifficulty.value !== 'all') {
    filtered = filtered.filter(quiz => quiz.difficulty === selectedDifficulty.value)
  }

  return filtered
})

onMounted(() => {
  quizStore.fetchQuizzes()
})
</script>

<template>
  <div class="quizzes-page">
    <div class="page-hero">
      <div class="page-hero-bg">
        <img src="https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=1920" alt="Paris" />
        <div class="page-hero-overlay"></div>
      </div>
      <div class="page-hero-content">
        <p class="overline">Test your knowledge</p>
        <h1>Interactive Quizzes</h1>
        <p>Challenge yourself with quizzes on landmarks, cuisine, history and more.</p>
      </div>
    </div>

    <div class="page-content">
      <div class="container">
        <div v-if="quizStore.loading" class="loading-state">
          <div class="spinner"></div>
          <p>Loading quizzes…</p>
        </div>

        <div v-else>
          <div class="quizzes-intro">
            <p>Select a quiz below to begin. Your score will be saved to your profile automatically.</p>
          </div>

          <!-- Filters -->
          <div class="filters-bar">
            <div class="search-box">
              <span class="search-icon">🔍</span>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search quizzes..."
                class="search-input"
              />
            </div>
            <div class="difficulty-filter">
              <button
                v-for="level in ['all', 'easy', 'medium', 'hard']"
                :key="level"
                :class="{ active: selectedDifficulty === level }"
                class="filter-btn"
                @click="selectedDifficulty = level as any"
              >
                {{ level === 'all' ? 'All Levels' : level.charAt(0).toUpperCase() + level.slice(1) }}
              </button>
            </div>
          </div>

          <!-- Results -->
          <div v-if="filteredQuizzes.length === 0" class="no-results">
            <p>No quizzes match your filters. Try adjusting your search.</p>
            <button class="reset-btn" @click="searchQuery = ''; selectedDifficulty = 'all'">Reset Filters</button>
          </div>

          <div v-else class="quizzes-grid">
            <QuizCard v-for="quiz in filteredQuizzes" :key="quiz.id" :quiz="quiz" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.quizzes-page { min-height: 100vh; }

.page-hero {
  position: relative;
  height: 340px;
  display: flex;
  align-items: flex-end;
  padding-bottom: 3rem;
}

.page-hero-bg {
  position: absolute;
  inset: 0;
}

.page-hero-bg img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.page-hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(237,41,57,0.3) 100%);
}

.page-hero-content {
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  color: #fff;
}

.page-hero-content h1 {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(2rem, 4vw, 3rem);
  margin: 0.25rem 0 0.75rem;
}

.page-hero-content p {
  color: rgba(255,255,255,0.85);
  font-size: 1rem;
  margin: 0;
}

.overline {
  font-size: 0.75rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  font-weight: 700;
  color: #FFD700;
  margin: 0;
}

.page-content {
  padding: 4rem 0 6rem;
  background: #F8F5F0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.quizzes-intro {
  margin-bottom: 2rem;
}

.quizzes-intro p {
  color: #666;
  font-size: 0.95rem;
}

.filters-bar {
  background: #fff;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  display: flex;
  gap: 1.5rem;
  align-items: center;
  flex-wrap: wrap;
}

.search-box {
  flex: 1;
  min-width: 250px;
  position: relative;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1rem;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1.5px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.9rem;
  transition: border-color 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #002395;
  box-shadow: 0 0 0 3px rgba(0,35,149,0.1);
}

.difficulty-filter {
  display: flex;
  gap: 0.5rem;
}

.filter-btn {
  padding: 0.6rem 1rem;
  border: 1.5px solid #d1d5db;
  background: #fff;
  color: #666;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-btn:hover {
  border-color: #002395;
  color: #002395;
}

.filter-btn.active {
  background: #002395;
  color: #fff;
  border-color: #002395;
}

.no-results {
  background: #fff;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  color: #888;
}

.reset-btn {
  display: inline-block;
  background: #002395;
  color: #fff;
  border: none;
  padding: 0.6rem 1.25rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1rem;
}

.reset-btn:hover {
  background: #001a7a;
}

.quizzes-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.loading-state {
  text-align: center;
  padding: 4rem;
  color: #888;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #eee;
  border-top-color: #ED2939;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin { to { transform: rotate(360deg); } }

@media (max-width: 1024px) {
  .quizzes-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 768px) {
  .filters-bar {
    flex-direction: column;
    gap: 1rem;
  }

  .search-box {
    min-width: unset;
  }

  .difficulty-filter {
    width: 100%;
    flex-wrap: wrap;
  }
}

@media (max-width: 600px) {
  .quizzes-grid { grid-template-columns: 1fr; }

  .filter-btn {
    flex: 1;
    min-width: 80px;
  }
}
</style>
