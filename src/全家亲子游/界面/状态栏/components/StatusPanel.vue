<template>
  <div class="sb-panel">
    <StageImage
      v-if="heroineGallery"
      class="sb-heroine"
      :gallery="heroineGallery"
      :data="data"
      :is-unlocked-override="imageUnlockedOf"
    />
    <StatImage class="sb-scene" :source="sceneSource" :data="data" ratio="16/9" placeholder="🏠" />
    <HeaderRow :data="data.系统" />
    <div class="sb-chars">
      <CharSection
        v-for="(char, name) in visibleChars"
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
import { computed, inject } from 'vue';
import type { Schema } from '../../../schema';
import type { StageImage as StageImageType } from '../../../../通用/状态栏/types';
import { isUnlocked } from '../../../../通用/状态栏/unlock';
import CharSection from './CharSection.vue';
import HeaderRow from './HeaderRow.vue';
import PlotOptions from './PlotOptions.vue';
import StatImage from '../../../../通用/状态栏/components/StatImage.vue';
import StageImage from '../../../../通用/状态栏/components/StageImage.vue';
import { gallery } from '../gallery';

const props = defineProps<{
  data: Schema;
  store: { data: Schema };
}>();

/** 密钥解锁记录（由 App 注入 useSettings 的 keys） */
const keys = inject<{ value: string[] }>('sbKeys', { value: [] });

/** 只显示女主（NPC）条目：user（玩家）角色条目不展示 */
const visibleChars = computed<Record<string, Schema['角色'][string]>>(() => {
  const result: Record<string, Schema['角色'][string]> = {};
  for (const [name, char] of Object.entries(props.data.角色)) {
    if (!char._用户) {
      result[name] = char;
    }
  }
  return result;
});

/** 图鉴主角（第一阶段立绘展示用） */
const heroineGallery = computed(() => gallery.characters[0]);

/** 立绘解锁判定：密钥记录 + 条件实时判定 */
function imageUnlockedOf(image: StageImageType): boolean {
  if (image.key && keys.value.includes(image.key)) {
    return true;
  }
  return isUnlocked(image.unlock, props.data);
}

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

<style scoped>
.sb-heroine {
  margin: 8px 10px 0;
}
</style>
