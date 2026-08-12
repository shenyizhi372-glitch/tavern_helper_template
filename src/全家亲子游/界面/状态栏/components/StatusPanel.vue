<template>
  <div class="sb-panel">
    <StatImage class="sb-scene" :source="sceneSource" :data="data" ratio="16/9" placeholder="🏠" />
    <HeaderRow :data="data.系统" />
    <div class="sb-chars">
      <CharSection
        v-for="(char, name) in data.角色"
        :key="name"
        :name="name"
        :char="char"
        :store="store"
      />
    </div>
    <PlotOptions v-if="data.剧情.可选发展.length" :options="data.剧情.可选发展" />
  </div>
</template>

<script setup lang="ts">
import type { Schema } from '../../../schema';
import CharSection from './CharSection.vue';
import HeaderRow from './HeaderRow.vue';
import PlotOptions from './PlotOptions.vue';
import StatImage from '../../../../通用/状态栏/components/StatImage.vue';

defineProps<{
  data: Schema;
  store: { data: Schema };
}>();

/**
 * 场景图映射（项目静态图，推送到 GitHub 后经 jsdelivr CDN 加载）：
 * AI 只需维护 系统.地点 变量，前端按地点名查表显示对应场景图。
 */
const SCENE_IMAGES: Record<string, string> = {
  '家·客厅': 'https://testingcf.jsdelivr.net/gh/shenyizhi372-glitch/tavern_helper_template/src/全家亲子游/图片/客厅.svg',
  '家·厨房': 'https://testingcf.jsdelivr.net/gh/shenyizhi372-glitch/tavern_helper_template/src/全家亲子游/图片/厨房.svg',
};

const sceneSource = {
  type: 'mapped' as const,
  by: '系统.地点',
  map: SCENE_IMAGES,
};
</script>
