<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useQuizStore } from '../stores/quiz'
import { useAuthStore } from '../stores/auth'
import RegionManageForm from '../components/RegionManageForm.vue'
import type { Quiz, Question, Region } from '../types'

const quizStore = useQuizStore()
const authStore = useAuthStore()

const tab = ref<'quizzes' | 'regions' | 'scores'>('quizzes')
const showNewQuizForm = ref(false)
const newQuiz = ref<Partial<Quiz>>({ difficulty: 'medium' })
const newQuestions = ref<Partial<Question>[]>([])
const editingQuizId = ref<string | null>(null)
const newRegion = ref<Region | null>(null)
const editingRegionId = ref<string | null>(null)
const saving = ref(false)
const success = ref('')
const showRegionForm = ref(false)

const userScores = computed(() => {
  const grouped: Record<string, any[]> = {}
  for (const score of quizStore.scores) {
    const qTitle = (score as any).quizzes?.title ?? 'Unknown'
    if (!grouped[qTitle]) grouped[qTitle] = []
    grouped[qTitle].push(score)
  }
  return grouped
})

function addQuestion() {
  newQuestions.value.push({ options: [], correct_answer: '', question_text: '' })
}

function removeQuestion(idx: number) {
  newQuestions.value.splice(idx, 1)
}

function updateQuestionOption(qIdx: number, oIdx: number, field: string, value: any) {
  if (!newQuestions.value[qIdx].options) newQuestions.value[qIdx].options = []
  const opts = newQuestions.value[qIdx].options as any[]
  if (!opts[oIdx]) opts[oIdx] = { id: '', text: '' }
  opts[oIdx][field] = value
}

function addOption(qIdx: number) {
  if (!newQuestions.value[qIdx].options) newQuestions.value[qIdx].options = []
  const opts = newQuestions.value[qIdx].options as any[]
  const ids = ['a', 'b', 'c', 'd']
  const nextId = ids[opts.length] || `opt${opts.length}`
  opts.push({ id: nextId, text: '' })
}

function removeOption(qIdx: number, oIdx: number) {
  const opts = newQuestions.value[qIdx].options as any[]
  opts.splice(oIdx, 1)
}

async function handleSaveQuiz() {
  if (!newQuiz.value.title || !newQuiz.value.description) {
    alert('Please fill in all quiz fields')
    return
  }
  saving.value = true
  try {
    if (editingQuizId.value) {
      await quizStore.updateQuiz(editingQuizId.value, newQuiz.value, newQuestions.value)
    } else {
      await quizStore.createQuiz({ ...newQuiz.value, created_by: authStore.user?.id }, newQuestions.value)
    }
    success.value = editingQuizId.value ? 'Quiz updated!' : 'Quiz created!'
    setTimeout(() => { success.value = '' }, 3000)
    resetForm()
  } catch (e) {
    alert(`Error: ${e instanceof Error ? e.message : 'Unknown error'}`)
  } finally {
    saving.value = false
  }
}

function resetForm() {
  newQuiz.value = { difficulty: 'medium' }
  newQuestions.value = []
  editingQuizId.value = null
  showNewQuizForm.value = false
}

async function editQuiz(quiz: Quiz) {
  // Fetch the full quiz with questions from the API
  await quizStore.fetchQuiz(quiz.id)
  const full = quizStore.currentQuiz as any
  const questions = quizStore.currentQuestions

  editingQuizId.value = quiz.id
  newQuiz.value = {
    title: full.title,
    description: full.description,
    difficulty: full.difficulty,
    region_id: full.region_id ?? null,
  }
  newQuestions.value = questions.map(q => ({
    question_text: q.question_text,
    options: q.options ? [...q.options] : [],
    correct_answer: q.correct_answer,
  }))
  showNewQuizForm.value = true
}

async function deleteQuiz(id: string) {
  if (confirm('Delete this quiz? This cannot be undone.')) {
    await quizStore.deleteQuiz(id)
    success.value = 'Quiz deleted'
    setTimeout(() => { success.value = '' }, 3000)
  }
}

