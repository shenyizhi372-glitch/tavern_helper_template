<template>
  <div ref="rootEl" class="sb-status-bar" :class="{ 'is-blurred': settingsOpen }" :style="rootStyle">
    <div class="sb-headbar">
      <div v-if="config.title" class="sb-title">{{ config.title }}</div>
      <SettingsButton
        v-if="hasSettings"
        class="sb-headbar-settings"
        @click="settingsOpen = true"
      />
    </div>
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
    <SettingsModal
      v-model="settingsOpen"
      :gallery="config.gallery"
      :settings="config.settings"
      :data="data"
      :state="state"
      :get-anchor="getAnchor"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, provide, ref, watch } from 'vue';
import type { StatusBarConfig, ThemeOverride } from './types';
import { normalizeStatusBarConfig } from './config.schema';
import { resolveImageSource } from './image';
import { useSettings } from './useSettings';
import StatusSection from './components/StatusSection.vue';
import StatImage from './components/StatImage.vue';
import SettingsButton from './components/SettingsButton.vue';
import SettingsModal from './components/SettingsModal.vue';
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

/** 设置与解锁状态（localStorage 持久化：主题/字号/密度/密钥/解锁记录） */
const state = useSettings(props.config.gallery, props.config.settings);

/** 供子组件读取主题配置（分隔字符、括号等） */
provide('sbTheme', state.mergedTheme);

/** 供交互组件读取密钥解锁记录 */
provide('sbKeys', state.keys);

/** 立绘随变量切换开关（默认开） */
provide('sbPortraitAuto', state.portraitAuto);

/** 条件达成的图标记永久解锁（数据变化时同步） */
watch(
  () => props.data,
  () => state.syncUnlocked(props.data),
  { immediate: true },
);

const settingsOpen = ref(false);
const hasSettings = computed(() => !!props.config.gallery || !!props.config.settings);

/** 设置弹窗 tab（外部可跳转；通用版无状态栏内锁按钮，仅保持接口一致） */
const settingsTab = ref<'appearance' | 'gallery' | 'gallery-manage'>('appearance');
provide('sbSettingsTab', settingsTab);
provide('sbOpenSettings', (tab: 'appearance' | 'gallery' | 'gallery-manage') => {
  settingsTab.value = tab;
  settingsOpen.value = true;
});

/** 弹窗锚点：状态栏根节点（.sb-status-bar），弹窗以其中线为基准定位 */
const rootEl = ref<HTMLElement | null>(null);
const getAnchor = (): HTMLElement | null => rootEl.value;

const topImages = computed(() => (props.config.images ?? []).filter(image => image.position === 'top'));

const bgStyle = computed(() => {
  const bg = (props.config.images ?? []).find(image => image.position === 'background');
  if (!bg) {
    return undefined;
  }
  const url = resolveImageSource(bg.source, props.data);
  return url ? { backgroundImage: `url("${url}")` } : undefined;
});

/** 根节点样式：主题变量 + 背景图 */
const rootStyle = computed(() => ({ ...state.themeStyle.value, ...(bgStyle.value ?? {}) }));
</script>

<style scoped>
/* 弹窗打开时状态栏自身模糊（只模糊状态栏，不影响系统界面） */
.sb-status-bar.is-blurred {
  filter: blur(3px);
  transition: filter 0.25s ease;
}

.sb-headbar {
  position: relative;
}

.sb-headbar-settings {
  position: absolute;
  top: 0.15em;
  right: 0.15em;
}

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

.sb-panel-image {
  margin-bottom: var(--sb-gap-section);
}
</style>
