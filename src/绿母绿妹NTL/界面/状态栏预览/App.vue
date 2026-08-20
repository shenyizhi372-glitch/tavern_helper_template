<template>
  <div class="preview-page">
    <div class="preview-note">▼ 绿母绿妹NTL 状态栏预览（MVU 版 · 通用 StatusBar）</div>
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
      💡 图鉴立绘按堕落度阈值解锁（右上 ⚙️ 打开设置查看图鉴）；预览为内联 SVG 占位图
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
    林小蛮_初见: '#8fbf8f',
    林小蛮_契约: '#e6c34a',
    林小蛮_调教: '#e8924a',
    林小蛮_沦陷: '#d45555',
    林凤仪_初见: '#7fa8d9',
    林凤仪_契约: '#b78ad4',
    林凤仪_动摇: '#d47a9e',
    林凤仪_沦陷: '#c2456a',
  };
  if (c.gallery) {
    for (const ch of c.gallery.characters) {
      for (const img of ch.images) {
        const key = `${ch.name}_${img.label}`;
        img.url = demoPortrait(colors[key] ?? '#888888', `${ch.name}·${img.label}`);
      }
    }
  }
  return c;
})();

/** 预览 mock store：结构与 MVU store 一致（{ data }），reactive 保证切换响应式 */
const mock = reactive({
  data: {
    世界: {
      当前日期: '2026/08/12',
      当前时间段: '夜晚',
      当前场景: '林家-客厅',
      剧情阶段: '初始',
      最近事件: '星探转向哥哥林白，哥哥劝妹妹签下偶像合约',
    },
    林小蛮: {
      好感度: 5,
      堕落度: 0,
      胸部状况: '贫乳平坦，乳尖被校服摩擦得微微挺立',
      私处状况: '白虎肥穴紧致闭合，粉嫩厚唇贴在一起，被紧身裤勒出骆驼趾轮廓，爱液微微渗出润湿裤缝',
      脸部状况: '眼眶红红的，别过脸嘴硬，虎牙咬着下唇',
      白袜状况: '白袜踩着拖鞋，脚趾蜷起',
      内心话: '既然哥哥第一次拜托我……就这一次，为了他，丢人就丢人吧',
    },
    林凤仪: {
      好感度: 0,
      堕落度: 0,
      胸部状况: '木瓜巨乳沉甸甸坠着，乳尖在居家服下悄然挺立',
      私处状况: '黑阴毛茂盛下肥厚阴唇充血微肿，蜜缝湿润',
      脸部状况: '凤目盯着合同，指尖停在违约金栏，眉间微蹙',
      内心话: '这合同得看仔细，女儿不能受委屈……可我这身子怎么一阵阵发燥',
    },
  },
});

interface Stage {
  id: string;
  label: string;
  data: typeof mock.data;
}

