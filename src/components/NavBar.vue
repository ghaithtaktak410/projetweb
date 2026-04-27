<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const menuOpen = ref(false)

const isActive = (name: string) => route.name === name

const user = computed(() => authStore.user)
const isAdmin = computed(() => authStore.user?.profile?.role === 'admin')

function toggleMenu() {
  menuOpen.value = !menuOpen.value
}

function closeMenu() {
  menuOpen.value = false
}

async function handleLogout() {
  await authStore.logout()
  closeMenu()
  router.push('/')
}
</script>

<template>
  <nav class="navbar">
    <div class="navbar-container">
      <router-link to="/" class="navbar-brand" @click="closeMenu">
        <span class="brand-flag">🇫🇷</span>
        <span class="brand-text">Explore <strong>France</strong></span>
      </router-link>

      <button class="hamburger" :class="{ open: menuOpen }" @click="toggleMenu" aria-label="Toggle menu">
        <span></span><span></span><span></span>
      </button>

      <div class="navbar-links" :class="{ open: menuOpen }">
        <router-link to="/" :class="{ active: isActive('home') }" @click="closeMenu">Home</router-link>
        <router-link to="/regions" :class="{ active: isActive('regions') }" @click="closeMenu">Regions</router-link>
        <router-link to="/quizzes" :class="{ active: isActive('quizzes') }" @click="closeMenu">Quizzes</router-link>
        <router-link to="/leaderboard" :class="{ active: isActive('leaderboard') }" @click="closeMenu">🏆 Leaderboard</router-link>
        <router-link v-if="isAdmin" to="/admin" :class="{ active: isActive('admin') }" @click="closeMenu" class="admin-link">Dashboard</router-link>

        <template v-if="user">
          <router-link to="/profile" :class="{ active: isActive('profile') }" class="profile-link" @click="closeMenu">
            👤 {{ user.profile?.username ?? 'Profile' }}
          </router-link>
          <button class="btn-nav btn-logout" @click="handleLogout">Sign Out</button>
        </template>
        <template v-else>
          <router-link to="/login" class="btn-nav btn-login" @click="closeMenu">Login</router-link>
          <router-link to="/register" class="btn-nav btn-register" @click="closeMenu">Register</router-link>
        </template>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: rgba(0, 35, 149, 0.97);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255,255,255,0.1);
  height: 64px;
}

.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: #fff;
  font-size: 1.1rem;
  letter-spacing: 0.02em;
}

.brand-flag {
  font-size: 1.4rem;
  line-height: 1;
}

.brand-text strong {
  color: #FFD700;
}

.navbar-links {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.navbar-links a {
  color: rgba(255,255,255,0.85);
  text-decoration: none;
  padding: 0.4rem 0.75rem;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  transition: color 0.2s, background 0.2s;
}

.navbar-links a:hover,
.navbar-links a.active {
  color: #fff;
  background: rgba(255,255,255,0.12);
}

.admin-link {
  color: #FFD700 !important;
}

.profile-link {
  color: rgba(255,255,255,0.85) !important;
  text-decoration: none;
  padding: 0.4rem 0.75rem;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  transition: color 0.2s, background 0.2s;
}

.profile-link:hover,
.profile-link.active {
  color: #fff !important;
  background: rgba(255,255,255,0.12);
}

.btn-nav {
  padding: 0.4rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  border: none;
  transition: all 0.2s;
  margin-left: 0.25rem;
}

.btn-login {
  background: transparent;
  color: #fff !important;
  border: 1.5px solid rgba(255,255,255,0.4) !important;
}

.btn-login:hover {
  border-color: #fff !important;
  background: rgba(255,255,255,0.08) !important;
}

.btn-register {
  background: #ED2939;
  color: #fff !important;
}

.btn-register:hover {
  background: #c82231 !important;
}

.btn-logout {
  background: transparent;
  color: rgba(255,255,255,0.75);
  border: 1.5px solid rgba(255,255,255,0.25);
  font-size: 0.8rem;
}

.btn-logout:hover {
  background: rgba(255,255,255,0.08);
  color: #fff;
}

.hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
}

.hamburger span {
  display: block;
  width: 22px;
  height: 2px;
  background: #fff;
  border-radius: 2px;
  transition: all 0.3s;
}

@media (max-width: 768px) {
  .hamburger {
    display: flex;
  }

  .navbar-links {
    display: none;
    position: absolute;
    top: 64px;
    left: 0;
    right: 0;
    background: rgba(0, 35, 149, 0.98);
    flex-direction: column;
    padding: 1rem;
    gap: 0.5rem;
    border-bottom: 1px solid rgba(255,255,255,0.1);
  }

  .navbar-links.open {
    display: flex;
  }

  .navbar-links a {
    padding: 0.6rem 1rem;
    width: 100%;
  }

  .user-menu {
    width: 100%;
    padding: 0.5rem 1rem;
    background: rgba(255,255,255,0.05);
    border-radius: 8px;
  }

  .btn-nav {
    width: 100%;
    text-align: center;
    margin-left: 0;
  }
}
</style>
