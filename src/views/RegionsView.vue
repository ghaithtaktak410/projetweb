<script setup lang="ts">
import { onMounted } from 'vue'
import { useQuizStore } from '../stores/quiz'
import RegionCard from '../components/RegionCard.vue'

const quizStore = useQuizStore()

onMounted(() => {
  quizStore.fetchRegions()
})
</script>

<template>
  <div class="regions-page">
    <div class="page-hero">
      <div class="page-hero-bg">
        <img src="https://images.pexels.com/photos/2070485/pexels-photo-2070485.jpeg?auto=compress&cs=tinysrgb&w=1920" alt="French Riviera" />
        <div class="page-hero-overlay"></div>
      </div>
      <div class="page-hero-content">
        <p class="overline">Explore</p>
        <h1>French Regions</h1>
        <p>From Atlantic coasts to Mediterranean shores — discover the diversity of France.</p>
      </div>
    </div>

    <div class="page-content">
      <div class="container">
        <div v-if="quizStore.loading" class="loading-state">
          <div class="spinner"></div>
          <p>Loading regions…</p>
        </div>
        <div v-else class="regions-grid">
          <RegionCard v-for="region in quizStore.regions" :key="region.id" :region="region" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.regions-page { min-height: 100vh; }

.page-hero {
  position: relative;
  height: 380px;
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
  background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,35,149,0.4) 100%);
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

.regions-grid {
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
  border-top-color: #002395;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin { to { transform: rotate(360deg); } }

@media (max-width: 1024px) {
  .regions-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 600px) {
  .regions-grid { grid-template-columns: 1fr; }
}
</style>
