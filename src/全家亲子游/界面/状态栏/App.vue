<template>
  <div class="status-root" :class="{ 'is-blurred': settingsOpen }" :style="cssVars">
    <div class="sb-topbar">
      <span class="sb-topbar-title">🏡 全家亲子游</span>
      <SettingsButton @click="settingsOpen = true" />
    </div>
    <StatusPanel ref="panelRef" v-if="store.data" :data="store.data" :store="store" />
    <div v-else class="status-missing">[状态栏缺失]</div>
    <SettingsModal
      v-model="settingsOpen"
      :gallery="gallery"
      :settings="settings"
      :data="store.data"
      :state="state"
      :get-anchor="getAnchor"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, provide, ref } from 'vue';
import StatusPanel from './components/StatusPanel.vue';
import SettingsButton from '../../../通用/状态栏/components/SettingsButton.vue';
import SettingsModal from '../../../通用/状态栏/components/SettingsModal.vue';
import { useSettings } from '../../../通用/状态栏/useSettings';
import { useDataStore } from './store';
import { gallery, settings } from './gallery';

const store = useDataStore();
const settingsOpen = ref(false);

/** 弹窗锚点：当前状态栏面板（.sb-panel），弹窗以面板中心为基准定位 */
const panelRef = ref<InstanceType<typeof StatusPanel> | null>(null);
const getAnchor = (): HTMLElement | null => (panelRef.value?.$el as HTMLElement | undefined) ?? null;

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

.sb-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 720px;
  margin: 0 auto 4px;
  padding: 2px 6px;
}

.sb-topbar-title {
  font-size: 12px;
  font-weight: 700;
  color: var(--c-text-muted);
  letter-spacing: 0.15em;
}

.status-missing {
  display: none;
}
</style>