const stages: Stage[] = [
  {
    id: 'initial',
    label: '初始',
    data: {
      世界: { 当前日期: '2026/08/12', 当前时间段: '夜晚', 当前场景: '林家-客厅', 剧情阶段: '初始', 最近事件: '星探转向哥哥林白，哥哥劝妹妹签下偶像合约' },
      林小蛮: {
        好感度: 5, 堕落度: 0,
        胸部状况: '贫乳平坦，乳尖被校服摩擦得微微挺立',
        私处状况: '白虎肥穴紧致闭合，粉嫩厚唇贴在一起，被紧身裤勒出骆驼趾轮廓，爱液微微渗出润湿裤缝',
        脸部状况: '眼眶红红的，别过脸嘴硬，虎牙咬着下唇',
        白袜状况: '白袜踩着拖鞋，脚趾蜷起',
        内心话: '既然哥哥第一次拜托我……就这一次，为了他，丢人就丢人吧',
      },
      林凤仪: {
        好感度: 0, 堕落度: 0,
        胸部状况: '木瓜巨乳沉甸甸坠着，乳尖在居家服下悄然挺立',
        私处状况: '黑阴毛茂盛下肥厚阴唇充血微肿，蜜缝湿润',
        脸部状况: '凤目盯着合同，指尖停在违约金栏，眉间微蹙',
        内心话: '这合同得看仔细，女儿不能受委屈……可我这身子怎么一阵阵发燥',
      },
    },
  },
  {
    id: 'contract',
    label: '妹妹契约期',
    data: {
      世界: { 当前日期: '2026/08/14', 当前时间段: '下午', 当前场景: '集团-培训室', 剧情阶段: '妹妹契约期', 最近事件: '林小蛮穿勒逼紧身裤坐瑜伽球拍写真，培训师全程指导' },
      林小蛮: {
        好感度: 25, 堕落度: 40,
        胸部状况: '贫乳被紧身衣勒出轮廓，乳尖在布料下挺立，随瑜伽球的颠动轻轻颤动',
        私处状况: '白虎肥穴被勒逼紧身裤勒出骆驼趾，两片粉嫩厚唇被挤压得微微张开，爱液不断渗出把裤缝浸得湿透',
        脸部状况: '脸红气喘，骂着"变态"却配合，虎牙咬着下唇',
        白袜状况: '白袜脚趾在球面上蜷起，袜尖微微汗湿',
        内心话: '这裤子勒得我下面又湿又痒……可哥哥让我坚持，再忍忍，都是为了他',
      },
      林凤仪: {
        好感度: 10, 堕落度: 0,
        胸部状况: '木瓜巨乳沉甸甸坠着，乳尖在居家服下悄然挺立',
        私处状况: '黑阴毛茂盛下肥厚阴唇充血微肿，蜜缝湿润',
        脸部状况: '凤目微蹙，眉间藏着忧色',
        内心话: '女儿在集团培训，总觉得哪里不对劲……可我又说不出',
      },
    },
  },
  {
    id: 'corrupt',
    label: '母女沦陷期',
    data: {
      世界: { 当前日期: '2026/09/05', 当前时间段: '夜晚', 当前场景: '林家-主卧', 剧情阶段: '母女沦陷期', 最近事件: '母女一同侍奉<user>，林白戴贞操锁被栓在床边' },
      林小蛮: {
        好感度: 90, 堕落度: 90,
        胸部状况: '贫乳被揉得发红，乳尖充血挺立，随起伏的动作乱颤',
        私处状况: '白虎肥穴被灌满精液，红肿外翻，爱液混着白浊顺着大腿根往下淌',
        脸部状况: '潮红痴态，双马尾凌乱，眼神失焦',
        白袜状况: '白袜被淫水精液浸透，袜筒贴着脚踝黏腻一片',
        内心话: '爸爸最厉害了……最喜欢爸爸了，什么哥哥，才不要',
      },
      林凤仪: {
        好感度: 85, 堕落度: 90,
        胸部状况: '木瓜巨乳垂在床单上压出软肉，乳尖被玩得充血发亮',
        私处状况: '黑阴毛肥屄湿透，精液从红肿的穴口缓缓溢出，顺着臀缝流到床单上',
        脸部状况: '凤目泛水光，痴态尽显，嘴角挂着涎水',
        内心话: '依你，都依你……干屄相公快些来，我这屄痒得受不住了',
      },
    },
  },
];

const currentId = ref('initial');

function switchStage(id: string) {
  const s = stages.find(x => x.id === id);
  if (s) {
    currentId.value = id;
    Object.assign(mock.data, JSON.parse(JSON.stringify(s.data)));
  }
}
</script>

<style scoped>
.preview-page {
  width: 100%;
}
.stage-switch {
  display: flex;
  gap: 8px;
  justify-content: center;
  margin: 10px auto 14px;
}
.stage-switch button {
  padding: 6px 16px;
  border: 1px solid #c98ba8;
  border-radius: 14px;
  background: #fff;
  color: #ad1457;
  cursor: pointer;
  font-size: 13px;
}
.stage-switch button.active {
  background: #c2185b;
  color: #fff;
}
.preview-note {
  max-width: 720px;
  margin: 14px auto 6px;
  font-size: 12px;
  color: #8a7d6d;
  text-align: center;
}
</style>
