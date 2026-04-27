<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuizStore } from '../stores/quiz'
import QuizCard from '../components/QuizCard.vue'

const route = useRoute()
const router = useRouter()
const quizStore = useQuizStore()

const region = ref<any>(null)
const loading = ref(true)

const regionQuizzes = computed(() => {
  return quizStore.quizzes.filter(q => q.region_id === route.params.id)
})

onMounted(async () => {
  const regionId = route.params.id as string

  if (quizStore.quizzes.length === 0) {
    await quizStore.fetchQuizzes()
  }

  try {
    const { supabase } = await import('../lib/supabase')
    const { data: regionData } = await supabase.from('regions').select('*').eq('id', regionId).maybeSingle()
    region.value = regionData
  } catch {
    region.value = null
  }

  loading.value = false

  if (!region.value) {
    router.push('/regions')
  }
})
</script>

<template>
  <div class="region-detail-page">
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading region…</p>
    </div>

    <template v-else-if="region">
      <!-- Hero -->
      <div class="region-hero">
        <img :src="region.image_url" :alt="region.name" class="hero-img" />
        <div class="hero-overlay"></div>
        <div class="hero-content">
          <button class="back-btn" @click="router.back()">← Back</button>
          <h1>{{ region.name }}</h1>
        </div>
      </div>

      <!-- Content -->
      <div class="region-container">
        <!-- Description -->
        <section class="description-section">
          <div class="section-inner">
            <h2>About This Region</h2>
            <p>{{ region.description }}</p>
          </div>
        </section>

        <!-- Highlights -->
        <section class="highlights-section">
          <div class="section-inner">
            <h2>Key Highlights</h2>
            <div class="highlights-grid">
              <div v-for="highlight in region.highlights" :key="highlight" class="highlight-item">
                <span class="highlight-icon">⭐</span>
                <span class="highlight-text">{{ highlight }}</span>
              </div>
            </div>
          </div>
        </section>

        <!-- Related Quizzes -->
        <section class="quizzes-section">
          <div class="section-inner">
            <h2>
              Explore Quizzes
              <span v-if="regionQuizzes.length > 0" class="quiz-count">{{ regionQuizzes.length }}</span>
            </h2>
            <p class="section-desc">Test your knowledge about {{ region.name }} with these interactive quizzes.</p>

            <div v-if="regionQuizzes.length === 0" class="no-quizzes">
              <p>No quizzes for this region yet. Check back soon!</p>
              <router-link to="/quizzes" class="btn-all-quizzes">Browse All Quizzes</router-link>
            </div>

            <div v-else class="quizzes-grid">
              <QuizCard v-for="quiz in regionQuizzes" :key="quiz.id" :quiz="quiz" />
            </div>
          </div>
        </section>

        <!-- Recommendations -->
        <section class="recommendations-section">
          <div class="section-inner">
            <h2>Visit {{ region.name }}</h2>
            <div class="recommendation-grid">
              <div class="recommendation-card">
                <div class="rec-icon">🏨</div>
                <h3>Where to Stay</h3>
                <p>Discover charming accommodations from boutique hotels to rural guesthouses.</p>
              </div>
              <div class="recommendation-card">
                <div class="rec-icon">🍷</div>
                <h3>Local Cuisine</h3>
                <p>Sample authentic regional dishes and wines at traditional restaurants.</p>
              </div>
              <div class="recommendation-card">
                <div class="rec-icon">🎨</div>
                <h3>Culture & Arts</h3>
                <p>Visit museums, galleries, and historic landmarks that define the region.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </template>

    <div v-else class="not-found">
      <h2>Region not found</h2>
      <router-link to="/regions">Back to Regions</router-link>
    </div>
  </div>
</template>

<style scoped>
.region-detail-page {
  min-height: 100vh;
  background: #F8F5F0;
  padding-top: 64px;
}

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

/* Hero */
.region-hero {
  position: relative;
  height: 400px;
  display: flex;
  align-items: flex-end;
  padding-bottom: 2rem;
  overflow: hidden;
}

.hero-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%);
}

.hero-content {
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  width: 100%;
  color: #fff;
}

.back-btn {
  background: rgba(255,255,255,0.15);
  border: 1px solid rgba(255,255,255,0.3);
  color: #fff;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 1rem;
  transition: all 0.2s;
}

.back-btn:hover {
  background: rgba(255,255,255,0.25);
  border-color: rgba(255,255,255,0.5);
}

.hero-content h1 {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(2rem, 4vw, 3.5rem);
  margin: 0;
}

/* Container */
.region-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.section-inner {
  max-width: 900px;
  margin: 0 auto;
}

/* Sections */
.description-section,
.highlights-section,
.quizzes-section,
.recommendations-section {
  padding: 4rem 0;
}

section h2 {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 2rem;
  color: #1a1a2e;
  margin-top: 0 0 1.5rem;
}

.quiz-count {
  font-size: 1rem;
  background: #ED2939;
  color: #fff;
  padding: 0.25rem 0.75rem;
  border-radius: 99px;
  margin-left: 0.75rem;
}

.section-desc {
  color: #666;
  font-size: 1rem;
  margin: 0 0 2rem;
}

/* Description */
.description-section p {
  font-size: 1.05rem;
  line-height: 1.8;
  color: #555;
}

/* Highlights */
.highlights-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.highlight-item {
  background: #fff;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  border: 1px solid #e5e7eb;
  transition: all 0.3s;
}

.highlight-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0,0,0,0.08);
}

.highlight-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.highlight-text {
  font-weight: 600;
  color: #1a1a2e;
}

/* Quizzes */
.no-quizzes {
  background: #fff;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  color: #888;
}

.btn-all-quizzes {
  display: inline-block;
  background: #002395;
  color: #fff !important;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  margin-top: 1rem;
  text-decoration: none;
  transition: background 0.2s;
}

.btn-all-quizzes:hover {
  background: #001a7a;
}

.quizzes-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

/* Recommendations */
.recommendations-section {
  background: linear-gradient(135deg, #002395 0%, #1a1a60 100%);
  color: #fff;
  margin: 0 -1.5rem -4rem -1.5rem;
  padding: 4rem 1.5rem !important;
}

.recommendations-section h2 {
  color: #fff;
}

.recommendation-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.recommendation-card {
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  backdrop-filter: blur(10px);
  transition: all 0.3s;
}

.recommendation-card:hover {
  background: rgba(255,255,255,0.15);
  transform: translateY(-4px);
}

.rec-icon {
  font-size: 2.5rem;
  display: block;
  margin-bottom: 1rem;
}

.recommendation-card h3 {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 1.25rem;
  margin: 0 0 0.75rem;
  color: #FFD700;
}

.recommendation-card p {
  color: rgba(255,255,255,0.8);
  margin: 0;
}

.not-found {
  text-align: center;
  padding: 4rem 1.5rem;
  color: #888;
}

@media (max-width: 1024px) {
  .highlights-grid,
  .recommendation-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .quizzes-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .highlights-grid,
  .recommendation-grid {
    grid-template-columns: 1fr;
  }

  section h2 {
    font-size: 1.5rem;
  }
}
</style>
