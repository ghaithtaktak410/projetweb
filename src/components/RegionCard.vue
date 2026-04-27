<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { Region } from '../types'

const props = defineProps<{ region: Region }>()
const router = useRouter()

function viewRegion() {
  router.push(`/regions/${props.region.id}`)
}
</script>

<template>
  <div class="region-card" @click="viewRegion">
    <div class="card-image">
      <img :src="region.image_url" :alt="region.name" loading="lazy" />
    </div>
    <div class="card-body">
      <h3 class="card-title">{{ region.name }}</h3>
      <p class="card-desc">{{ region.description }}</p>
      <div class="highlights">
        <span v-for="h in region.highlights.slice(0, 3)" :key="h" class="highlight-tag">{{ h }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.region-card {
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid #eee;
  transition: all 0.3s;
  cursor: pointer;
}

.region-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
}

.card-image {
  height: 200px;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s;
}

.region-card:hover .card-image img {
  transform: scale(1.06);
}

.card-body {
  padding: 1.5rem;
}

.card-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 1.25rem;
  color: #1a1a2e;
  margin: 0 0 0.75rem;
}

.card-desc {
  color: #666;
  font-size: 0.875rem;
  line-height: 1.65;
  margin: 0 0 1.25rem;
}

.highlights {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.highlight-tag {
  font-size: 0.75rem;
  padding: 0.25rem 0.6rem;
  background: #F0F4FF;
  color: #002395;
  border-radius: 99px;
  font-weight: 500;
}
</style>
