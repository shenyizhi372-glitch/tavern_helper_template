<template>
  <div ref="rootEl" class="sb-status-bar" :class="{ 'is-blurred': settingsOpen }" :style="rootStyle">
    <div class="sb-headbar">
      <div class="sb-title">{{ config.title }}</div>
      <SettingsButton class="sb-headbar-settings" @click="settingsOpen = true" />
    </div>
    <div class="sb-role-tabs">
      <button
        v-for="r in roleTabs"
        :key="r.id"
        class="sb-role-tab"
        :class="{ active: activeTabId === r.id }"
        type="button"
        @click="activeTabId = r.id"
      >
        <span class="sb-role-tab-icon">{{ r.icon || '👤' }}</span>
        <span class="sb-role-tab-name">{{ r.name || r.id }}</span>
      </button>
    </div>
    <StatusSection
      v-for="section in visibleSections"
      :key="section.id"
      :section="section"
      :data="data"
      :store="store"
    />
    <SettingsModal
      v-model="settingsOpen"
      :settings="settings"
      :data="data"
      :state="state"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, provide, ref, watch } from 'vue';
import { normalizeStatusBarConfig } from '../../../通用/状态栏/config.schema';
import { useSettings } from '../../../通用/状态栏/useSettings';
import StatusSection from '../../../通用/状态栏/components/StatusSection.vue';
import SettingsButton from '../../../通用/状态栏/components/SettingsButton.vue';
import SettingsModal from '../../../通用/状态栏/components/SettingsModal.vue';
import { useDataStore } from './store';
import { config as rawConfig, settings } from './config';

const store = useDataStore();
const data = computed(() => store.data);
const config = computed(() => normalizeStatusBarConfig(rawConfig));

const roleTabs = computed(() => rawConfig.roles ?? []);
const activeTabId = ref(roleTabs.value[0]?.id ?? '');

const visibleSections = computed(() => {
  const sections = config.value.sections;
  if (roleTabs.value.length <= 1) return sections;
  return sections.filter((s) => !s.role || s.role === activeTabId.value);
});

const state = useSettings(undefined, settings);

/** 首次加载默认使用项目主题（未手动选过主题时） */
if (!localStorage.getItem('sb:theme')) {
  state.themeId.value = 'gufeng';
}

provide('sbTheme', state.mergedTheme);
provide('sbKeys', state.keys);

watch(
  () => data.value,
  () => state.syncUnlocked(data.value),
  { immediate: true },
);

const settingsOpen = ref(false);

const rootStyle = computed(() => {
  const theme = state.mergedTheme.value;
  return {
    '--c-primary': theme.colors.primary,
    '--c-accent': theme.colors.accent,
    '--c-success': theme.colors.success,
    '--c-warning': theme.colors.warning,
    '--c-danger': theme.colors.danger,
    '--c-surface': theme.colors.surface,
    '--c-surface-alt': theme.colors.surfaceAlt,
    '--c-text': theme.colors.text,
    '--c-text-muted': theme.colors.textMuted,
    '--c-text-on-primary': theme.colors.textOnPrimary,
    '--c-border': theme.colors.border,
    '--c-progress-track': theme.colors.progressTrack,
    '--c-progress-fill': theme.colors.progressFill,
    '--f-family': theme.font.family,
    '--f-size-small': theme.font.sizeSmall,
    '--f-size-label': theme.font.sizeLabel,
    '--r-panel': theme.radius.panel,
    '--r-pill': theme.radius.pill,
  };
});
</script>
