<template>
  <div class="sb-status-bar" :style="[themeStyle, bgStyle]">
    <div v-if="config.title" class="sb-title">{{ config.title }}</div>
    <StatImage
      v-for="image in topImages"
      :key="image.id"
      class="sb-panel-image"
      :source="image.source"
      :data="data"
      :fit="image.fit"
      :ratio="image.ratio"
      :placeholder="image.placeholder"
    />
    <StatusSection
      v-for="section in normalized.sections"
      :key="section.id"
      :section="section"
      :data="data"
      :store="store"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, provide } from 'vue';
import type { StatusBarConfig, ThemeOverride } from './types';
import { defaultTheme, mergeTheme, themeToCssVars } from './theme';
import { normalizeStatusBarConfig } from './config.schema';
import { resolveImageSource } from './image';
import StatusSection from './components/StatusSection.vue';
import StatImage from './components/StatImage.vue';
import './global.css';

const props = defineProps<{
  /** 展示配置：区块、字段、映射全部由外部传入，界面零硬编码 */
  config: StatusBarConfig;
  /** stat_data 对象（通常传 store.data，响应式） */
  data: unknown;
  /** 数据存储：交互字段写变量用（改 store.data 后 defineMvuDataStore 自动双向同步） */
  store?: { data: unknown };
  /** 主题覆盖：只写想改的键，其余沿用默认宝可梦卡主题 */
  theme?: ThemeOverride;
}>();

const normalized = computed(() => normalizeStatusBarConfig(props.config));

const mergedTheme = computed(() => mergeTheme(defaultTheme, props.theme));

/** 供子组件读取主题配置（分隔字符、括号等） */
provide('sbTheme', mergedTheme);

const themeStyle = computed(() => themeToCssVars(mergedTheme.value));

const topImages = computed(() => (props.config.images ?? []).filter(image => image.position === 'top'));

const bgStyle = computed(() => {
  const bg = (props.config.images ?? []).find(image => image.position === 'background');
  if (!bg) {
    return undefined;
  }
  const url = resolveImageSource(bg.source, props.data);
  return url ? { backgroundImage: `url("${url}")` } : undefined;
});
</script>

<style scoped>
.sb-panel-image {
  margin-bottom: var(--sb-gap-section);
}
</style>

<style scoped>
.sb-title {
  padding: 0.4em 0.7em;
  margin-bottom: var(--sb-gap-section);
  border: 1px solid var(--sb-border);
  border-radius: var(--sb-radius-panel);
  background-color: var(--sb-surface);
  font-weight: 700;
  text-align: center;
  letter-spacing: 0.2em;
}
</style>
