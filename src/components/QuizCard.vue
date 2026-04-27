<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import type { Quiz } from '../types'

const props = defineProps<{ quiz: Quiz }>()
const router = useRouter()
const authStore = useAuthStore()

const difficultyColor = {
  easy: '#22c55e',
  medium: '#f59e0b',
  hard: '#ef4444',
}

function startQuiz() {
  if (!authStore.user) {
    router.push('/login')
  } else {
    router.push(`/quiz/${props.quiz.id}`)
  }
}
</script>

<template>
  <div class="quiz-card">
    <div class="card-top">
      <div class="difficulty-badge" :style="{ background: difficultyColor[quiz.difficulty] + '20', color: difficultyColor[quiz.difficulty] }">
        {{ quiz.difficulty }}
      </div>
      <span v-if="(quiz as any).regions?.name" class="region-tag">{{ (quiz as any).regions.name }}</span>
    </div>
    <h3 class="card-title">{{ quiz.title }}</h3>
    <p class="card-desc">{{ quiz.description }}</p>
    <button class="start-btn" @click="startQuiz">
      Start Quiz
      <span class="arrow">→</span>
    </button>
  </div>
</template>

<style scoped>
.quiz-card {
  background: #fff;
  border-radius: 16px;
  padding: 1.75rem;
  border: 1px solid #eee;
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.quiz-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 16px 36px rgba(0,0,0,0.09);
}

.card-top {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.difficulty-badge {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 0.25rem 0.7rem;
  border-radius: 99px;
}

.region-tag {
  font-size: 0.78rem;
  color: #888;
  padding: 0.2rem 0.6rem;
  background: #f5f5f5;
  border-radius: 99px;
}

.card-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 1.2rem;
  color: #1a1a2e;
  margin: 0;
}

.card-desc {
  color: #666;
  font-size: 0.875rem;
  line-height: 1.6;
  margin: 0;
  flex: 1;
}

.start-btn {
  background: #002395;
  color: #fff;
  border: none;
  padding: 0.7rem 1.25rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.5rem;
}

.start-btn:hover {
  background: #001a7a;
  padding-right: 1rem;
}

.arrow {
  transition: transform 0.2s;
}

.start-btn:hover .arrow {
  transform: translateX(4px);
}
</style>
