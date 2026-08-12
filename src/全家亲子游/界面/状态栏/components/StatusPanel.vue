<template>
  <div class="sb-panel">
    <!-- 多角色切换（仅配置了多个角色时显示） -->
    <div v-if="gallery && gallery.characters.length > 1" class="sb-role-tabs">
      <button
        v-for="g in gallery.characters"
        :key="g.id"
        class="sb-role-tab"
        :class="{ active: g.id === activeRoleId }"
        type="button"
        @click="activeRoleId = g.id"
      >
        <span class="sb-role-tab-icon">{{ g.icon || '👤' }}</span>
        <span class="sb-role-tab-name">{{ g.name || g.id }}</span>
      </button>
    </div>

    <div class="sb-layout">
      <!-- 左侧：当前角色立绘（宽度由「立绘大小」设置控制） -->
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
      </div>
    </div>

    <!-- 剧情发展：占满面板底部整行 -->
    <PlotOptions v-if="data.剧情.可选发展.length" :options="data.剧情.可选发展" />
  </div>
</template>

<script setup lang="ts">
import { computed, inject, ref } from 'vue';
import type { Schema } from '../../../schema';
import type { CharacterGallery, GalleryConfig, StageImage as StageImageType } from '../../../../通用/状态栏/types';
import { isUnlocked } from '../../../../通用/状态栏/unlock';
import CharSection from './CharSection.vue';
import HeaderRow from './HeaderRow.vue';
import PlotOptions from './PlotOptions.vue';
import StageImage from '../../../../通用/状态栏/components/StageImage.vue';

const props = defineProps<{
  data: Schema;
  store: { data: Schema };
  /** 图鉴配置（多角色切换用；缺省时退化为第一组） */
  gallery?: GalleryConfig;
}>();

/** 密钥解锁记录（由 App 注入 useSettings 的 keys） */
const keys = inject<{ value: string[] }>('sbKeys', { value: [] });

/** 立绘宽度设置（由 App 注入 useSettings 的 portrait，默认 140） */
const portrait = inject<{ value: number }>('sbPortrait', { value: 140 });
const portraitWidth = computed(() => `${Math.round(portrait.value)}px`);

/** 当前展示角色（多角色时由顶部 tab 切换；默认第一个） */
const activeRoleId = ref(props.gallery?.characters[0]?.id ?? '');

/** 图鉴主角：当前角色的阶段图集 */
const heroineGallery = computed<CharacterGallery | undefined>(() => {
  if (!props.gallery) {
    return undefined;
  }
  return (
    props.gallery.characters.find(g => g.id === activeRoleId.value) ?? props.gallery.characters[0]
  );
});

/** 只显示当前角色（NPC）条目：user（玩家）角色条目不展示 */
const visibleChars = computed<Record<string, Schema['角色'][string]>>(() => {
  const result: Record<string, Schema['角色'][string]> = {};
  const activeName = props.gallery?.characters.find(g => g.id === activeRoleId.value)?.name;
  for (const [name, char] of Object.entries(props.data.角色)) {
    if (char._用户) {
      continue;
    }
    if (activeName && name !== activeName) {
      continue;
    }
    result[name] = char;
  }
  return result;
});

/** 立绘解锁判定：密钥记录 + 条件实时判定 */
function imageUnlockedOf(image: StageImageType): boolean {
  if (image.key && keys.value.includes(image.key)) {
    return true;
  }
  return isUnlocked(image.unlock, props.data);
}
</script>

<style scoped>
/* 多角色切换 tab */
.sb-role-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 8px 10px 0;
}

.sb-role-tab {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 14px;
  border: 1px solid var(--c-border);
  border-radius: var(--sb-radius-pill);
  background: var(--c-surface);
  color: var(--c-text-muted);
  font-size: 12px;
  font-family: inherit;
  cursor: pointer;
  transition: border-color 0.15s ease, background 0.15s ease;
}

.sb-role-tab:hover {
  border-color: var(--c-primary);
}

.sb-role-tab.active {
  border-color: var(--c-primary);
  background: color-mix(in srgb, var(--c-primary) 12%, var(--c-surface));
  color: var(--c-text);
  font-weight: 600;
}

.sb-role-tab-icon {
  font-size: 13px;
}

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
