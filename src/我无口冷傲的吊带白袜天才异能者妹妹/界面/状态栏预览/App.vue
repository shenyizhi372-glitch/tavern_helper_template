<template>
  <div class="preview-page">
    <div class="preview-note">▼ 我无口冷傲的吊带白袜天才异能者妹妹 状态栏预览（MVU 版 · 通用 StatusBar）</div>
    <div class="stage-switch">
      <button
        v-for="s in stages"
        :key="s.id"
        :class="{ active: currentId === s.id }"
        @click="switchStage(s.id)"
      >
        {{ s.label }}
      </button>
    </div>
    <StatusBar :config="config" :theme="theme" :data="mock.data" :store="mock" />
    <div class="preview-note">
      💡 图鉴立绘按调教进度阈值解锁（右上 ⚙️ 打开设置查看图鉴）；预览为内联 SVG 占位图
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import StatusBar from '../../../通用/状态栏/App.vue';
import { config as baseConfig } from '../状态栏/config';
import { theme } from '../状态栏/theme';
import type { StatusBarConfig } from '../../../通用/状态栏/types';

/** 内联 SVG 占位立绘（不依赖 CDN） */
function demoPortrait(color: string, label: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="400"><rect width="300" height="400" fill="${color}"/><text x="150" y="210" font-size="26" text-anchor="middle" fill="#ffffff">${label}</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

/** 预览配置：深拷贝生产 config，仅替换图鉴立绘 URL 为内联占位图 */
const config: StatusBarConfig = (() => {
  const c = structuredClone(baseConfig) as StatusBarConfig;
  const colors: Record<string, string> = {
    叶冰璃_抗拒: '#90caf9',
    叶冰璃_动摇: '#fdd835',
    叶冰璃_沉沦: '#fb8c00',
    叶冰璃_臣服: '#e53935',
  };
  if (c.gallery) {
    for (const ch of c.gallery.characters) {
      for (const img of ch.images) {
        const key = `${ch.id}_${img.id}`;
        if (colors[key]) img.url = demoPortrait(colors[key], img.label);
      }
    }
  }
  return c;
})();

const stages = [
  { id: 'kangju', label: '抗拒期 调教0' },
  { id: 'dongyao', label: '动摇期 调教45' },
  { id: 'chenlun', label: '沉沦期 调教70' },
  { id: 'chenfu', label: '臣服期 调教95' },
  { id: 'weiji', label: '临界 怀疑度90' },
];

const currentId = ref('kangju');

/** mock 数据：对应 schema.ts 变量结构（stat_data），各阶段预置不同数值 */
const mock = reactive({
  data: {
    系统: {
      当前剧情阶段: '起·相遇',
      当前地点: '异能黑暗森林',
      最近事件: '叶冰璃接下学院委托，深入森林调查蛮魔族',
    },
    叶冰璃: {
      调教进度: 0,
      胸部状况: '匀称贫乳被蓝白裙衣襟轻轻遮住，乳尖平静',
      私处状况: '无毛肥穴闭合，尚未被开发',
      淫纹状况: '小腹光洁，还没有淫纹',
      脸部状况: '面无表情，湛蓝美眸空洞',
      吊带袜状况: '白色吊带袜干净整洁，勒着大腿根部雪白肉肉',
      内心话: '学院委托……尽快完成，不想在森林里多待',
    },
    叶理: { 怀疑度: 0 },
    支线: {
      苏沐雪: { 攻略进度: 0 },
      白汐: { 攻略进度: 0 },
      炎绯: { 攻略进度: 0 },
      林晚晴: { 攻略进度: 0 },
    },
  },
});

const stageData: Record<string, any> = {
  kangju: {
    系统: { 当前剧情阶段: '起·相遇', 当前地点: '异能黑暗森林', 最近事件: '叶冰璃接下学院委托，深入森林调查蛮魔族' },
    叶冰璃: {
      调教进度: 0,
      胸部状况: '匀称贫乳被蓝白裙衣襟轻轻遮住，乳尖平静',
      私处状况: '无毛肥穴闭合，尚未被开发',
      淫纹状况: '小腹光洁，还没有淫纹',
      脸部状况: '面无表情，湛蓝美眸空洞',
      吊带袜状况: '白色吊带袜干净整洁',
      内心话: '学院委托……尽快完成，不想在森林里多待',
    },
    叶理: { 怀疑度: 0 },
    支线: { 苏沐雪: { 攻略进度: 0 }, 白汐: { 攻略进度: 0 }, 炎绯: { 攻略进度: 0 }, 林晚晴: { 攻略进度: 0 } },
  },
  dongyao: {
    系统: { 当前剧情阶段: '承·破冰', 当前地点: '异能黑暗森林', 最近事件: '叶冰璃以调查为名再次赴约，足袜调教' },
    叶冰璃: {
      调教进度: 45,
      胸部状况: '乳尖在衣料下悄然挺立',
      私处状况: '肥穴微湿，被调教出反应',
      淫纹状况: '小腹光洁，还没有淫纹',
      脸部状况: '冷脸绷着，耳根泛红',
      吊带袜状况: '吊带袜被卷到大腿根，袜口微湿',
      内心话: '身体……不争气……',
    },
    叶理: { 怀疑度: 45 },
    支线: { 苏沐雪: { 攻略进度: 30 }, 白汐: { 攻略进度: 0 }, 炎绯: { 攻略进度: 0 }, 林晚晴: { 攻略进度: 0 } },
  },
  chenlun: {
    系统: { 当前剧情阶段: '转·扩张', 当前地点: '蛮魔族领地', 最近事件: '叶冰璃以首领的女人身份公开亮相' },
    叶冰璃: {
      调教进度: 70,
      胸部状况: '贫乳衣襟凌乱，乳尖红肿挺立',
      私处状况: '肥穴湿透，被开发得服帖',
      淫纹状况: '小腹紫色爱心淫纹，色泽加深',
      脸部状况: '面无表情，眼角却泛着潮红',
      吊带袜状况: '吊带袜半褪，袜口湿痕明显',
      内心话: '主人……想回去……',
    },
    叶理: { 怀疑度: 75 },
    支线: { 苏沐雪: { 攻略进度: 60 }, 白汐: { 攻略进度: 40 }, 炎绯: { 攻略进度: 20 }, 林晚晴: { 攻略进度: 10 } },
  },
  chenfu: {
    系统: { 当前剧情阶段: '合·验收', 当前地点: '蛮魔族领地', 最近事件: '叶冰璃在哥哥面前亲口承认归属' },
    叶冰璃: {
      调教进度: 95,
      胸部状况: '衣襟大敞，乳尖沾着水光',
      私处状况: '肥穴被反复开苞，乖顺地翕张',
      淫纹状况: '小腹淫纹艳红，像活着的烙印',
      脸部状况: '面无表情，眼底却全是依恋',
      吊带袜状况: '吊带袜被撕破一条，挂在脚踝',
      内心话: '主人……冰璃是主人的……',
    },
    叶理: { 怀疑度: 100 },
    支线: { 苏沐雪: { 攻略进度: 85 }, 白汐: { 攻略进度: 70 }, 炎绯: { 攻略进度: 65 }, 林晚晴: { 攻略进度: 55 } },
  },
  weiji: {
    系统: { 当前剧情阶段: '转·扩张', 当前地点: '家门', 最近事件: '叶理盯梢至森林边缘，差一步撞破' },
    叶冰璃: {
      调教进度: 60,
      胸部状况: '衣襟下乳尖挺立',
      私处状况: '肥穴湿润，刚结束调教',
      淫纹状况: '小腹紫色爱心淫纹清晰可见',
      脸部状况: '面无表情，睫毛微颤',
      吊带袜状况: '吊带袜袜口微湿',
      内心话: '哥哥……别问了……',
    },
    叶理: { 怀疑度: 90 },
    支线: { 苏沐雪: { 攻略进度: 55 }, 白汐: { 攻略进度: 30 }, 炎绯: { 攻略进度: 25 }, 林晚晴: { 攻略进度: 15 } },
  },
};

function switchStage(id: string) {
  currentId.value = id;
  Object.assign(mock.data, stageData[id]);
}
</script>

<style>
.preview-page {
  max-width: 760px;
  margin: 0 auto;
  padding: 12px;
}
.stage-switch {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  justify-content: center;
  margin-bottom: 10px;
}
.stage-switch button {
  border: 1px solid #b3d9f5;
  background: #fff;
  color: #0277bd;
  border-radius: 14px;
  padding: 4px 12px;
  font-size: 12px;
  cursor: pointer;
}
.stage-switch button.active {
  background: #0277bd;
  color: #fff;
}
.preview-note {
  max-width: 720px;
  margin: 14px auto 6px;
  font-size: 12px;
  color: #6d8a9e;
  text-align: center;
}
</style>
