<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuizStore } from '../stores/quiz'
import { useAuthStore } from '../stores/auth'

const route = useRoute()
const router = useRouter()
const quizStore = useQuizStore()
const authStore = useAuthStore()

const currentIndex = ref(0)
const selectedAnswer = ref<string | null>(null)
const showFeedback = ref(false)
const answers = ref<{ questionId: string; selected: string; correct: string; isCorrect: boolean }[]>([])
const quizCompleted = ref(false)
const saving = ref(false)

const quiz = computed(() => quizStore.currentQuiz)
const questions = computed(() => quizStore.currentQuestions)
const currentQuestion = computed(() => questions.value[currentIndex.value])
const progress = computed(() => ((currentIndex.value) / (questions.value.length || 1)) * 100)

const score = computed(() => answers.value.filter(a => a.isCorrect).length)
const scorePercent = computed(() => Math.round((score.value / questions.value.length) * 100))

function getOptionClass(optionId: string) {
  if (!showFeedback.value) {
    return selectedAnswer.value === optionId ? 'selected' : ''
  }
  if (optionId === currentQuestion.value?.correct_answer) return 'correct'
  if (selectedAnswer.value === optionId && optionId !== currentQuestion.value?.correct_answer) return 'wrong'
  return ''
}

function selectAnswer(optionId: string) {
  if (showFeedback.value) return
  selectedAnswer.value = optionId
  showFeedback.value = true

  const isCorrect = optionId === currentQuestion.value?.correct_answer
  answers.value.push({
    questionId: currentQuestion.value?.id ?? '',
    selected: optionId,
    correct: currentQuestion.value?.correct_answer ?? '',
    isCorrect,
  })
}

async function next() {
  if (currentIndex.value < questions.value.length - 1) {
    currentIndex.value++
    selectedAnswer.value = null
    showFeedback.value = false
  } else {
    quizCompleted.value = true
    await submitScore()
  }
}

async function submitScore() {
  if (!authStore.user) return
  saving.value = true
  try {
    await quizStore.saveScore(authStore.user.id, quiz.value!.id, score.value, questions.value.length)
  } catch {
    // score save failure is non-blocking
  } finally {
    saving.value = false
  }
}

function getScoreMessage() {
  if (scorePercent.value >= 90) return 'Magnifique! You\'re a France expert!'
  if (scorePercent.value >= 70) return 'Très bien! Great knowledge of France!'
  if (scorePercent.value >= 50) return 'Pas mal! Keep exploring and try again!'
  return 'Keep learning — France has so much to offer!'
}

onMounted(() => {
  quizStore.fetchQuiz(route.params.id as string)
})
</script>

