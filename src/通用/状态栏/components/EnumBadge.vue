<template>
  <span class="sb-badge" :style="badgeStyle">
    <SbIcon v-if="style?.icon" :icon="style.icon" />
    <span>{{ text }}</span>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { EnumStyle } from '../types';
import { readableTextColor } from '../color';
import SbIcon from './SbIcon.vue';

const props = defineProps<{
  value: unknown;
  mapping: Record<string, EnumStyle>;
}>();

const style = computed(() => {
  const key = String(props.value);
  return props.mapping[key] ?? undefined;
});

const text = computed(() => style.value?.label ?? (props.value === undefined || props.value === null || props.value === '' ? '—' : String(props.value)));

const badgeStyle = computed(() => {
  const color = style.value?.color;
  if (!color) {
    return undefined; // 用 CSS 变量 --sb-primary
  }
  return { backgroundColor: color, color: readableTextColor(color) };
});
</script>

<style scoped>
.sb-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35em;
  padding: 0.1em 0.7em;
  border-radius: var(--sb-radius-pill);
  background-color: var(--sb-primary);
  color: var(--sb-text-on-primary);
  font-size: var(--sb-font-size-small);
  line-height: 1.6;
  white-space: nowrap;
}
</style>
