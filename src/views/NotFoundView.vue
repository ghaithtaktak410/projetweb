<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div class="not-found-page">
    <div class="not-found-content">
      <div class="error-icon">🗼</div>
      <h1>Oops! Page Not Found</h1>
      <p>The page you're looking for doesn't exist. Let's get you back on track!</p>
      <div class="button-group">
        <button class="btn-home" @click="router.push('/')">← Back to Home</button>
        <button class="btn-quizzes" @click="router.push('/quizzes')">Browse Quizzes →</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.not-found-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #002395 0%, #1a1a60 100%);
  padding: 1.5rem;
}

.not-found-content {
  text-align: center;
  color: #fff;
  max-width: 500px;
}

.error-icon {
  font-size: 5rem;
  margin-bottom: 1rem;
  display: block;
  animation: bounce 1s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

h1 {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 2.5rem;
  margin: 0 0 1rem;
}

p {
  color: rgba(255,255,255,0.75);
  font-size: 1rem;
  margin: 0 0 2rem;
  line-height: 1.6;
}

.button-group {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

button {
  padding: 0.875rem 1.75rem;
  border-radius: 8px;
  border: none;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-home {
  background: rgba(255,255,255,0.15);
  border: 1.5px solid rgba(255,255,255,0.3);
  color: #fff;
}

.btn-home:hover {
  background: rgba(255,255,255,0.25);
  border-color: rgba(255,255,255,0.5);
}

.btn-quizzes {
  background: #FFD700;
  color: #002395;
}

.btn-quizzes:hover {
  background: #ffc700;
  transform: translateY(-2px);
}
</style>
