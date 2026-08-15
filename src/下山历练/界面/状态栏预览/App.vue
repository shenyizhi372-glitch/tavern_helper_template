<template>
  <div class="preview-page">
    <div class="preview-note">▼ 下山历练 状态栏预览（MVU 版 · 通用 StatusBar）</div>
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
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import StatusBar from '../../../通用/状态栏/App.vue';
import { config } from '../状态栏/config';
import { theme } from '../状态栏/theme';

/** 预览 mock store：结构与 MVU store 一致（{ data }），reactive 保证切换响应式 */
const mock = reactive({
  data: {
    系统: {
      当前日期: '2026/08/15',
      当前时间段: '下午',
      当前场景: '都市-街头',
      最近事件: '<user>在街头算命摊前设局，与二娘搭上话',
      结局分支: '进行中',
    },
    user: {
      当前目标: '与二娘周旋，把玉佩赔偿的局做下去',
      已攻略对象: '无',
    },
    二娘: {
      攻略阶段: 1,
      沦陷度: 5,
      胸部状况: '白色背心下雪白爆乳撑得绷紧，乳头顶着布料鼓起，真空无内衣',
      私处状况: '包臀裙下真空，阴毛茂盛的熟女蜜穴，走路时臀肉晃动',
      表情状况: '眼角美人痣随挑眉跳动，嘴上带着大大咧咧的笑，眼神里全是好奇',
      内心话: '这公子哥出手倒是阔气，那玉佩可真值钱？我倒要看看他葫芦里卖的什么药',
    },
    三娘: {
      攻略阶段: 1,
      沦陷度: 0,
      胸部状况: '白色道袍下巨乳鼓胀，衣襟被撑开一线',
      私处状况: '超短裙下白袜肉足并拢，阴毛茂盛藏在裙底',
      表情状况: '双马尾一甩，小虎牙露着，笑嘻嘻打量来人，眼里全是玩心',
      内心话: '二娘说得神神秘秘的，我倒要看看这"有趣的修士"有多有趣',
    },
    大娘: {
      攻略阶段: 1,
      沦陷度: 0,
      胸部状况: '纯白道袍下爆乳沉甸甸地坠着，红肚兜勒出轮廓',
      私处状况: '红肚兜亵裤层层包裹，守了几百年的蜜谷藏在最里层',
      表情状况: '凤眉微蹙，目光冷冽，端坐主位不动如山',
      内心话: '故人之后登门……礼数倒是周全，只是那双眼睛，总让为娘觉得不踏实',
    },
  },
});

const stages = [
  { id: 'initial', label: '初始·二娘线' },
  { id: 'mid', label: '二娘沦陷·三娘线' },
  { id: 'final', label: '全员沦陷' },
];

const currentId = ref('initial');

function switchStage(id: string) {
  currentId.value = id;
  if (id === 'initial') {
    Object.assign(mock.data, initialData());
  } else if (id === 'mid') {
    Object.assign(mock.data, midData());
  } else {
    Object.assign(mock.data, finalData());
  }
}

function initialData() {
  return {
    系统: { ...mock.data.系统 },
    user: { ...mock.data.user },
    二娘: { ...mock.data.二娘 },
    三娘: { ...mock.data.三娘 },
    大娘: { ...mock.data.大娘 },
  };
}

function midData() {
  return {
    系统: {
      当前日期: '2026/08/20',
      当前时间段: '夜晚',
      当前场景: '都市-KTV',
      最近事件: '二娘已沉沦，把<user>引荐给好胜的三娘',
      结局分支: '进行中',
    },
    user: {
      当前目标: '以赌约设套，令三娘落败',
      已攻略对象: '二娘-沉沦期',
    },
    二娘: {
      攻略阶段: 5,
      沦陷度: 92,
      胸部状况: '情趣旗袍开叉到腰，爆乳半露，项圈勒在颈上',
      私处状况: '白虎肥屄，剃得干干净净，被调教得随时泛着水光',
      表情状况: '讨好地笑，尾巴尖都在晃，往<user>身上蹭',
      内心话: '主人今天要见三娘，我得乖一点，主人摸完头才放我走',
    },
    三娘: {
      攻略阶段: 2,
      沦陷度: 25,
      胸部状况: '白色道袍下巨乳鼓胀，衣襟被撑开一线',
      私处状况: '超短裙下白袜肉足并拢，阴毛茂盛藏在裙底',
      表情状况: '双马尾一甩，小虎牙露着，正盘算着怎么赢<user>一局',
      内心话: '这局牌娘娘赢定了，等会儿看他还笑不笑得出来',
    },
    大娘: {
      攻略阶段: 1,
      沦陷度: 0,
      胸部状况: '纯白道袍下爆乳沉甸甸地坠着，红肚兜勒出轮廓',
      私处状况: '红肚兜亵裤层层包裹，守了几百年的蜜谷藏在最里层',
      表情状况: '凤眉微蹙，目光冷冽，端坐主位不动如山',
      内心话: '故人之后登门……礼数倒是周全，只是那双眼睛，总让为娘觉得不踏实',
    },
  };
}

function finalData() {
  return {
    系统: {
      当前日期: '2026/09/10',
      当前时间段: '傍晚',
      当前场景: '仙山-祭堂',
      最近事件: '三位熟母全部臣服，白家祖训被破坏，淫乱日常化',
      结局分支: '进行中',
    },
    user: {
      当前目标: '调教深化，向彻底征服结局推进',
      已攻略对象: '二娘-沉沦期，三娘-沉沦期，大娘-沦陷期',
    },
    二娘: {
      攻略阶段: 5,
      沦陷度: 96,
      胸部状况: '情趣旗袍开叉到腰，爆乳半露，项圈勒在颈上',
      私处状况: '白虎肥屄泛着水光，被调教得熟透',
      表情状况: '讨好地笑，尾巴尖都在晃，往<user>身上蹭',
      内心话: '主人今晚会先摸谁的头呢，我可要抢在三娘前面',
    },
    三娘: {
      攻略阶段: 5,
      沦陷度: 94,
      胸部状况: '超短裙下巨乳鼓胀，白袜肉足并拢，身上还留着调教的痕迹',
      私处状况: '阴毛剃净，蜜穴被调教得肥嫩敏感',
      表情状况: '小虎牙露着，笑嘻嘻给<user>出主意，眼里全是狡黠',
      内心话: '相公今晚该轮到娘娘侍奉了吧，二娘可别想抢',
    },
    大娘: {
      攻略阶段: 5,
      沦陷度: 95,
      胸部状况: '道袍半解，红肚兜歪在一边，爆乳半露',
      私处状况: '亵裤褪下，守了几百年的蜜谷已彻底沦陷',
      表情状况: '凤眼迷离，金黄凤杈散了也不管，依偎在<user>身边',
      内心话: '为娘……现在只想着主人……',
    },
  };
}
</script>

<style>
.preview-page {
  max-width: 720px;
  margin: 0 auto;
}
.preview-note {
  margin: 18px auto 6px;
  font-size: 12px;
  color: #8a7d6d;
  text-align: center;
}
.stage-switch {
  display: flex;
  gap: 8px;
  justify-content: center;
  margin: 12px 0;
}
.stage-switch button {
  padding: 6px 14px;
  border: 1px solid #b39ddb;
  border-radius: 14px;
  background: #fff;
  color: #6a1b9a;
  font-size: 13px;
  cursor: pointer;
}
.stage-switch button.active {
  background: #6a1b9a;
  color: #fff;
}
</style>
