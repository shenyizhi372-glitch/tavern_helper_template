<template>
  <div class="status-root" :style="cssVars">
    <div class="sb-topbar">
      <span class="sb-topbar-title">🏡 全家亲子游</span>
      <SettingsButton @click="settingsOpen = true" />
    </div>
    <StatusPanel v-if="store.data" :data="store.data" :store="store" />
    <div v-else class="status-missing">[状态栏缺失]</div>
    <SettingsModal
      v-model="settingsOpen"
      :gallery="gallery"
      :settings="settings"
      :data="store.data"
      :state="state"
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

/** 设置与解锁状态（localStorage 持久化） */
const state = useSettings(gallery, settings);

// 首次访问默认温馨家庭主题（之后记住用户选择）
if (!localStorage.getItem('sb:theme')) {
  state.themeId.value = 'family';
}

/** 供子组件读取主题配置与密钥解锁记录 */
provide('sbTheme', state.mergedTheme);
provide('sbKeys', state.keys);

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
    '--c-border': '--sb-border',
  };
  for (const [c, sb] of Object.entries(map)) {
    vars[c] = vars[sb];
  }
  return vars;
});
</script>

<style scoped>
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
