<template>
  <div class="sb-row" :class="rowClass">
    <span class="sb-label">
      <SbIcon v-if="field.icon" :icon="field.icon" />
      <span>{{ field.label }}</span>
    </span>
    <span class="sb-value">
      <ProgressBar v-if="field.type === 'progress'" :config="field" :value="value" />
      <EnumBadge v-else-if="field.type === 'enum'" :value="value" :mapping="field.mapping" />
      <Stars v-else-if="field.type === 'stars'" :value="value" :max="field.max" />
      <StatImage v-else-if="field.type === 'image'" :source="field.source" :data="data" :fit="field.fit" :ratio="field.ratio" :placeholder="field.placeholder" />
      <ActionButton v-else-if="field.type === 'action'" :field="field" :store="store" />
      <ChoiceGroup v-else-if="field.type === 'choice'" :field="field" :store="store" />
      <SliderInput v-else-if="field.type === 'slider'" :field="field" :store="store" />
      <TextInput v-else-if="field.type === 'input'" :field="field" :store="store" />
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
import StatImage from './StatImage.vue';
import ActionButton from './ActionButton.vue';
import ChoiceGroup from './ChoiceGroup.vue';
import SliderInput from './SliderInput.vue';
import TextInput from './TextInput.vue';
import SbIcon from './SbIcon.vue';

const props = defineProps<{
  field: FieldConfig;
  value: unknown;
  /** stat_data 对象（image 的 mapped/fromVariable 模式读取用） */
  data?: unknown;
  /** 数据存储（交互字段写变量用；不传则交互控件禁用） */
  store?: { data: unknown };
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

/** 交互/图片字段整行垂直排布 */
const rowClass = computed(() => ({
  'is-stack': props.field.type === 'image' || props.field.type === 'input',
}));
</script>

<style scoped>
.sb-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.8em;
}

.sb-row.is-stack {
  flex-direction: column;
  align-items: stretch;
  gap: 0.4em;
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

.sb-row.is-stack .sb-value {
  justify-content: stretch;
}
</style>
