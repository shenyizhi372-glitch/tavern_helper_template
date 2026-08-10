<template>
  <span class="sb-progress">
    <span class="sb-progress-track">
      <span class="sb-progress-fill" :style="{ width: percent + '%', backgroundColor: fillColor }"></span>
    </span>
    <span v-if="config.showValue !== false" class="sb-progress-value">{{ displayValue }}/{{ max }}</span>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { ProgressFieldConfig } from '../types';

const props = defineProps<{
  config: ProgressFieldConfig;
  /** 数值（非数字时按 0 处理） */
  value: unknown;
}>();

const min = computed(() => props.config.min ?? 0);
const max = computed(() => props.config.max ?? 100);
const numeric = computed(() => {
  const n = Number(props.value);
  return Number.isFinite(n) ? n : 0;
});

/** 0-100 百分比（越界自动钳制） */
const percent = computed(() => {
  const range = max.value - min.value;
  if (range <= 0) {
    return 0;
  }
  const p = ((numeric.value - min.value) / range) * 100;
  return Math.min(100, Math.max(0, p));
});

/** 阈值配色：按 min 从大到小声明，取第一个 value >= threshold.min */
const fillColor = computed(() => {
  const thresholds = [...(props.config.thresholds ?? [])].sort((a, b) => (b.min ?? -Infinity) - (a.min ?? -Infinity));
  for (const threshold of thresholds) {
    if (numeric.value >= (threshold.min ?? -Infinity)) {
      return threshold.color;
    }
  }
  return undefined; // 用 CSS 变量 --sb-progress-fill
});

const displayValue = computed(() => Math.round(numeric.value * 100) / 100);
</script>

<style scoped>
.sb-progress {
  display: inline-flex;
  align-items: center;
  gap: 0.5em;
  flex: 1;
  min-width: 5em;
  max-width: 12em;
}

.sb-progress-track {
  flex: 1;
  height: 0.7em;
  border-radius: var(--sb-radius-pill);
  background-color: var(--sb-progress-track);
  overflow: hidden;
}

.sb-progress-fill {
  display: block;
  height: 100%;
  border-radius: var(--sb-radius-pill);
  background-color: var(--sb-progress-fill);
  transition: width 0.3s ease;
}

.sb-progress-value {
  font-size: var(--sb-font-size-small);
  color: var(--sb-text-muted);
  white-space: nowrap;
}
</style>