<template>
  <div class="quiz-page">
    <div v-if="quizStore.loading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading quiz…</p>
    </div>

    <template v-else-if="quiz">
      <!-- Results Screen -->
      <div v-if="quizCompleted" class="results-screen">
        <div class="results-card">
          <div class="results-icon" :class="{ great: scorePercent >= 70, ok: scorePercent >= 50 && scorePercent < 70 }">
            {{ scorePercent >= 70 ? '🏆' : scorePercent >= 50 ? '👍' : '📚' }}
          </div>
          <h1 class="results-title">Quiz Complete!</h1>
          <p class="results-subtitle">{{ quiz.title }}</p>

          <div class="score-display">
            <div class="score-circle" :class="{ great: scorePercent >= 70, ok: scorePercent >= 50 && scorePercent < 70 }">
              <span class="score-num">{{ score }}</span>
              <span class="score-sep">/</span>
              <span class="score-total">{{ questions.length }}</span>
            </div>
            <div class="score-percent">{{ scorePercent }}%</div>
          </div>

          <p class="score-message">{{ getScoreMessage() }}</p>

          <p v-if="saving" class="saving-note">Saving score…</p>

          <div class="results-breakdown">
            <h3>Your Answers</h3>
            <div v-for="(ans, i) in answers" :key="i" class="answer-row" :class="{ correct: ans.isCorrect, wrong: !ans.isCorrect }">
              <span class="answer-status">{{ ans.isCorrect ? '✓' : '✗' }}</span>
              <span class="answer-q">{{ questions[i]?.question_text }}</span>
            </div>
          </div>

          <div class="results-actions">
            <button class="btn-retry" @click="router.push('/quizzes')">Back to Quizzes</button>
            <button class="btn-primary" @click="router.push('/regions')">Explore Regions</button>
          </div>
        </div>
      </div>

      <!-- Quiz Screen -->
      <div v-else class="quiz-screen">
        <div class="quiz-header">
          <div class="quiz-header-inner">
            <button class="back-btn" @click="router.push('/quizzes')">← Quizzes</button>
            <div class="quiz-info">
              <h2 class="quiz-title">{{ quiz.title }}</h2>
              <span class="question-counter">Question {{ currentIndex + 1 }} of {{ questions.length }}</span>
            </div>
            <div class="progress-wrap">
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: progress + '%' }"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="quiz-body">
          <div class="question-card" v-if="currentQuestion">
            <p class="question-number">Question {{ currentIndex + 1 }}</p>
            <h2 class="question-text">{{ currentQuestion.question_text }}</h2>

            <div class="options-list">
              <button
                v-for="option in currentQuestion.options"
                :key="option.id"
                class="option-btn"
                :class="getOptionClass(option.id)"
                @click="selectAnswer(option.id)"
              >
                <span class="option-letter">{{ option.id.toUpperCase() }}</span>
                <span class="option-text">{{ option.text }}</span>
                <span v-if="showFeedback && option.id === currentQuestion.correct_answer" class="option-check">✓</span>
                <span v-if="showFeedback && selectedAnswer === option.id && option.id !== currentQuestion.correct_answer" class="option-check">✗</span>
              </button>
            </div>

            <div v-if="showFeedback" class="feedback-bar" :class="{ correct: selectedAnswer === currentQuestion.correct_answer, wrong: selectedAnswer !== currentQuestion.correct_answer }">
              <span v-if="selectedAnswer === currentQuestion.correct_answer">Correct! Well done.</span>
              <span v-else>The correct answer was: <strong>{{ currentQuestion.options.find(o => o.id === currentQuestion.correct_answer)?.text }}</strong></span>
            </div>

            <button v-if="showFeedback" class="next-btn" @click="next">
              {{ currentIndex < questions.length - 1 ? 'Next Question →' : 'See Results →' }}
            </button>
          </div>
        </div>
      </div>
    </template>

    <div v-else class="not-found">
      <h2>Quiz not found</h2>
      <button @click="router.push('/quizzes')">Back to Quizzes</button>
    </div>
  </div>
</template>

