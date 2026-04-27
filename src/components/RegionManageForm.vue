<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import type { Region } from '../types'

const props = defineProps<{
  region?: Region | null
  isLoading?: boolean
}>()

const emit = defineEmits<{
  save: [data: { name: string; description: string; image_url: string; highlights: string[] }]
  cancel: []
}>()

const form = reactive({
  name: '',
  description: '',
  image_url: '',
  highlights: [] as string[],
})

const newHighlight = ref('')

watch(() => props.region, (region) => {
  if (region) {
    form.name = region.name
    form.description = region.description
    form.image_url = region.image_url
    form.highlights = [...region.highlights]
  } else {
    form.name = ''
    form.description = ''
    form.image_url = ''
    form.highlights = []
  }
}, { immediate: true })

function addHighlight() {
  if (newHighlight.value.trim() && !form.highlights.includes(newHighlight.value)) {
    form.highlights.push(newHighlight.value.trim())
    newHighlight.value = ''
  }
}

function removeHighlight(idx: number) {
  form.highlights.splice(idx, 1)
}

function handleSubmit() {
  if (!form.name.trim() || !form.description.trim()) {
    alert('Name and description are required')
    return
  }
  emit('save', { ...form })
}
</script>

<template>
  <div class="region-form">
    <div class="form-group">
      <label>Region Name *</label>
      <input
        v-model="form.name"
        type="text"
        placeholder="e.g., Île-de-France"
        class="form-input"
      />
    </div>

    <div class="form-group">
      <label>Description *</label>
      <textarea
        v-model="form.description"
        placeholder="Describe the region..."
        class="form-textarea"
        rows="4"
      ></textarea>
    </div>

    <div class="form-group">
      <label>Image URL</label>
      <input
        v-model="form.image_url"
        type="text"
        placeholder="https://..."
        class="form-input"
      />
    </div>

    <div class="form-group">
      <label>Highlights / Attractions</label>
      <div class="highlights-input">
        <input
          v-model="newHighlight"
          type="text"
          placeholder="Add a highlight (e.g., Eiffel Tower)"
          class="form-input"
          @keyup.enter="addHighlight"
        />
        <button type="button" class="btn-add-highlight" @click="addHighlight">
          Add
        </button>
      </div>

      <div v-if="form.highlights.length > 0" class="highlights-list">
        <div v-for="(h, i) in form.highlights" :key="i" class="highlight-tag">
          {{ h }}
          <button type="button" class="remove-btn" @click="removeHighlight(i)">×</button>
        </div>
      </div>
    </div>

    <div class="form-actions">
      <button type="button" class="btn-cancel" @click="emit('cancel')">
        Cancel
      </button>
      <button
        type="button"
        class="btn-save"
        @click="handleSubmit"
        :disabled="isLoading"
      >
        {{ isLoading ? 'Saving...' : 'Save Region' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.region-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 600;
  color: #374151;
  font-size: 0.9rem;
}

.form-input,
.form-textarea {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-family: inherit;
  font-size: 0.9rem;
  transition: border-color 0.2s;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #002395;
  box-shadow: 0 0 0 3px rgba(0,35,149,0.1);
}

.highlights-input {
  display: flex;
  gap: 0.5rem;
}

.highlights-input .form-input {
  flex: 1;
}

.btn-add-highlight {
  padding: 0.75rem 1rem;
  background: #002395;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
}

.btn-add-highlight:hover {
  background: #001a7a;
}

.highlights-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.highlight-tag {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #f0f4ff;
  color: #002395;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
}

.remove-btn {
  background: none;
  border: none;
  color: #002395;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 0;
  line-height: 1;
}

.remove-btn:hover {
  color: #ed2939;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.btn-cancel,
.btn-save {
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
  background: #002395;
  color: #fff;
}

.btn-save:hover:not(:disabled) {
  background: #001a7a;
}

.btn-save:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>
