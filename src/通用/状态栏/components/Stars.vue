<template>
  <span class="sb-stars" :title="title">
    <span class="sb-stars-filled">{{ '★'.repeat(filled) }}</span><span class="sb-stars-empty">{{ '☆'.repeat(empty) }}</span>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  value: unknown;
  /** 星级上限，默认 5 */
  max?: number;
}>();

const limit = computed(() => Math.max(1, Math.round(props.max ?? 5)));

const numeric = computed(() => {
  const n = Number(props.value);
  return Number.isFinite(n) ? n : 0;
});

const filled = computed(() => Math.min(limit.value, Math.max(0, Math.round(numeric.value))));
const empty = computed(() => limit.value - filled.value);

const title = computed(() => `${numeric.value}/${limit.value}`);
</script>

<style scoped>
.sb-stars {
  white-space: nowrap;
}

.sb-stars-filled {
  color: var(--sb-warning);
}

.sb-stars-empty {
  color: var(--sb-border);
}
</style>
