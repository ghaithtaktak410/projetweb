<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-bg">
        <img
          src="https://images.pexels.com/photos/161901/pexels-photo-161901.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt="Paris"
          class="hero-img"
        />
        <div class="hero-overlay"></div>
      </div>
      <div class="hero-content">
        <p class="hero-eyebrow">Bienvenue en France</p>
        <h1 class="hero-title">Discover the Magic<br /><em>of France</em></h1>
        <p class="hero-subtitle">
          Explore iconic regions, test your knowledge with interactive quizzes,
          and plan your perfect French adventure.
        </p>
        <div class="hero-actions">
          <button class="btn-primary" @click="router.push('/regions')">Discover Regions</button>
          <button class="btn-secondary" @click="router.push('/quizzes')">Take a Quiz</button>
        </div>
      </div>
      <div class="scroll-hint">
        <span></span>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features">
      <div class="container">
        <div class="section-header">
          <p class="overline">What we offer</p>
          <h2>Your Journey Starts Here</h2>
          <p class="section-desc">Everything you need to fall in love with France.</p>
        </div>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">🗺️</div>
            <h3>Explore Regions</h3>
            <p>Dive into France's diverse regions — from the sun-soaked Côte d'Azur to the misty coasts of Brittany.</p>
            <button class="feature-link" @click="router.push('/regions')">Explore →</button>
          </div>
          <div class="feature-card featured">
            <div class="feature-icon">🧠</div>
            <h3>Interactive Quizzes</h3>
            <p>Challenge yourself with quizzes covering French landmarks, cuisine, history, and culture. Track your scores.</p>
            <button class="feature-link" @click="router.push('/quizzes')">Start Quiz →</button>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🏆</div>
            <h3>Track Progress</h3>
            <p>Your quiz scores are saved to your profile, so you can track improvement and master every topic.</p>
            <button class="feature-link" @click="router.push('/register')">Join Free →</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Highlights Section -->
    <section class="highlights">
      <div class="container">
        <div class="section-header light">
          <p class="overline">Must-see destinations</p>
          <h2>Iconic France</h2>
        </div>
        <div class="highlights-grid">
          <div class="highlight-item large">
            <img src="https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Paris" />
            <div class="highlight-label">
              <h4>Paris</h4>
              <p>City of Light</p>
            </div>
          </div>
          <div class="highlight-item">
            <img src="https://images.pexels.com/photos/1595385/pexels-photo-1595385.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Provence" />
            <div class="highlight-label">
              <h4>Provence</h4>
              <p>Lavender & Sun</p>
            </div>
          </div>
          <div class="highlight-item">
            <img src="https://images.pexels.com/photos/3601425/pexels-photo-3601425.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Normandy" />
            <div class="highlight-label">
              <h4>Normandy</h4>
              <p>History & Cliffs</p>
            </div>
          </div>
          <div class="highlight-item">
            <img src="https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Alsace" />
            <div class="highlight-label">
              <h4>Alsace</h4>
              <p>Fairy-tale Villages</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="stats">
      <div class="container">
        <div class="stats-grid">
          <div class="stat">
            <span class="stat-number">6</span>
            <span class="stat-label">French Regions</span>
          </div>
          <div class="stat">
            <span class="stat-number">3</span>
            <span class="stat-label">Interactive Quizzes</span>
          </div>
          <div class="stat">
            <span class="stat-number">12+</span>
            <span class="stat-label">Quiz Questions</span>
          </div>
          <div class="stat">
            <span class="stat-number">∞</span>
            <span class="stat-label">Things to Discover</span>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-box">
          <h2>Ready to Test Your Knowledge?</h2>
          <p>Join thousands of students exploring French culture through our interactive quizzes.</p>
          <button class="btn-primary large" @click="router.push('/register')">Get Started Free</button>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="container">
        <p>🇫🇷 Explore France — Interactive Quiz &amp; Travel Portal</p>
        <p class="footer-sub">Built with Vue.js &amp; Supabase</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.home {
  min-height: 100vh;
}

/* Hero */
.hero {
  position: relative;
  height: 100vh;
  min-height: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  inset: 0;
}

.hero-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(0,35,149,0.85) 0%, rgba(0,0,0,0.5) 100%);
}

.hero-content {
  position: relative;
  text-align: center;
  color: #fff;
  padding: 0 1.5rem;
  max-width: 800px;
}

.hero-eyebrow {
  font-size: 0.85rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #FFD700;
  margin-bottom: 1rem;
  font-weight: 600;
}

.hero-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(2.5rem, 6vw, 5rem);
  font-weight: 700;
  line-height: 1.15;
  margin: 0 0 1.25rem;
}

.hero-title em {
  color: #FFD700;
  font-style: italic;
}