async function handleSaveRegion(regionData: { name: string; description: string; image_url: string; highlights: string[] }) {
  saving.value = true
  try {
    if (editingRegionId.value) {
      await quizStore.updateRegion(editingRegionId.value, regionData as any)
      success.value = 'Region updated!'
    } else {
      await quizStore.createRegion(regionData as any)
      success.value = 'Region created!'
    }
    setTimeout(() => { success.value = '' }, 3000)
    resetRegionForm()
  } catch (e) {
    alert(`Error: ${e instanceof Error ? e.message : 'Unknown error'}`)
  } finally {
    saving.value = false
  }
}

function resetRegionForm() {
  newRegion.value = null
  editingRegionId.value = null
  showRegionForm.value = false
}

function editRegion(region: Region) {
  newRegion.value = { ...region }
  editingRegionId.value = region.id
  showRegionForm.value = true
}

async function deleteRegion(id: string) {
  if (confirm('Delete this region? This cannot be undone.')) {
    try {
      await quizStore.deleteRegion(id)
      success.value = 'Region deleted'
      setTimeout(() => { success.value = '' }, 3000)
    } catch (e) {
      alert(`Error: ${e instanceof Error ? e.message : 'Unknown error'}`)
    }
  }
}

onMounted(() => {
  quizStore.fetchQuizzes()
  quizStore.fetchRegions()
  quizStore.fetchAllScores()
})
</script>

