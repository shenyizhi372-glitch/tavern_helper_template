<template>
  <div class="sb-gallery">
    <!-- 全局密钥输入 -->
    <div v-if="gallery.masterKey" class="sb-gallery-master">
      <span class="sb-gallery-master-label">🔑 全局密钥</span>
      <input
        v-model="masterInput"
        class="sb-gallery-master-input"
        type="password"
        placeholder="输入密钥解锁全部图鉴"
        @keyup.enter="submitMaster"
      />
      <button class="sb-gallery-master-btn" type="button" @click="submitMaster">解锁</button>
    </div>

    <!-- 角色分组 -->
    <div v-for="character in gallery.characters" :key="character.id" class="sb-gallery-char">
      <div class="sb-gallery-char-name">{{ character.icon }} {{ character.name }}</div>
      <div class="sb-gallery-grid">
        <div
          v-for="image in character.images"
          :key="image.id"
          class="sb-gallery-card"
          :class="{ locked: !unlockedOf(image) }"
        >
          <button v-if="unlockedOf(image)" class="sb-gallery-img-btn" type="button" @click="openViewer(image)">
            <img class="sb-gallery-img" :src="image.url" :alt="image.label" loading="lazy" />
            <span class="sb-gallery-tag">{{ image.label }}</span>
          </button>
          <div v-else class="sb-gallery-locked">
            <span aria-hidden="true">🔒</span>
            <span class="sb-gallery-locked-label">{{ image.label }}</span>
            <span class="sb-gallery-locked-hint">{{ hintOf(image) }}</span>
            <LockInput v-if="image.key" :lock="{ key: image.key, hint: '输入此图密钥' }" />
          </div>
        </div>
      </div>
    </div>

    <!-- 大图查看 -->
    <div v-if="viewer" class="sb-gallery-viewer" @click.self="viewer = null">
      <img class="sb-gallery-viewer-img" :src="viewer.url" :alt="viewer.label" />
      <div class="sb-gallery-viewer-bar">
        <span>{{ viewer.label }}</span>
        <button type="button" @click="viewer = null">✕</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { GalleryConfig, StageImage } from '../types';
import { unlockHint } from '../unlock';
import LockInput from './LockInput.vue';

const props = defineProps<{
  gallery: GalleryConfig;
  data: unknown;
  /** 图解锁判定（含条件/密钥/永久记录），由 SettingsModal 传入 */
  imageUnlocked: (image: StageImage, data: unknown) => boolean;
  /** 全局密钥校验（useSettings.tryKey），成功返回 true */
  tryKey: (input: string) => boolean;
}>();

const masterInput = ref('');
const viewer = ref<StageImage | null>(null);

function openViewer(image: StageImage) {
  viewer.value = image;
}

function unlockedOf(image: StageImage): boolean {
  return props.imageUnlocked(image, props.data);
}

function hintOf(image: StageImage): string {
  if (image.key) {
    return '🔑 可输密钥解锁';
  }
  const hint = unlockHint(image.unlock);
  return hint ? `${hint} 解锁` : '';
}

function submitMaster() {
  if (!masterInput.value.trim()) {
    return;
  }
  if (props.tryKey(masterInput.value)) {
    masterInput.value = '';
  } else if (typeof toastr !== 'undefined') {
    toastr.error('密钥不正确');
  }
}
</script>

<style scoped>
.sb-gallery {
  display: flex;
  flex-direction: column;
  gap: 0.9em;
}

.sb-gallery-master {
  display: flex;
  align-items: center;
  gap: 0.5em;
}

.sb-gallery-master-label {
  flex-shrink: 0;
  font-size: var(--sb-font-size-label);
  color: var(--sb-text-muted);
}

.sb-gallery-master-input {
  flex: 1;
  min-width: 8em;
  padding: 0.25em 0.7em;
  border: 1px solid var(--sb-border);
  border-radius: var(--sb-radius-pill);
  background-color: var(--sb-surface);
  color: var(--sb-text);
  font-size: var(--sb-font-size-label);
  font-family: inherit;
}

.sb-gallery-master-input:focus {
  outline: none;
  border-color: var(--sb-primary);
}

.sb-gallery-master-btn {
  padding: 0.25em 1em;
  border: 1px solid var(--sb-border);
  border-radius: var(--sb-radius-pill);
  background-color: var(--sb-surface);
  color: var(--sb-text);
  font-size: var(--sb-font-size-label);
  font-family: inherit;
  cursor: pointer;
}

.sb-gallery-master-btn:hover {
  border-color: var(--sb-primary);
}

.sb-gallery-char-name {
  margin-bottom: 0.5em;
  font-weight: 600;
}

.sb-gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 0.6em;
}

.sb-gallery-card {
  overflow: hidden;
  border: 1px solid var(--sb-border);
  border-radius: var(--sb-radius-panel);
  background-color: var(--sb-surface);
}

.sb-gallery-img-btn {
  position: relative;
  display: block;
  width: 100%;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
}

.sb-gallery-img {
  display: block;
  width: 100%;
  aspect-ratio: 4/3;
  object-fit: cover;
}

.sb-gallery-tag {
  position: absolute;
  left: 0.4em;
  bottom: 0.4em;
  padding: 0.05em 0.6em;
  border-radius: var(--sb-radius-pill);
  background-color: color-mix(in srgb, var(--sb-primary) 82%, transparent);
  color: #fff;
  font-size: var(--sb-font-size-small);
}

.sb-gallery-locked {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3em;
  padding: 0.9em 0.5em;
  min-height: 8em;
  justify-content: center;
  text-align: center;
}

.sb-gallery-locked-label {
  font-size: var(--sb-font-size-label);
  font-weight: 600;
}

.sb-gallery-locked-hint {
  font-size: var(--sb-font-size-small);
  color: var(--sb-text-muted);
  line-height: 1.4;
}

.sb-gallery-viewer {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.6em;
  background-color: rgb(0 0 0 / 72%);
  padding: 1.5em;
}

.sb-gallery-viewer-img {
  max-width: 92%;
  max-height: 82%;
  border-radius: var(--sb-radius-panel);
}

.sb-gallery-viewer-bar {
  display: flex;
  align-items: center;
  gap: 1em;
  color: #fff;
  font-size: var(--sb-font-size-label);
}

.sb-gallery-viewer-bar button {
  padding: 0.2em 0.8em;
  border: 1px solid #888;
  border-radius: var(--sb-radius-pill);
  background: none;
  color: #fff;
  cursor: pointer;
  font-family: inherit;
}
</style>
