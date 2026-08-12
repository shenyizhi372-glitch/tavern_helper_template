<template>
  <VueFinalModal v-model="open" :click-to-close="true" class="sb-settings-vfm">
    <div class="sb-settings">
      <div class="sb-settings-head">
        <span class="sb-settings-title">⚙️ 设置</span>
        <button class="sb-settings-close" type="button" @click="open = false">✕</button>
      </div>

      <div class="sb-settings-tabs">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="sb-settings-tab"
          :class="{ active: activeTab === tab.id }"
          type="button"
          @click="activeTab = tab.id"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- 外观：主题 / 密度 / 字号 -->
      <div v-show="activeTab === 'appearance'" class="sb-settings-body">
        <div class="sb-settings-group">
          <div class="sb-settings-group-label">主题</div>
          <div class="sb-settings-presets">
            <button
              v-for="preset in presets"
              :key="preset.id"
              class="sb-settings-preset"
              :class="{ active: themeId === preset.id }"
              type="button"
              @click="themeId = preset.id"
            >
              {{ preset.label }}
            </button>
          </div>
        </div>
        <div class="sb-settings-group">
          <div class="sb-settings-group-label">密度</div>
          <div class="sb-settings-presets">
            <button
              v-for="d in DENSITIES"
              :key="d.value"
              class="sb-settings-preset"
              :class="{ active: density === d.value }"
              type="button"
              @click="density = d.value"
            >
              {{ d.label }}
            </button>
          </div>
        </div>
        <div class="sb-settings-group">
          <div class="sb-settings-group-label">字号 {{ fontScale }}%</div>
          <input
            class="sb-settings-range"
            type="range"
            min="90"
            max="130"
            step="5"
            :value="fontScale"
            @input="fontScale = Number(($event.target as HTMLInputElement).value)"
          />
        </div>
      </div>

      <!-- 图鉴 -->
      <div v-show="activeTab === 'gallery'" class="sb-settings-body">
        <GalleryPanel
          v-if="gallery"
          :gallery="gallery"
          :data="data"
          :image-unlocked="imageUnlocked"
          :try-key="tryKey"
        />
        <div v-else class="sb-settings-empty">本卡未配置图鉴</div>
      </div>
    </div>
  </VueFinalModal>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { VueFinalModal } from 'vue-final-modal';
import type { GalleryConfig, SettingsConfig } from '../types';
import type { SettingsState } from '../useSettings';
import GalleryPanel from './GalleryPanel.vue';

const props = defineProps<{
  modelValue: boolean;
  gallery?: GalleryConfig;
  settings?: SettingsConfig;
  data: unknown;
  /** useSettings 状态（由入口 App 创建后传入） */
  state: SettingsState;
}>();

const emit = defineEmits<{ 'update:modelValue': [boolean] }>();

const open = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value),
});

const activeTab = ref<'appearance' | 'gallery'>('appearance');
const tabs = [
  { id: 'appearance' as const, label: '外观' },
  { id: 'gallery' as const, label: '图鉴' },
];

const DENSITIES = [
  { value: 'compact' as const, label: '紧凑' },
  { value: 'normal' as const, label: '常规' },
  { value: 'comfortable' as const, label: '舒适' },
];

const { presets, themeId, density, fontScale, tryKey, imageUnlocked } = props.state;
</script>

<style scoped>
.sb-settings-vfm {
  --vfm-content-bg: transparent;
}

.sb-settings {
  max-width: 460px;
  width: 92vw;
  max-height: 78vh;
  overflow: hidden auto;
  border: 1px solid var(--sb-border);
  border-radius: var(--sb-radius-panel);
  background-color: var(--sb-surface);
  color: var(--sb-text);
  font-family: var(--sb-font-family);
  font-size: var(--sb-font-size);
  box-shadow: 0 8px 32px rgb(0 0 0 / 28%);
}

.sb-settings-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.6em 1em;
  border-bottom: 1px solid var(--sb-border);
  background-color: var(--sb-surface-alt);
}

.sb-settings-title {
  font-weight: 700;
}

.sb-settings-close {
  border: none;
  background: none;
  color: var(--sb-text-muted);
  font-size: 1em;
  cursor: pointer;
}

.sb-settings-tabs {
  display: flex;
  gap: 0.4em;
  padding: 0.6em 1em 0;
}

.sb-settings-tab {
  padding: 0.3em 1em;
  border: 1px solid var(--sb-border);
  border-bottom: none;
  border-radius: var(--sb-radius-pill) var(--sb-radius-pill) 0 0;
  background-color: var(--sb-surface-alt);
  color: var(--sb-text-muted);
  font-family: inherit;
  font-size: var(--sb-font-size-label);
  cursor: pointer;
}

.sb-settings-tab.active {
  background-color: var(--sb-surface);
  color: var(--sb-text);
  font-weight: 600;
}

.sb-settings-body {
  padding: 0.8em 1em 1.2em;
  border-top: 1px solid var(--sb-border);
}

.sb-settings-group {
  margin-bottom: 1em;
}

.sb-settings-group-label {
  margin-bottom: 0.4em;
  font-size: var(--sb-font-size-label);
  color: var(--sb-text-muted);
}

.sb-settings-presets {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45em;
}

.sb-settings-preset {
  padding: 0.25em 1em;
  border: 1px solid var(--sb-border);
  border-radius: var(--sb-radius-pill);
  background-color: var(--sb-surface);
  color: var(--sb-text);
  font-family: inherit;
  font-size: var(--sb-font-size-label);
  cursor: pointer;
}

.sb-settings-preset.active {
  border-color: var(--sb-primary);
  background-color: color-mix(in srgb, var(--sb-primary) 14%, var(--sb-surface));
  font-weight: 600;
}

.sb-settings-range {
  width: 100%;
  accent-color: var(--sb-primary);
}

.sb-settings-empty {
  padding: 1.5em 0;
  text-align: center;
  color: var(--sb-text-muted);
  font-size: var(--sb-font-size-label);
}
</style>

<!-- vue-final-modal 最小样式（模板 css rule 排除 node_modules，自行提供遮罩/定位） -->
<style>
.vfm--overlay {
  position: fixed;
  inset: 0;
  z-index: 998;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgb(0 0 0 / 45%);
  /* 遮罩不拦截内容交互（内容自身 pointer-events: auto） */
  pointer-events: none;
}

.vfm--content {
  position: relative;
  z-index: 999;
  pointer-events: auto;
}

.vfm-fade-enter-active,
.vfm-fade-leave-active {
  transition: opacity 0.25s ease;
}

.vfm-fade-enter-from,
.vfm-fade-leave-to {
  opacity: 0;
}
</style>