<template>
  <div class="admin-page">
    <div class="admin-header">
      <div class="admin-header-inner">
        <h1>Admin Dashboard</h1>
        <p>Manage quizzes and view student scores</p>
      </div>
    </div>

    <div class="admin-container">
      <div v-if="success" class="alert-success">{{ success }}</div>

      <div class="admin-tabs">
        <button
          class="tab-btn"
          :class="{ active: tab === 'quizzes' }"
          @click="tab = 'quizzes'"
        >
          📋 Quizzes
        </button>
        <button
          class="tab-btn"
          :class="{ active: tab === 'regions' }"
          @click="tab = 'regions'"
        >
          🗺️ Regions
        </button>
        <button
          class="tab-btn"
          :class="{ active: tab === 'scores' }"
          @click="tab = 'scores'"
        >
          📊 Scores
        </button>
      </div>

      <!-- Quizzes Tab -->
      <div v-show="tab === 'quizzes'" class="tab-content">
        <div class="section-header">
          <h2>Manage Quizzes</h2>
          <button
            v-if="!showNewQuizForm"
            class="btn-add"
            @click="showNewQuizForm = true"
          >
            + New Quiz
          </button>
        </div>

        <!-- New Quiz Form -->
        <div v-if="showNewQuizForm" class="quiz-form-card">
          <h3>{{ editingQuizId ? 'Edit Quiz' : 'Create New Quiz' }}</h3>

          <div class="form-grid">
            <input
              v-model="newQuiz.title"
              type="text"
              placeholder="Quiz Title"
              class="form-input"
            />
            <input
              v-model="newQuiz.description"
              type="text"
              placeholder="Description"
              class="form-input"
            />
            <select v-model="newQuiz.difficulty" class="form-input">
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div class="questions-section">
            <h4>Questions ({{ newQuestions.length }})</h4>
            <button class="btn-add-question" @click="addQuestion">+ Add Question</button>

            <div v-for="(q, qi) in newQuestions" :key="qi" class="question-item">
              <div class="question-header">
                <span>Question {{ qi + 1 }}</span>
                <button type="button" class="btn-remove" @click="removeQuestion(qi)">Remove</button>
              </div>

              <input
                v-model="q.question_text"
                type="text"
                placeholder="Question text"
                class="form-input full"
              />

              <div class="options-section">
                <div class="options-header">
                  <label>Answer Options</label>
                  <button
                    v-if="(q.options || []).length < 4"
                    type="button"
                    class="btn-add-option"
                    @click="addOption(qi)"
                  >+ Add Option</button>
                </div>
                <div v-if="(q.options || []).length === 0" class="options-empty">
                  Click "+ Add Option" to add answer choices.
                </div>
                <div v-for="(o, oi) in (q.options || [])" :key="oi" class="option-input-row">
                  <span class="option-label">{{ (o as any).id?.toUpperCase() }}</span>
                  <input
                    :value="(o as any).text"
                    @input="updateQuestionOption(qi, oi, 'text', ($event.target as HTMLInputElement).value)"
                    type="text"
                    :placeholder="`Option ${(o as any).id?.toUpperCase()} text`"
                    class="form-input-sm flex-1"
                  />
                  <label class="correct-checkbox">
                    <input
                      type="radio"
                      :name="`correct-${qi}`"
                      :value="(o as any).id"
                      v-model="q.correct_answer"
                    />
                    Correct
                  </label>
                  <button type="button" class="btn-remove-option" @click="removeOption(qi, oi)">✕</button>
                </div>
              </div>
            </div>
          </div>

          <div class="form-actions">
            <button class="btn-cancel" @click="resetForm">Cancel</button>
            <button class="btn-save" @click="handleSaveQuiz" :disabled="saving">
              {{ saving ? 'Saving...' : 'Save Quiz' }}
            </button>
          </div>
        </div>

        <!-- Quizzes List -->
        <div v-if="!showNewQuizForm" class="quizzes-list">
          <div v-if="quizStore.quizzes.length === 0" class="empty-state">
            No quizzes yet. Create one to get started!
          </div>

          <div v-for="quiz in quizStore.quizzes" :key="quiz.id" class="quiz-item">
            <div class="quiz-info">
              <h4>{{ quiz.title }}</h4>
              <p>{{ quiz.description }}</p>
              <div class="quiz-meta">
                <span class="difficulty" :class="quiz.difficulty">{{ quiz.difficulty }}</span>
                <span v-if="(quiz as any).regions?.name" class="region">{{ (quiz as any).regions.name }}</span>
              </div>
            </div>
            <div class="quiz-actions">
              <button class="btn-edit" @click="editQuiz(quiz)">Edit</button>
              <button class="btn-delete" @click="deleteQuiz(quiz.id)">Delete</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Regions Tab -->
      <div v-show="tab === 'regions'" class="tab-content">
        <div class="section-header">
          <h2>Manage Regions</h2>
          <button
            v-if="!showRegionForm"
            class="btn-add"
            @click="() => { showRegionForm = true; newRegion = null; editingRegionId = null }"
          >
            + New Region
          </button>
        </div>

        <!-- Region Form -->
        <div v-if="showRegionForm" class="region-form-card">
          <h3>{{ editingRegionId ? 'Edit Region' : 'Create New Region' }}</h3>
          <RegionManageForm
            :region="newRegion"
            :is-loading="saving"
            @save="handleSaveRegion"
            @cancel="resetRegionForm"
          />
        </div>

        <!-- Regions List -->
        <div v-if="!showRegionForm" class="regions-list">
          <div v-if="quizStore.regions.length === 0" class="empty-state">
            No regions yet. Create one to get started!
          </div>

          <div v-for="region in quizStore.regions" :key="region.id" class="region-item">
            <div class="region-info">
              <h4>{{ region.name }}</h4>
              <p>{{ region.description }}</p>
              <div class="region-highlights">
                <span v-for="h in region.highlights.slice(0, 3)" :key="h" class="highlight-badge">{{ h }}</span>
              </div>
            </div>
            <div class="region-actions">
              <button class="btn-edit" @click="editRegion(region)">Edit</button>
              <button class="btn-delete" @click="deleteRegion(region.id)">Delete</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Scores Tab -->
      <div v-show="tab === 'scores'" class="tab-content">
        <div class="section-header">
          <h2>Student Scores</h2>
        </div>

        <div v-if="quizStore.loading" class="loading">Loading scores…</div>

        <div v-else-if="Object.keys(userScores).length === 0" class="empty-state">
          No scores recorded yet.
        </div>

        <div v-else class="scores-list">
          <div v-for="(scores, quizTitle) in userScores" :key="quizTitle" class="scores-quiz">
            <h3>{{ quizTitle }}</h3>
            <table class="scores-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Score</th>
                  <th>Percentage</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="score in scores" :key="score.id">
                  <td>{{ (score as any).profiles?.username ?? 'Unknown' }}</td>
                  <td>{{ score.score }}/{{ score.total_questions }}</td>
                  <td>
                    <span :class="{ great: Math.round((score.score / score.total_questions) * 100) >= 70, ok: Math.round((score.score / score.total_questions) * 100) >= 50 }">
                      {{ Math.round((score.score / score.total_questions) * 100) }}%
                    </span>
                  </td>
                  <td>{{ new Date(score.completed_at).toLocaleDateString() }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-page {
  min-height: 100vh;
  background: #F8F5F0;
  padding-top: 64px;
}

.admin-header {
  background: linear-gradient(135deg, #002395 0%, #1a1a60 100%);
  color: #fff;
  padding: 3rem 0;
}

.admin-header-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.admin-header h1 {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 2rem;
  margin: 0 0 0.4rem;
}

.admin-header p {
  color: rgba(255,255,255,0.7);
  margin: 0;
}

.admin-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem 4rem;
}

.alert-success {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  color: #15803d;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  font-weight: 500;
}

.admin-tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid #e5e7eb;
}

