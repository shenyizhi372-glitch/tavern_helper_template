<template>
  <div class="sb-panel">
    <div class="sb-layout">
      <!-- 左侧：人物立绘（宽度由「立绘大小」设置控制） -->
      <div v-if="heroineGallery" class="sb-portrait" :style="{ width: portraitWidth }">
        <StageImage
          :gallery="heroineGallery"
          :data="data"
          :is-unlocked-override="imageUnlockedOf"
        />
      </div>
      <!-- 右侧：状态信息 -->
      <div class="sb-info">
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
    </div>
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
import StageImage from '../../../../通用/状态栏/components/StageImage.vue';
import { gallery } from '../gallery';

const props = defineProps<{
  data: Schema;
  store: { data: Schema };
}>();

/** 密钥解锁记录（由 App 注入 useSettings 的 keys） */
const keys = inject<{ value: string[] }>('sbKeys', { value: [] });

/** 立绘宽度设置（由 App 注入 useSettings 的 portrait，默认 140） */
const portrait = inject<{ value: number }>('sbPortrait', { value: 140 });
const portraitWidth = computed(() => `${Math.round(portrait.value)}px`);

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

/** 图鉴主角（左侧立绘展示用） */
const heroineGallery = computed(() => gallery.characters[0]);

/** 立绘解锁判定：密钥记录 + 条件实时判定 */
function imageUnlockedOf(image: StageImageType): boolean {
  if (image.key && keys.value.includes(image.key)) {
    return true;
  }
  return isUnlocked(image.unlock, props.data);
}
</script>

<style scoped>
/* 左右布局：左列立绘 + 右列信息 */
.sb-layout {
  display: flex;
  align-items: stretch;
  gap: 10px;
  padding: 8px 10px 0;
}

/* 左侧立绘区：宽度由设置控制，图片铺满左列 */
.sb-portrait {
  flex-shrink: 0;
  align-self: flex-start;
  padding: 6px;
  border: 1px solid var(--c-border);
  border-radius: 10px;
  background: var(--c-surface);
}

.sb-portrait :deep(.sb-stage-img) {
  width: 100%;
  height: auto;
  max-width: none;
  max-height: none;
}

/* 右侧信息区 */
.sb-info {
  flex: 1;
  min-width: 0;
}

/* 窄屏（移动端）：立绘转顶部居中 */
@media (max-width: 420px) {
  .sb-layout {
    flex-direction: column;
  }

  .sb-portrait {
    align-self: center;
  }
}
</style>
