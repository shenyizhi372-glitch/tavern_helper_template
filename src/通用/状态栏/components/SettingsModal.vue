<template>
  <VueFinalModal v-model="open" :click-to-close="true" class="sb-settings-vfm">
    <!-- :style 应用主题变量：弹窗 teleport 到 body，拿不到 .status-root 上的 --sb-*，需在此补上才能跟随主题 -->
    <div class="sb-settings" :style="state.themeStyle.value">
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
          @click="onTabClick(tab.id)"
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
        <div v-if="gallery" class="sb-settings-group">
          <label class="sb-settings-check">
            <input type="checkbox" v-model="portraitAuto" />
            <span>立绘随变量切换</span>
          </label>
          <div class="sb-settings-check-note">关闭后固定显示初始立绘，不再随好感度等条件切换</div>
          <div class="sb-settings-group-label">立绘大小 {{ portrait }}px</div>
          <input
            class="sb-settings-range"
            type="range"
            min="100"
            max="240"
            step="10"
            :value="portrait"
            @input="portrait = Number(($event.target as HTMLInputElement).value)"
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

      <!-- 图鉴管理（作者调试） -->
      <div v-show="activeTab === 'gallery-manage'" class="sb-settings-body">
        <GalleryEditor
          v-if="galleryEditable && gallery"
          :gallery="gallery"
          :original="originalGallery"
        />
        <div v-else class="sb-settings-empty">本卡未启用图鉴管理</div>
      </div>
    </div>
  </VueFinalModal>
</template>

<script setup lang="ts">
import { computed, inject, nextTick, onMounted, onUnmounted, ref, watch, type Ref } from 'vue';
import { VueFinalModal } from 'vue-final-modal';
import type { GalleryConfig, SettingsConfig } from '../types';
import type { SettingsState } from '../useSettings';
import GalleryPanel from './GalleryPanel.vue';
import GalleryEditor from './GalleryEditor.vue';

const props = defineProps<{
  modelValue: boolean;
  gallery?: GalleryConfig;
  /** 代码里的原始图鉴配置（图鉴管理「重置」用） */
  originalGallery?: GalleryConfig;
  settings?: SettingsConfig;
  data: unknown;
  /** useSettings 状态（由入口 App 创建后传入） */
  state: SettingsState;
  /** 弹窗锚点：返回状态栏面板元素（如 .sb-panel）；缺省时弹窗居中于视口 */
  getAnchor?: () => HTMLElement | null;
  /** 启用「图鉴管理」编辑 tab（作者调试用；gallery 需为可变响应式对象） */
  galleryEditable?: boolean;
}>();

const emit = defineEmits<{ 'update:modelValue': [boolean] }>();

const open = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value),
});

type SettingsTabId = 'appearance' | 'gallery' | 'gallery-manage';

const activeTab = ref<SettingsTabId>('appearance');
const tabs = computed(() => [
  { id: 'appearance' as const, label: '外观' },
  { id: 'gallery' as const, label: '图鉴' },
  ...(props.galleryEditable ? [{ id: 'gallery-manage' as const, label: '图鉴管理' }] : []),
]);

const DENSITIES = [
  { value: 'compact' as const, label: '紧凑' },
  { value: 'normal' as const, label: '常规' },
  { value: 'comfortable' as const, label: '舒适' },
];

const { presets, themeId, density, fontScale, portrait, portraitAuto, tryKey, imageUnlocked } = props.state;

/** 外部切换 tab 信号（由 App 注入：如点击好感度锁 → 跳转图鉴 tab） */
const settingsTab = inject<Ref<SettingsTabId>>('sbSettingsTab', ref('appearance'));
watch(settingsTab, (tab) => {
  if (tab !== activeTab.value) {
    activeTab.value = tab;
    nextTick(positionModal);
  }
});

/* ===== 弹窗定位：锚定到状态栏面板中心（无锚点时回退 CSS 默认的视口居中） ===== */
let positionRaf = 0;

function positionModal() {
  const anchor = props.getAnchor?.() ?? null;
  const contents = Array.from(document.querySelectorAll<HTMLElement>('.vfm__content'));
  if (!contents.length) {
    return;
  }
  let left: number | null = null;
  let top: number | null = null;
  if (anchor) {
    const rect = anchor.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const width = contents[0].offsetWidth;
    const height = contents[0].offsetHeight;
    left = Math.min(Math.max(cx - width / 2, 8), Math.max(window.innerWidth - width - 8, 8));
    top = Math.min(Math.max(cy - height / 2, 8), Math.max(window.innerHeight - height - 8, 8));
  }
  for (const el of contents) {
    if (left === null || top === null) {
      el.style.top = '';
      el.style.left = '';
      el.style.transform = '';
    } else {
      el.style.top = `${top}px`;
      el.style.left = `${left}px`;
      el.style.transform = 'none';
    }
  }
}

/** resize / scroll 后重算（rAF 节流；scroll 捕获阶段可跟随聊天滚动） */
function onViewportChange() {
  cancelAnimationFrame(positionRaf);
  positionRaf = requestAnimationFrame(positionModal);
}

/** 切换 tab 后弹窗尺寸变化，重算一次防被视口边界裁剪 */
function onTabClick(id: SettingsTabId) {
  activeTab.value = id;
  nextTick(positionModal);
}

watch(open, (value) => {
  if (value) {
    // teleport 内容异步挂载：nextTick 后仍需等一帧才能测到 .vfm__content 尺寸
    nextTick(() => {
      requestAnimationFrame(() => requestAnimationFrame(positionModal));
    });
  }
});

onMounted(() => {
  window.addEventListener('resize', onViewportChange);
  window.addEventListener('scroll', onViewportChange, { passive: true, capture: true });
});

onUnmounted(() => {
  window.removeEventListener('resize', onViewportChange);
  window.removeEventListener('scroll', onViewportChange, { capture: true });
  cancelAnimationFrame(positionRaf);
});
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

.sb-settings-check {
  display: flex;
  align-items: center;
  gap: 0.5em;
  margin-bottom: 0.3em;
  cursor: pointer;
  font-size: var(--sb-font-size-label);
}

.sb-settings-check input {
  accent-color: var(--sb-primary);
  cursor: pointer;
}

.sb-settings-check-note {
  margin-bottom: 0.5em;
  font-size: var(--sb-font-size-small);
  color: var(--sb-text-muted);
}

.sb-settings-empty {
  padding: 1.5em 0;
  text-align: center;
  color: var(--sb-text-muted);
  font-size: var(--sb-font-size-label);
}
</style>

<!-- vue-final-modal 最小样式（模板 css rule 排除 node_modules，自行提供遮罩/定位）
     遮罩透明、无 backdrop-filter：背景模糊由状态栏容器自身 blur 实现（只模糊状态栏，不影响系统界面） -->
<style>
.vfm--overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  pointer-events: none;
}

.vfm__content {
  /* 相对视口的精确正中心（不依赖 flex 布局） */
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1001;
  pointer-events: auto;
  max-width: 92vw;
  max-height: 84vh;
  overflow: auto;
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
