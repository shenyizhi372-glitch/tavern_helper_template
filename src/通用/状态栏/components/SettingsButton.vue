<template>
  <button class="sb-settings-btn" type="button" title="设置" @click="emit('click')">
    <span aria-hidden="true">⚙️</span>
  </button>
</template>

<script setup lang="ts">
const emit = defineEmits<{ click: [] }>();
</script>

<style scoped>
.sb-settings-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.9em;
  height: 1.9em;
  border: 1px solid var(--sb-border);
  border-radius: var(--sb-radius-pill);
  background-color: var(--sb-surface);
  color: var(--sb-text-muted);
  font-size: 0.95em;
  cursor: pointer;
  transition: border-color 0.15s ease, transform 0.15s ease;
}

.sb-settings-btn:hover {
  border-color: var(--sb-primary);
  transform: rotate(24deg);
}
</style>
