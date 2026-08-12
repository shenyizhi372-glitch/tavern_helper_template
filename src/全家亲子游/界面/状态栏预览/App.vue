<template>
  <div class="preview-page" :style="cssVars">
    <div class="preview-note">
      ▼ 全家亲子游 MVU 版（好感度调节需密钥解锁；右上 ⚙️ 打开设置：主题/字号/图鉴）
    </div>
    <div class="status-root">
      <div class="sb-topbar">
        <span class="sb-topbar-title">🏡 全家亲子游</span>
        <SettingsButton @click="settingsOpen = true" />
      </div>
      <StatusPanel :data="mock.data" :store="mock" />
      <SettingsModal
        v-model="settingsOpen"
        :gallery="gallery"
        :settings="settings"
        :data="mock.data"
        :state="state"
      />
    </div>
    <div class="preview-note">💡 演示密钥：family2026（解锁好感度调节与「沉沦」立绘；主题可切换）</div>
  </div>
</template>

<script setup lang="ts">
import { computed, provide, ref, reactive } from 'vue';
import type { Schema } from '../../schema';
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

/** 设置与解锁状态（localStorage 持久化，与生产一致） */
const state = useSettings(gallery, settings);
if (!localStorage.getItem('sb:theme')) {
  state.themeId.value = 'family';
}

provide('sbTheme', state.mergedTheme);
provide('sbKeys', state.keys);

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
