<template>
  <div class="preview-page" :style="cssVars">
    <div class="preview-note">
      ▼ 全家亲子游 MVU 版（好感度调节需密钥解锁；右上 ⚙️ 打开设置：主题/字号/立绘/图鉴）
    </div>
    <div class="status-root" :class="{ 'is-blurred': settingsOpen }">
      <StatusPanel
        ref="panelRef"
        title="🏡 全家亲子游"
        :data="mock.data"
        :store="mock"
        :gallery="galleryState"
      />
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
import type { GalleryConfig } from '../../../通用/状态栏/types';
import StatusPanel from '../状态栏/components/StatusPanel.vue';
import SettingsModal from '../../../通用/状态栏/components/SettingsModal.vue';
import { useSettings } from '../../../通用/状态栏/useSettings';
import { gallery, settings } from '../状态栏/gallery';
import '../状态栏/global.css';

/** 预览专用 mock store：结构与 MVU store 一致（{ data: Schema }），reactive 保证交互响应式 */
const mock = reactive({
  data: {
    系统: { 日期: '5月12日 星期二', 时间: '傍晚六点', 地点: '家·厨房' },
    角色: {
      孙莹: {
        表情: '👩',
        _用户: false,
        穿着: '吊带背心外系围裙，家常睡裤',
        神态: '被油烟气熏得泛红，发丝有些散',
        心情: '放松，只当儿子今天黏人',
        当前行动: '系围裙炒番茄牛腩，扬声催儿子摆碗筷',
        胸部状况: '围裙系带勒出胸线，背心领口敞着',
        私处状况: '内裤边濡湿一小块，只当白带',
        脸部状况: '被油烟气熏得泛红，发丝有些散',
        最近性行为: '无',
        好感度: 60,
      },
      儿子: {
        表情: '🧑',
        _用户: true,
        穿着: '校服外套没脱，脚踩拖鞋',
        神态: '闷声不吭，呼吸沉沉扑在妈妈后颈',
        心情: '黏着妈妈',
        当前行动: '贴着妈妈后背，手搭在她腰侧',
        胸部状况: '',
        私处状况: '',
        脸部状况: '',
        最近性行为: '',
        好感度: 50,
      },
    },
    剧情: {
      当前事件: '爸爸去临省出差一个月，家里只剩母子俩；傍晚厨房做饭，儿子贴得很近',
      可选发展: [
        { type: '正常', text: '应声去摆碗筷，开饭等爸爸视频' },
        { type: '色情', text: '借摆碗筷贴近妈妈，手不老实' },
        { type: '淫秽', text: '从身后抵住妈妈，隔着睡裤磨蹭' },
        { type: '其他', text: '提作业话题岔开' },
      ],
    },
  } as Schema,
});

const settingsOpen = ref(false);

/** 弹窗锚点：当前状态栏面板（.sb-panel），弹窗以面板中心为基准定位 */
const panelRef = ref<InstanceType<typeof StatusPanel> | null>(null);
const getAnchor = (): HTMLElement | null => (panelRef.value?.$el as HTMLElement | undefined) ?? null;

/**
 * 图鉴配置：与生产一致支持「图鉴管理」编辑（localStorage 持久化）。
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
/** 显示立绘开关（无图模式） */
provide('sbPortraitVisible', state.portraitVisible);

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
</style>
