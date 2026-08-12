<template>
  <div class="sb-stage">
    <div v-if="current" class="sb-stage-img-wrap" :class="{ locked: !currentUnlocked }">
      <img class="sb-stage-img" :src="current.url" :alt="current.label" loading="lazy" @error="failed = true" />
      <div v-if="!currentUnlocked" class="sb-stage-mask">
        <span aria-hidden="true">🔒</span>
        <span class="sb-stage-label">{{ current.label }}</span>
      </div>
      <span v-else class="sb-stage-tag">{{ current.label }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { CharacterGallery } from '../types';
import { isUnlocked } from '../unlock';

const props = defineProps<{
  gallery: CharacterGallery;
  data: unknown;
  /** 是否已解锁（可选：外部传入的密钥/永久解锁状态；缺省仅按条件判定） */
  isUnlockedOverride?: (image: (typeof props.gallery.images)[number]) => boolean;
}>();

const failed = ref(false);
watch(() => props.gallery, () => { failed.value = false; });

/** 第一个满足解锁条件的阶段图；全部未解锁时显示第一张（锁定遮罩） */
const current = computed(() => {
  const images = props.gallery.images;
  return images.find(image => imageUnlocked(image)) ?? images[0] ?? null;
});

const currentUnlocked = computed(() => (current.value ? imageUnlocked(current.value) : false));

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
  color: #fff;
  font-size: var(--sb-font-size-small);
}
</style>
