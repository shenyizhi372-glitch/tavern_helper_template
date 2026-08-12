<template>
  <div class="sb-image" :style="containerStyle">
    <img
      v-if="src && !failed"
      class="sb-image-img"
      :src="src"
      :style="{ objectFit: fit }"
      alt=""
      loading="lazy"
      @error="failed = true"
    />
    <div v-else class="sb-image-fallback">{{ placeholder ?? '🖼️' }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { ImageFit, ImageSource } from '../types';
import { resolveImageSource } from '../image';

const props = defineProps<{
  source: ImageSource;
  /** stat_data 对象（mapped/fromVariable 模式读取用） */
  data: unknown;
  fit?: ImageFit;
  ratio?: string;
  placeholder?: string;
}>();

const src = computed(() => resolveImageSource(props.source, props.data));
const failed = ref(false);

watch(src, () => {
  failed.value = false;
});

const fit = computed(() => props.fit ?? 'contain');

const containerStyle = computed(() =>
  props.ratio ? { aspectRatio: props.ratio } : undefined,
);
</script>

<style scoped>
.sb-image {
  width: 100%;
  overflow: hidden;
  border-radius: var(--sb-radius-panel);
  background-color: var(--sb-surface-alt);
}

.sb-image-img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.sb-image-fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 4em;
  color: var(--sb-text-muted);
  font-size: var(--sb-font-size-small);
}
</style>
