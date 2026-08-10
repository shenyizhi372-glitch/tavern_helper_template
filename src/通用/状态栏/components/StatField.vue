<template>
  <div class="sb-row">
    <span class="sb-label">
      <SbIcon v-if="field.icon" :icon="field.icon" />
      <span>{{ field.label }}</span>
    </span>
    <span class="sb-value">
      <ProgressBar v-if="field.type === 'progress'" :config="field" :value="value" />
      <EnumBadge v-else-if="field.type === 'enum'" :value="value" :mapping="field.mapping" />
      <Stars v-else-if="field.type === 'stars'" :value="value" :max="field.max" />
      <template v-else>{{ displayText }}</template>
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { FieldConfig } from '../types';
import { isEmptyValue } from '../path';
import ProgressBar from './ProgressBar.vue';
import EnumBadge from './EnumBadge.vue';
import Stars from './Stars.vue';
import SbIcon from './SbIcon.vue';

const props = defineProps<{
  field: FieldConfig;
  value: unknown;
}>();

/** 展示文案：空值 → fallback；text 原样；number 按 precision 处理 */
const displayText = computed(() => {
  if (isEmptyValue(props.value)) {
    return props.field.fallback ?? '—';
  }
  if (props.field.type === 'number') {
    const n = Number(props.value);
    if (Number.isFinite(n)) {
      return props.field.precision === undefined ? String(n) : n.toFixed(props.field.precision);
    }
  }
  return String(props.value);
});
</script>

<style scoped>
.sb-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.8em;
}

.sb-label {
  display: inline-flex;
  align-items: center;
  gap: 0.4em;
  font-size: var(--sb-font-size-label);
  color: var(--sb-text-muted);
  white-space: nowrap;
}

.sb-value {
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.4em;
  min-width: 0;
  text-align: right;
  word-break: break-all;
}
</style>
