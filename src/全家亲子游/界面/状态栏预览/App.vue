<template>
  <div class="preview-page">
    <div class="preview-note">▼ MVU 版状态栏 · 客厅（mock 数据，可交互：好感度 +/-、剧情选项）</div>
    <StatusPanel :data="livingRoom.data" :store="livingRoom" />

    <div class="preview-note">▼ 厨房场景（mapped 场景图切换演示，CDN 推送后显示图片）</div>
    <StatusPanel :data="kitchen.data" :store="kitchen" />

    <div class="preview-note">
      💡 提示：好感度 +/- 按钮可直接点击（修改 mock 数据）；剧情选项点击在预览环境会以 toastr
      提示（无酒馆，不真正发消息）
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import type { Schema } from '../../schema';
import StatusPanel from '../状态栏/components/StatusPanel.vue';
import '../状态栏/global.css';

/** 预览专用 mock store：结构与 MVU store 一致（{ data: Schema }），reactive 保证交互响应式 */
function makeStore(overrides: Partial<Schema> = {}) {
  return reactive({
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
      ...overrides,
    } as Schema,
  });
}

const livingRoom = makeStore();

const kitchen = makeStore({
  系统: { 日期: '2026年8月12日', 时间: '傍晚 6:00', 地点: '家·厨房' },
  剧情: {
    当前事件: '晚餐时分，孙莹在灶台前忙活',
    可选发展: [
      { type: '正常', text: '主动摆碗筷，开饭等爸爸视频' },
      { type: '色情', text: '借摆碗筷贴近妈妈，手不老实' },
      { type: '淫秽', text: '从身后抵住妈妈，隔着睡裤磨蹭' },
    ],
  },
});
</script>

<style scoped>
.preview-page {
  width: 100%;
}

.preview-note {
  max-width: 720px;
  margin: 18px auto 6px;
  font-size: 12px;
  color: #8a7d6d;
  text-align: center;
}
</style>
