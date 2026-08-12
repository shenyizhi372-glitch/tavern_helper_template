<template>
  <span class="sb-slider">
    <input
      class="sb-slider-input"
      type="range"
      :min="min"
      :max="max"
      :step="step"
      :value="currentValue"
      @input="onInput"
    />
    <span v-if="field.showValue !== false" class="sb-slider-value">{{ displayValue }}</span>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { SliderFieldConfig } from '../types';
import { getByPath, setByPath } from '../path';

const props = defineProps<{
  field: SliderFieldConfig;
  store?: { data: unknown };
}>();

const min = computed(() => props.field.min ?? 0);
const max = computed(() => props.field.max ?? 100);
const step = computed(() => props.field.step ?? 1);

const currentValue = computed(() => {
  const value = Number(getByPath(props.store?.data, props.field.path));
  return Number.isFinite(value) ? value : min.value;
});

const displayValue = computed(() => `${currentValue.value}/${max.value}`);

let timer: ReturnType<typeof setTimeout> | null = null;

function onInput(event: Event) {
  const value = Number((event.target as HTMLInputElement).value);
  if (!props.store) {
    return;
  }
  const debounce = props.field.debounce ?? 300;
  if (timer) {
    clearTimeout(timer);
  }
  timer = setTimeout(() => {
    setByPath(props.store?.data, props.field.path, value);
  }, debounce);
}
</script>

<style scoped>
.sb-slider {
  display: inline-flex;
  align-items: center;
  gap: 0.5em;
  flex: 1;
  min-width: 8em;
  max-width: 12em;
}

.sb-slider-input {
  flex: 1;
  accent-color: var(--sb-primary);
}

.sb-slider-value {
  font-size: var(--sb-font-size-small);
  color: var(--sb-text-muted);
  white-space: nowrap;
}
</style>
