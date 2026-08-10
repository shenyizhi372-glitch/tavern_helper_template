<template>
  <section class="sb-section">
    <div
      class="sb-section-header"
      :class="headerClass"
      role="button"
      :aria-expanded="expanded"
      @click="toggle"
    >
      <span v-if="section.collapsible !== false" class="sb-toggle" aria-hidden="true">{{
        expanded ? theme.section.iconExpanded : theme.section.iconCollapsed
      }}</span>
      <SbIcon v-if="section.icon" :icon="section.icon" />
      <span class="sb-divider sb-divider-left" aria-hidden="true">{{ dividerLine }}</span>
      <span class="sb-section-title">{{ theme.section.bracketLeft }}{{ section.label }}{{ theme.section.bracketRight }}</span>
      <span class="sb-divider sb-divider-right" aria-hidden="true">{{ dividerLine }}</span>
    </div>
    <div v-show="expanded" class="sb-stats">
      <StatField
        v-for="(field, i) in section.fields"
        :key="field.path + '#' + i"
        :field="field"
        :value="readStat(data, field.path)"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, inject, ref } from 'vue';
import type { Ref } from 'vue';
import type { SectionConfig, StatusBarTheme } from '../types';
import { getByPath } from '../path';
import SbIcon from './SbIcon.vue';
import StatField from './StatField.vue';

const props = defineProps<{
  section: SectionConfig;
  /** stat_data 对象（由 store.data 传入，响应式） */
  data: unknown;
}>();

const theme = inject<Ref<StatusBarTheme>>('sbTheme')!;

const expanded = ref(!props.section.defaultCollapsed);

function toggle() {
  if (props.section.collapsible !== false) {
    expanded.value = !expanded.value;
  }
}

const headerClass = computed(() => ({
  'is-card': theme.value.section.headerStyle === 'card',
}));

/** 分隔线：用分隔字符铺满剩余宽度（超出部分溢出隐藏） */
const dividerLine = computed(() => theme.value.section.dividerChar.repeat(60));

function readStat(data: unknown, path: string): unknown {
  return getByPath(data, path);
}
</script>

<style scoped>
.sb-section {
  margin-bottom: var(--sb-gap-section);
  border: 1px solid var(--sb-border);
  border-radius: var(--sb-radius-panel);
  background-color: var(--sb-surface);
  overflow: hidden;
}

.sb-section:last-child {
  margin-bottom: 0;
}

.sb-section-header {
  display: flex;
  align-items: center;
  gap: 0.45em;
  padding: 0.45em 0.7em;
  background-color: var(--sb-surface);
  user-select: none;
}

/* card 形态：色块标题栏 */
.sb-section-header.is-card {
  background-color: var(--sb-surface-alt);
  border-bottom: 1px solid var(--sb-border);
}

.sb-section-header.is-card .sb-divider {
  display: none;
}

/* divider 形态：整行可点击 */
.sb-section-header:not(.is-card) {
  cursor: pointer;
}

.sb-section-header:not(.is-card):hover {
  background-color: var(--sb-surface-alt);
}

.sb-toggle {
  flex-shrink: 0;
  font-size: var(--sb-font-size-small);
  color: var(--sb-text-muted);
  width: 1em;
  text-align: center;
}

.sb-divider {
  flex: 1;
  overflow: hidden;
  white-space: nowrap;
  color: var(--sb-border);
  font-size: var(--sb-font-size-small);
  letter-spacing: -0.2em;
  line-height: 1;
}

.sb-divider-left {
  text-align: right;
}

.sb-section-title {
  flex-shrink: 0;
  font-weight: 600;
  white-space: nowrap;
}

.sb-stats {
  display: flex;
  flex-direction: column;
  gap: var(--sb-gap-item);
  padding: var(--sb-pad-panel);
}
</style>
