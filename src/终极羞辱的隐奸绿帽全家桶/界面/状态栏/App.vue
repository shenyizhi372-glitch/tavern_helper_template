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
      <button
        class="sb-role-tab"
        :class="{ active: activeTabId === 'achievement' }"
        type="button"
        @click="activeTabId = 'achievement'"
      >
        <span class="sb-role-tab-icon">📚</span>
        <span class="sb-role-tab-name">成就图鉴</span>
      </button>
    </div>
    <AchievementPanel v-if="activeTabId === 'achievement'" :data="data" />
    <template v-else>
      <StatusSection
        v-for="section in visibleSections"
        :key="section.id"
        :section="section"
        :data="data"
        :store="store"
      />
    </template>
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
import { normalizeStatusBarConfig } from '../../../通用/状态栏/config.schema';
import { useSettings } from '../../../通用/状态栏/useSettings';
import StatusSection from '../../../通用/状态栏/components/StatusSection.vue';
import SettingsButton from '../../../通用/状态栏/components/SettingsButton.vue';
import SettingsModal from '../../../通用/状态栏/components/SettingsModal.vue';
import AchievementPanel from './components/AchievementPanel.vue';
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

const state = useSettings(config.value.gallery, settings);

/** 首次加载默认使用项目主题（未手动选过主题时） */
if (!localStorage.getItem('sb:theme')) {
  state.themeId.value = 'zhongji';
}

provide('sbTheme', state.mergedTheme);
provide('sbKeys', state.keys);
provide('sbPortraitAuto', state.portraitAuto);

watch(
  () => data.value,
  () => state.syncUnlocked(data.value),
  { immediate: true },
);

const settingsOpen = ref(false);

const settingsTab = ref<'appearance' | 'gallery' | 'gallery-manage'>('appearance');
provide('sbSettingsTab', settingsTab);
provide('sbOpenSettings', (tab: 'appearance' | 'gallery' | 'gallery-manage') => {
  settingsTab.value = tab;
  settingsOpen.value = true;
});

const rootEl = ref<HTMLElement | null>(null);
const getAnchor = (): HTMLElement | null => rootEl.value;

const rootStyle = computed(() => state.themeStyle.value);
</script>

<style scoped>
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

.sb-role-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3em;
  margin-bottom: var(--sb-gap-section);
}

.sb-role-tab {
  display: inline-flex;
  align-items: center;
  gap: 0.3em;
  padding: 0.3em 0.6em;
  border: 1px solid var(--sb-border);
  border-radius: var(--sb-radius-pill);
  background-color: var(--sb-surface-alt);
  color: var(--sb-text);
  cursor: pointer;
  font-size: 0.85em;
}

.sb-role-tab.active {
  background-color: var(--sb-primary);
  border-color: var(--sb-primary);
  color: #fff;
}
</style>
