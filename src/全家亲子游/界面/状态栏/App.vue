<template>
  <div class="status-root" :class="{ 'is-blurred': settingsOpen }" :style="cssVars">
    <StatusPanel
      ref="panelRef"
      v-if="store.data"
      title="🏡 全家亲子游"
      :data="store.data"
      :store="store"
      :gallery="galleryState"
    />
    <div v-else class="status-missing">[状态栏缺失]</div>
    <SettingsModal
      v-model="settingsOpen"
      :gallery="galleryState"
      :original-gallery="gallery"
      :gallery-editable="true"
      :settings="settings"
      :data="store.data"
      :state="state"
      :get-anchor="getAnchor"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, provide, reactive, ref } from 'vue';
import type { GalleryConfig } from '../../../通用/状态栏/types';
import StatusPanel from './components/StatusPanel.vue';
import SettingsModal from '../../../通用/状态栏/components/SettingsModal.vue';
import { useSettings } from '../../../通用/状态栏/useSettings';
import { useDataStore } from './store';
import { gallery, settings } from './gallery';

const store = useDataStore();
const settingsOpen = ref(false);

/** 弹窗锚点：当前状态栏面板（.sb-panel），弹窗以面板中心为基准定位 */
const panelRef = ref<InstanceType<typeof StatusPanel> | null>(null);
const getAnchor = (): HTMLElement | null => (panelRef.value?.$el as HTMLElement | undefined) ?? null;

/**
 * 图鉴配置：支持作者在设置「图鉴管理」中编辑（localStorage 持久化），编辑实时生效。
 * 未编辑时用代码配置（clone 避免改写静态常量）。
 */
const EDIT_KEY = 'sb:gallery-edit';

function loadGallery(): GalleryConfig {
  const base = structuredClone(gallery);
  try {
    const saved = localStorage.getItem(EDIT_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as GalleryConfig;
      if (parsed && Array.isArray(parsed.characters)) {
        return parsed;
      }
    }
  } catch {
    /* 损坏数据忽略，用代码配置 */
  }
  return base;
}

const galleryState = reactive(loadGallery()) as GalleryConfig;

/** 设置弹窗 tab（可由状态栏内锁定标记跳转到图鉴） */
type SettingsTabId = 'appearance' | 'gallery' | 'gallery-manage';
const settingsTab = ref<SettingsTabId>('appearance');

function openSettingsTab(tab: SettingsTabId) {
  settingsTab.value = tab;
  settingsOpen.value = true;
}

provide('sbSettingsTab', settingsTab);
provide('sbOpenSettings', openSettingsTab);

/** 设置与解锁状态（localStorage 持久化） */
const state = useSettings(gallery, settings);

// 首次访问默认温馨家庭主题（之后记住用户选择）
if (!localStorage.getItem('sb:theme')) {
  state.themeId.value = 'family';
}

/** 供子组件读取主题配置与密钥解锁记录 */
provide('sbTheme', state.mergedTheme);
provide('sbKeys', state.keys);
/** 供立绘组件读取立绘大小设置 */
provide('sbPortrait', state.portrait);
/** 立绘随变量切换开关（默认开） */
provide('sbPortraitAuto', state.portraitAuto);
/** 显示立绘开关（无图模式） */
provide('sbPortraitVisible', state.portraitVisible);

/** 主题变量同步到 --c-*（自有组件换肤联动：好感度条、角色卡、剧情选项） */
const cssVars = computed(() => {
  const vars: Record<string, string> = { ...state.themeStyle.value };
  const map: Record<string, string> = {
    '--c-primary': '--sb-primary',
    '--c-accent': '--sb-accent',
    '--c-success': '--sb-success',
    '--c-warning': '--sb-warning',
    '--c-danger': '--sb-danger',
    '--c-surface': '--sb-surface',
    '--c-surface-alt': '--sb-surface-alt',
    '--c-text': '--sb-text',
    '--c-text-muted': '--sb-text-muted',
    '--c-text-on-primary': '--sb-text-on-primary',
    '--c-border': '--sb-border',
  };
  for (const [c, sb] of Object.entries(map)) {
    vars[c] = vars[sb];
  }
  return vars;
});
</script>

<style scoped>
/* 弹窗打开时状态栏自身模糊（只模糊状态栏，不影响系统界面） */
.status-root.is-blurred {
  filter: blur(3px);
  transition: filter 0.25s ease;
}

.status-root {
  width: 100%;
}

.status-missing {
  display: none;
}
</style>
