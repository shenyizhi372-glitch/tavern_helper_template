<template>
  <div class="preview-page" :style="cssVars">
    <div class="preview-note">
      ▼ 全家亲子游 MVU 版（好感度调节需密钥解锁；右上 ⚙️ 打开设置：主题/字号/立绘/图鉴）
    </div>
    <div class="status-root" :class="{ 'is-blurred': settingsOpen }">
      <div class="sb-topbar">
        <span class="sb-topbar-title">🏡 全家亲子游</span>
        <SettingsButton @click="settingsOpen = true" />
      </div>
      <StatusPanel ref="panelRef" :data="mock.data" :store="mock" :gallery="galleryState" />
      <SettingsModal
        v-model="settingsOpen"
        :gallery="galleryState"
        :original-gallery="gallery"
        :gallery-editable="true"
        :settings="settings"
        :data="mock.data"
        :state="state"
        :get-anchor="getAnchor"
      />
    </div>
    <div class="preview-note">💡 演示密钥：family2026（解锁好感度调节与「沉沦」立绘；主题可切换）</div>
  </div>
</template>

<script setup lang="ts">
import { computed, provide, reactive, ref } from 'vue';
import type { Schema } from '../../schema';
import type { CharacterGallery, GalleryConfig } from '../../../通用/状态栏/types';
import StatusPanel from '../状态栏/components/StatusPanel.vue';
import SettingsButton from '../../../通用/状态栏/components/SettingsButton.vue';
import SettingsModal from '../../../通用/状态栏/components/SettingsModal.vue';
import { useSettings } from '../../../通用/状态栏/useSettings';
import { gallery, settings } from '../状态栏/gallery';
import '../状态栏/global.css';

/** 预览专用 mock store：结构与 MVU store 一致（{ data: Schema }），reactive 保证交互响应式 */
const mock = reactive({
  data: {
    系统: { 日期: '2026年8月12日', 时间: '上午 9:30', 地点: '家·客厅' },
    角色: {
      孙莹: {
        表情: '👩',
        _用户: false,
        穿着: '米色家居连衣裙，围裙系在腰间',
        神态: '温柔含笑，眼角带着些许疲惫',
        心情: '放松而满足',
        当前行动: '正在收拾茶几上的早餐碗碟',
        好感度: 60,
      },
      张宝: {
        表情: '🧒',
        _用户: true,
        穿着: '印着恐龙图案的蓝色T恤',
        神态: '精力旺盛，眼睛发亮',
        心情: '兴奋雀跃',
        当前行动: '在沙发边摆弄新买的积木',
        好感度: 50,
      },
      小姨: {
        表情: '💃',
        _用户: false,
        穿着: '碎花连衣裙，发梢微卷',
        神态: '慵懒含笑，眼神带着探究',
        心情: '轻松惬意',
        当前行动: '靠在沙发边翻着手机',
        好感度: 60,
      },
    },
    剧情: {
      当前事件: '一家三口的周末早晨，早餐刚结束',
      可选发展: [
        { type: '正常', text: '陪张宝一起搭积木，听他说说幼儿园的新朋友' },
        { type: '正常', text: '帮孙莹收拾碗碟，顺便聊聊今天的安排' },
        { type: '色情', text: '趁张宝玩得入神，把孙莹拉到厨房亲昵一阵' },
      ],
    },
  } as Schema,
});

const settingsOpen = ref(false);

/** 弹窗锚点：当前状态栏面板（.sb-panel），弹窗以面板中心为基准定位 */
const panelRef = ref<InstanceType<typeof StatusPanel> | null>(null);
const getAnchor = (): HTMLElement | null => (panelRef.value?.$el as HTMLElement | undefined) ?? null;

/**
 * 图鉴配置：与生产一致支持「图鉴管理」编辑（localStorage 持久化）；
 * 预览额外追加一个演示角色「小姨」用于验证多角色切换（内联 SVG 占位图，不依赖 CDN）。
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

function demoPortrait(color: string, label: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="400"><rect width="300" height="400" fill="${color}"/><text x="150" y="210" font-size="28" text-anchor="middle" fill="#ffffff">${label}</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

const demoCharacter: CharacterGallery = {
  id: '小姨',
  name: '小姨',
  icon: '💃',
  images: [
    { id: '小姨-日常', label: '日常', url: demoPortrait('#d485a3', '小姨·日常') },
    {
      id: '小姨-亲昵',
      label: '亲昵',
      url: demoPortrait('#c26b8d', '小姨·亲昵'),
      unlock: { type: 'threshold', variable: '角色.小姨.好感度', min: 70 },
    },
  ],
};

const galleryState = reactive(loadGallery()) as GalleryConfig;
if (!galleryState.characters.some(c => c.id === demoCharacter.id)) {
  galleryState.characters.push(demoCharacter);
}

/** 设置弹窗 tab（可由状态栏内锁定标记跳转到图鉴） */
type SettingsTabId = 'appearance' | 'gallery' | 'gallery-manage';
const settingsTab = ref<SettingsTabId>('appearance');

function openSettingsTab(tab: SettingsTabId) {
  settingsTab.value = tab;
  settingsOpen.value = true;
}

provide('sbSettingsTab', settingsTab);
provide('sbOpenSettings', openSettingsTab);

/** 设置与解锁状态（localStorage 持久化，与生产一致） */
const state = useSettings(gallery, settings);
if (!localStorage.getItem('sb:theme')) {
  state.themeId.value = 'family';
}

provide('sbTheme', state.mergedTheme);
provide('sbKeys', state.keys);
/** 供立绘组件读取立绘大小设置 */
provide('sbPortrait', state.portrait);
/** 立绘随变量切换开关（默认开） */
provide('sbPortraitAuto', state.portraitAuto);

/** 主题变量同步到 --c-*（自有组件换肤联动） */
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
.preview-page {
  width: 100%;
}

/* 弹窗打开时状态栏自身模糊（只模糊状态栏，不影响系统界面） */
.status-root.is-blurred {
  filter: blur(3px);
  transition: filter 0.25s ease;
}

.preview-note {
  max-width: 720px;
  margin: 14px auto 6px;
  font-size: 12px;
  color: #8a7d6d;
  text-align: center;
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
</style>