<style scoped>
.quiz-page { min-height: 100vh; background: #F8F5F0; }

/* Loading */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  color: #888;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #eee;
  border-top-color: #002395;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin { to { transform: rotate(360deg); } }

/* Quiz Header */
.quiz-header {
  background: #002395;
  padding: 1rem 0;
  position: sticky;
  top: 64px;
  z-index: 10;
}

.quiz-header-inner {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.back-btn {
  background: none;
  border: none;
  color: rgba(255,255,255,0.7);
  font-size: 0.85rem;
  cursor: pointer;
  padding: 0;
  margin-bottom: 0.5rem;
  transition: color 0.2s;
}

.back-btn:hover { color: #fff; }

.quiz-info {
  display: flex;
  align-items: baseline;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.quiz-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 1.3rem;
  color: #fff;
  margin: 0;
}

.question-counter {
  color: rgba(255,255,255,0.6);
  font-size: 0.82rem;
}

.progress-bar {
  height: 4px;
  background: rgba(255,255,255,0.2);
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #FFD700;
  border-radius: 2px;
  transition: width 0.4s ease;
}

/* Quiz Body */
.quiz-body {
  max-width: 800px;
  margin: 0 auto;
  padding: 2.5rem 1.5rem 6rem;
}

.question-card {
  background: #fff;
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.06);
}

.question-number {
  font-size: 0.78rem;
  color: #ED2939;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin: 0 0 0.75rem;
}

.question-text {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(1.1rem, 2.5vw, 1.5rem);
  color: #1a1a2e;
  margin: 0 0 2rem;
  line-height: 1.45;
}

.options-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.option-btn {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  background: #fff;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s;
  width: 100%;
}

.option-btn:hover:not(:disabled) {
  border-color: #002395;
  background: #F0F4FF;
}

.option-btn.selected {
  border-color: #002395;
  background: #F0F4FF;
}

.option-btn.correct {
  border-color: #22c55e;
  background: #f0fdf4;
}

.option-btn.wrong {
  border-color: #ef4444;
  background: #fef2f2;
}

.option-letter {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.85rem;
  color: #555;
  flex-shrink: 0;
}

.option-btn.correct .option-letter {
  background: #22c55e;
  color: #fff;
}

.option-btn.wrong .option-letter {
  background: #ef4444;
  color: #fff;
}

.option-text {
  flex: 1;
  font-size: 0.95rem;
  color: #333;
}

.option-check {
  font-size: 1.1rem;
  font-weight: 700;
}

.option-btn.correct .option-check { color: #22c55e; }
.option-btn.wrong .option-check { color: #ef4444; }

.feedback-bar {
  padding: 0.875rem 1.25rem;
  border-radius: 10px;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
}

.feedback-bar.correct {
  background: #f0fdf4;
  color: #15803d;
  border: 1px solid #bbf7d0;
}

.feedback-bar.wrong {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

.next-btn {
  background: #002395;
  color: #fff;
  border: none;
  padding: 0.875rem 2rem;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  transition: background 0.2s;
}

.next-btn:hover { background: #001a7a; }

/* Results */
.results-screen {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 3rem 1.5rem 6rem;
  min-height: calc(100vh - 64px);
}

.results-card {
  background: #fff;
  border-radius: 24px;
  padding: 3rem 2.5rem;
  max-width: 600px;
  width: 100%;
  box-shadow: 0 8px 32px rgba(0,0,0,0.08);
  text-align: center;
}

.results-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  display: block;
}

.results-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 2rem;
  color: #1a1a2e;
  margin: 0 0 0.25rem;
}

.results-subtitle {
  color: #888;
  font-size: 0.9rem;
  margin: 0 0 2rem;
}

.score-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1rem;
}

.score-circle {
  background: #f5f5f5;
  border-radius: 50%;
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  margin-bottom: 0.5rem;
  border: 4px solid #e5e5e5;
}

.score-circle.great {
  border-color: #22c55e;
  background: #f0fdf4;
}

.score-circle.ok {
  border-color: #f59e0b;
  background: #fffbeb;
}

.score-num {
  font-size: 2rem;
  font-weight: 700;
  color: #1a1a2e;
}

.score-sep {
  font-size: 1.25rem;
  color: #888;
}

.score-total {
  font-size: 1.25rem;
  color: #888;
}

.score-percent {
  font-size: 1.5rem;
  font-weight: 700;
  color: #002395;
}

.score-message {
  color: #555;
  font-size: 0.95rem;
  margin: 0.5rem 0 1.5rem;
  font-style: italic;
}

.saving-note {
  font-size: 0.82rem;
  color: #888;
  margin: 0 0 1.5rem;
}

.results-breakdown {
  text-align: left;
  margin-bottom: 2rem;
}

.results-breakdown h3 {
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #888;
  margin: 0 0 0.75rem;
}

.answer-row {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.6rem 0;
  border-bottom: 1px solid #f5f5f5;
}

.answer-status {
  font-weight: 700;
  font-size: 0.9rem;
  width: 16px;
  flex-shrink: 0;
}

.answer-row.correct .answer-status { color: #22c55e; }
.answer-row.wrong .answer-status { color: #ef4444; }

.answer-q {
  font-size: 0.85rem;
  color: #555;
  line-height: 1.5;
}

.results-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn-retry {
  flex: 1;
  background: #f5f5f5;
  border: none;
  padding: 0.875rem 1.5rem;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  color: #333;
}

.btn-retry:hover { background: #ebebeb; }

.btn-primary {
  flex: 1;
  background: #002395;
  color: #fff;
  border: none;
  padding: 0.875rem 1.5rem;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-primary:hover { background: #001a7a; }

.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  gap: 1rem;
}
</style>