.tab-btn {
  background: none;
  border: none;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  color: #888;
  transition: all 0.2s;
}

.tab-btn.active {
  color: #002395;
  border-color: #002395;
}

.tab-content {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
}

.section-header h2 {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 1.5rem;
  margin: 0;
}

.btn-add {
  background: #002395;
  color: #fff;
  border: none;
  padding: 0.6rem 1.25rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

.btn-add:hover { background: #001a7a; }

/* Quiz Form */
.quiz-form-card {
  background: #fff;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.quiz-form-card h3 {
  margin-top: 0;
  font-family: 'Playfair Display', Georgia, serif;
  color: #1a1a2e;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

.form-input, .form-input-sm {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.9rem;
  font-family: inherit;
}

.form-input {
  width: 100%;
  box-sizing: border-box;
}

.form-input.full {
  grid-column: 1 / -1;
  margin-bottom: 1rem;
}

.form-input-sm {
  flex-shrink: 0;
}

.questions-section {
  margin-bottom: 2rem;
}

.questions-section h4 {
  margin-top: 0;
  color: #1a1a2e;
}

.btn-add-question {
  background: #f5f5f5;
  border: 1px solid #d1d5db;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.85rem;
  margin-bottom: 1rem;
}

.btn-add-question:hover {
  background: #ebebeb;
}

.question-item {
  background: #f9f9f9;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  font-weight: 600;
}

.btn-remove {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
}

.btn-remove:hover {
  background: #fee2e2;
}

.options-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.options-empty {
  color: #aaa;
  font-size: 0.85rem;
  padding: 0.5rem 0;
  font-style: italic;
}

.option-label {
  font-weight: 700;
  font-size: 0.85rem;
  color: #002395;
  width: 20px;
  text-align: center;
  flex-shrink: 0;
}

.btn-add-option {
  background: #f0f4ff;
  color: #002395;
  border: 1px solid #c7d4ff;
  padding: 0.3rem 0.75rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 600;
}

.btn-add-option:hover {
  background: #e0e8ff;
}

.btn-remove-option {
  background: none;
  border: none;
  color: #aaa;
  cursor: pointer;
  font-size: 1rem;
  padding: 0 0.25rem;
  line-height: 1;
  flex-shrink: 0;
}

.btn-remove-option:hover {
  color: #dc2626;
}

.options-section {
  margin-top: 1rem;
}

.options-section label {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #555;
}

.option-input-row {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  margin-bottom: 0.5rem;
}

.flex-1 {
  flex: 1;
}

.correct-checkbox {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.85rem;
  white-space: nowrap;
}

.correct-checkbox input {
  cursor: pointer;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.btn-cancel, .btn-save {
  flex: 1;
  padding: 0.75rem;
  border-radius: 6px;
  border: none;
  font-weight: 600;
  cursor: pointer;
}

.btn-cancel {
  background: #f5f5f5;
  color: #333;
}

.btn-cancel:hover {
  background: #ebebeb;
}

.btn-save {
  background: #ED2939;
  color: #fff;
}

.btn-save:hover:not(:disabled) {
  background: #c82231;
}

.btn-save:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Quizzes List */
.quizzes-list {
  display: grid;
  gap: 1rem;
}

.quiz-item {
  background: #fff;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #e5e7eb;
}

.quiz-info h4 {
  margin-top: 0;
  color: #1a1a2e;
}

.quiz-info p {
  color: #666;
  margin: 0.25rem 0 0.75rem;
}

.quiz-meta {
  display: flex;
  gap: 0.5rem;
}

.difficulty {
  font-size: 0.75rem;
  padding: 0.25rem 0.6rem;
  border-radius: 99px;
  font-weight: 600;
  text-transform: uppercase;
}

.difficulty.easy {
  background: #d1fae5;
  color: #065f46;
}

.difficulty.medium {
  background: #fef3c7;
  color: #92400e;
}

.difficulty.hard {
  background: #fee2e2;
  color: #991b1b;
}

.region {
  font-size: 0.75rem;
  padding: 0.25rem 0.6rem;
  background: #f0f4ff;
  color: #002395;
  border-radius: 99px;
}

.quiz-actions {
  display: flex;
  gap: 0.75rem;
}

.btn-edit, .btn-delete {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.85rem;
}

.btn-edit {
  background: #f0f4ff;
  color: #002395;
}

.btn-edit:hover {
  background: #e0e8ff;
}

.btn-delete {
  background: #fef2f2;
  color: #dc2626;
}

.btn-delete:hover {
  background: #fee2e2;
}

/* Region Form */
.region-form-card {
  background: #fff;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.region-form-card h3 {
  margin-top: 0;
  font-family: 'Playfair Display', Georgia, serif;
  color: #1a1a2e;
}

/* Regions List */
.regions-list {
  display: grid;
  gap: 1rem;
}

.region-item {
  background: #fff;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #e5e7eb;
}

.region-info h4 {
  margin-top: 0;
  color: #1a1a2e;
}

.region-info p {
  color: #666;
  margin: 0.25rem 0 0.75rem;
  font-size: 0.9rem;
}

.region-highlights {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.highlight-badge {
  font-size: 0.75rem;
  padding: 0.25rem 0.6rem;
  background: #f0f4ff;
  color: #002395;
  border-radius: 99px;
}

.region-actions {
  display: flex;
  gap: 0.75rem;
}

@media (max-width: 768px) {
  .region-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .region-actions {
    width: 100%;
  }

  .btn-edit,
  .btn-delete {
    flex: 1;
  }
}

.empty-state {
  background: #fff;
  border-radius: 12px;
  padding: 3rem;
  text-align: center;
  color: #888;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: #888;
}

/* Scores */
.scores-list {
  display: grid;
  gap: 2rem;
}

.scores-quiz {
  background: #fff;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
}

.scores-quiz h3 {
  margin-top: 0;
  color: #1a1a2e;
  font-family: 'Playfair Display', Georgia, serif;
}

.scores-table {
  width: 100%;
  border-collapse: collapse;
}

.scores-table th {
  background: #f5f5f5;
  padding: 0.75rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.85rem;
  border-bottom: 1px solid #e5e7eb;
  color: #555;
}

.scores-table td {
  padding: 0.75rem;
  border-bottom: 1px solid #f5f5f5;
}

.scores-table span.great {
  color: #22c55e;
  font-weight: 600;
}

.scores-table span.ok {
  color: #f59e0b;
  font-weight: 600;
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .quiz-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .btn-add {
    width: 100%;
  }
}
</style>