.hero-subtitle {
  font-size: 1.1rem;
  color: rgba(255,255,255,0.85);
  line-height: 1.7;
  max-width: 560px;
  margin: 0 auto 2.5rem;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.scroll-hint {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
}

.scroll-hint span {
  display: block;
  width: 2px;
  height: 40px;
  background: linear-gradient(to bottom, rgba(255,255,255,0.8), transparent);
  margin: 0 auto;
  animation: scrollPulse 2s ease-in-out infinite;
}

@keyframes scrollPulse {
  0%, 100% { opacity: 1; transform: scaleY(1); }
  50% { opacity: 0.4; transform: scaleY(0.7); }
}

/* Buttons */
.btn-primary {
  background: #ED2939;
  color: #fff;
  border: none;
  padding: 0.875rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  letter-spacing: 0.02em;
}

.btn-primary:hover {
  background: #c82231;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(237,41,57,0.35);
}

.btn-primary.large {
  padding: 1rem 2.5rem;
  font-size: 1.05rem;
}

.btn-secondary {
  background: rgba(255,255,255,0.12);
  color: #fff;
  border: 1.5px solid rgba(255,255,255,0.4);
  padding: 0.875rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  backdrop-filter: blur(4px);
}

.btn-secondary:hover {
  background: rgba(255,255,255,0.22);
  border-color: rgba(255,255,255,0.7);
  transform: translateY(-2px);
}

/* Container */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* Section Headers */
.section-header {
  text-align: center;
  margin-bottom: 3rem;
}

.section-header h2 {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(1.8rem, 3.5vw, 2.5rem);
  color: #1a1a2e;
  margin: 0.5rem 0 1rem;
}

.section-header.light h2 {
  color: #fff;
}

.section-desc {
  color: #666;
  font-size: 1rem;
  max-width: 480px;
  margin: 0 auto;
}

.overline {
  font-size: 0.75rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  font-weight: 700;
  color: #ED2939;
  margin: 0;
}

.section-header.light .overline {
  color: #FFD700;
}

/* Features */
.features {
  padding: 6rem 0;
  background: #F8F5F0;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.feature-card {
  background: #fff;
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid #eee;
  transition: all 0.3s;
}

.feature-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
}

.feature-card.featured {
  background: #002395;
  border-color: #002395;
  color: #fff;
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0,35,149,0.25);
}

.feature-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  display: block;
}

.feature-card h3 {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 1.3rem;
  margin: 0 0 0.75rem;
  color: #1a1a2e;
}

.feature-card.featured h3 {
  color: #fff;
}

.feature-card p {
  color: #666;
  line-height: 1.7;
  font-size: 0.9rem;
  margin: 0 0 1.5rem;
}

.feature-card.featured p {
  color: rgba(255,255,255,0.75);
}

.feature-link {
  background: none;
  border: none;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  color: #002395;
  padding: 0;
  transition: letter-spacing 0.2s;
}

.feature-card.featured .feature-link {
  color: #FFD700;
}

.feature-link:hover {
  letter-spacing: 0.04em;
}

/* Highlights */
.highlights {
  padding: 6rem 0;
  background: linear-gradient(135deg, #002395 0%, #1a1a60 100%);
}

.highlights-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr 1fr;
  grid-template-rows: 280px;
  gap: 1rem;
}

.highlight-item {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
}

.highlight-item.large {
  grid-row: span 1;
}

.highlight-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s;
}

.highlight-item:hover img {
  transform: scale(1.06);
}

.highlight-item::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%);
}

.highlight-label {
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  z-index: 1;
  color: #fff;
}

.highlight-label h4 {
  margin: 0 0 0.1rem;
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 1.1rem;
}

.highlight-label p {
  margin: 0;
  font-size: 0.8rem;
  color: rgba(255,255,255,0.75);
}

/* Stats */
.stats {
  padding: 4rem 0;
  background: #fff;
  border-bottom: 1px solid #eee;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  text-align: center;
}

.stat-number {
  display: block;
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 3rem;
  font-weight: 700;
  color: #002395;
  line-height: 1;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.85rem;
  color: #888;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

/* CTA */
.cta-section {
  padding: 6rem 0;
  background: #F8F5F0;
}

.cta-box {
  background: linear-gradient(135deg, #002395 0%, #ED2939 100%);
  border-radius: 20px;
  padding: 4rem 2rem;
  text-align: center;
  color: #fff;
}

.cta-box h2 {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(1.8rem, 3vw, 2.5rem);
  margin: 0 0 1rem;
}

.cta-box p {
  color: rgba(255,255,255,0.85);
  font-size: 1rem;
  margin: 0 0 2rem;
}

/* Footer */
.footer {
  background: #1a1a2e;
  color: rgba(255,255,255,0.6);
  text-align: center;
  padding: 2rem;
}

.footer p {
  margin: 0.25rem 0;
  font-size: 0.9rem;
}

.footer-sub {
  font-size: 0.8rem !important;
  opacity: 0.5;
}

/* Responsive */
@media (max-width: 1024px) {
  .highlights-grid {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 200px 200px;
  }

  .highlight-item.large {
    grid-column: span 2;
  }
}

@media (max-width: 768px) {
  .features-grid {
    grid-template-columns: 1fr;
  }

  .feature-card.featured {
    transform: none;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .highlights-grid {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 150px 150px;
  }
}

@media (max-width: 480px) {
  .highlights-grid {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
  }

  .highlight-item,
  .highlight-item.large {
    grid-column: span 1;
    height: 180px;
  }
}
</style>
