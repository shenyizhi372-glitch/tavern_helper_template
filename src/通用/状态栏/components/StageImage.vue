<template>
  <div class="sb-stage">
    <div v-if="current" class="sb-stage-img-wrap" :class="{ locked: !currentUnlocked }">
      <img
        class="sb-stage-img"
        :src="current.url"
        :alt="current.label"
        :style="imgStyle"
        loading="lazy"
        @error="failed = true"
      />
      <div v-if="!currentUnlocked" class="sb-stage-mask">
        <span aria-hidden="true">🔒</span>
        <span class="sb-stage-label">{{ current.label }}</span>
      </div>
      <span v-else class="sb-stage-tag">{{ current.label }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, ref, watch } from 'vue';
import type { CharacterGallery } from '../types';
import { isUnlocked } from '../unlock';

const props = defineProps<{
  gallery: CharacterGallery;
  data: unknown;
  /** 是否已解锁（可选：外部传入的密钥/永久解锁状态；缺省仅按条件判定） */
  isUnlockedOverride?: (image: (typeof props.gallery.images)[number]) => boolean;
  /** 图片最大高度（如 '200px'），限高大图防止占满面板 */
  maxHeight?: string;
}>();

/** 立绘随变量切换开关（由 App 注入 useSettings 的 portraitAuto，默认开） */
const portraitAuto = inject<{ value: boolean }>('sbPortraitAuto', { value: true });

const failed = ref(false);
watch(() => props.gallery, () => { failed.value = false; });

/**
 * 显示的阶段图：
 * - 开启「立绘随变量切换」：按阶段递进取「已满足条件的最高级阶段图」
 *   （顺序即阶段递进：日常 → 亲昵 → 沉沦；无条件图视为恒满足，
 *   变量越高显示越深入，作者新增的图排在后面即为更高阶段）；
 *   没有任何图满足时回退第一张（初始立绘/锁定遮罩）。
 * - 关闭开关：固定初始立绘（第一张），不再随条件切换。
 */
const current = computed(() => {
  const images = props.gallery.images;
  if (!portraitAuto.value) {
    return images[0] ?? null;
  }
  let highest: (typeof images)[number] | null = null;
  for (const image of images) {
    if (!image.unlock || imageUnlocked(image)) {
      highest = image;
    }
  }
  return highest ?? images[0] ?? null;
});

const currentUnlocked = computed(() => (current.value ? imageUnlocked(current.value) : false));

/** 限高时图片保持比例居中、宽度自适应 */
const imgStyle = computed(() =>
  props.maxHeight ? { maxHeight: props.maxHeight, width: 'auto', maxWidth: '100%' } : undefined,
);

function imageUnlocked(image: (typeof props.gallery.images)[number]): boolean {
  if (props.isUnlockedOverride) {
    return props.isUnlockedOverride(image);
  }
  return isUnlocked(image.unlock, props.data);
}
</script>

<style scoped>
.sb-stage-img-wrap {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  overflow: hidden;
  border-radius: var(--sb-radius-panel);
  background-color: var(--sb-surface-alt);
}

.sb-stage-img {
  display: block;
  width: 100%;
  height: auto;
}

.sb-stage-mask {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.4em;
  background-color: color-mix(in srgb, var(--sb-surface-alt) 78%, transparent);
  backdrop-filter: blur(3px);
  color: var(--sb-text-muted);
  font-size: var(--sb-font-size-label);
}

.sb-stage-tag {
  position: absolute;
  right: 0.5em;
  bottom: 0.5em;
  padding: 0.1em 0.7em;
  border-radius: var(--sb-radius-pill);
  background-color: color-mix(in srgb, var(--sb-primary) 82%, transparent);
  color: var(--sb-text-on-primary);
  font-size: var(--sb-font-size-small);
}
</style>
