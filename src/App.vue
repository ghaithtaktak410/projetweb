<script setup lang="ts">
import NavBar from './components/NavBar.vue'
import { useAuthStore } from './stores/auth'
import { onMounted } from 'vue'

const authStore = useAuthStore()

onMounted(async () => {
  await authStore.initialize()
})
</script>

<template>
  <div id="app">
    <NavBar />
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<style>
#app {
  width: 100%;
  margin: 0;
  padding: 0;
}

.main-content {
  margin-top: 64px;
}
</style>
