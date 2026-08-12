<template>
  <div class="sb-gallery-edit">
    <div class="sb-gallery-edit-actions">
      <button class="sb-ge-btn" type="button" @click="addCharacter">＋ 添加角色</button>
      <button class="sb-ge-btn" type="button" @click="save">💾 保存</button>
      <button class="sb-ge-btn" type="button" @click="reset" :disabled="!original">↩️ 重置为代码配置</button>
      <button class="sb-ge-btn" type="button" @click="exportJson">📤 导出 JSON</button>
    </div>

    <div v-if="exportText" class="sb-gallery-edit-export">
      <button class="sb-ge-btn" type="button" @click="copyExport">复制</button>
      <pre>{{ exportText }}</pre>
    </div>

    <div v-for="char in gallery.characters" :key="char.id" class="sb-gallery-edit-char">
      <div class="sb-gallery-edit-char-head">
        <input v-model="char.icon" class="sb-ge-input sb-ge-icon" maxlength="4" title="角色图标" />
        <input v-model="char.name" class="sb-ge-input sb-ge-name" placeholder="角色名" />
        <button class="sb-ge-btn sb-ge-danger" type="button" @click="removeCharacter(char)">删除角色</button>
      </div>

      <div v-for="image in char.images" :key="image.id" class="sb-gallery-edit-card">
        <img v-if="image.url" :src="image.url" class="sb-gallery-edit-thumb" alt="" />
        <div class="sb-gallery-edit-fields">
          <input v-model="image.label" class="sb-ge-input" placeholder="阶段名（如 日常 / 亲昵）" />
          <div class="sb-gallery-edit-url">
            <input v-model="image.url" class="sb-ge-input" placeholder="图片 URL（CDN 或上传）" />
            <label class="sb-gallery-edit-upload">📁 上传<input type="file" accept="image/*" @change="onUpload(image, $event)" /></label>
          </div>
          <div class="sb-gallery-edit-cond">
            <select
              class="sb-ge-input sb-ge-cond-type"
              :value="condType(image)"
              @change="setCondType(image, ($event.target as HTMLSelectElement).value)"
            >
              <option value="none">无条件</option>
              <option value="threshold">阈值解锁</option>
              <option value="equals">等值解锁</option>
            </select>
            <template v-if="image.unlock?.type === 'threshold'">
              <input v-model="image.unlock.variable" class="sb-ge-input" placeholder="变量路径（如 角色.孙莹.好感度）" />
              <input
                type="number"
                class="sb-ge-input sb-ge-num"
                placeholder="min"
                :value="image.unlock.min ?? ''"
                @input="numField(image, 'min', $event)"
              />
              <input
                type="number"
                class="sb-ge-input sb-ge-num"
                placeholder="max"
                :value="image.unlock.max ?? ''"
                @input="numField(image, 'max', $event)"
              />
            </template>
            <template v-else-if="image.unlock?.type === 'equals'">
              <input v-model="image.unlock.variable" class="sb-ge-input" placeholder="变量路径" />
              <input class="sb-ge-input" :value="String(image.unlock.value ?? '')" placeholder="值" @input="eqValue(image, $event)" />
            </template>
            <input v-model="image.key" class="sb-ge-input" placeholder="单图密钥（可选）" />
          </div>
        </div>
        <button class="sb-ge-btn sb-ge-danger sb-ge-del" type="button" title="删除此图" @click="removeImage(char, image)">✕</button>
      </div>

      <button class="sb-ge-btn" type="button" @click="addImage(char)">＋ 添加图片</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { CharacterGallery, GalleryConfig, StageImage } from '../types';

const props = defineProps<{
  /** 可变的响应式图鉴配置（由 App 传入 galleryState，编辑实时生效） */
  gallery: GalleryConfig;
  /** 代码里的原始配置（重置时恢复用） */
  original?: GalleryConfig;
}>();

const EDIT_KEY = 'sb:gallery-edit';

const exportText = ref('');

/* ===== 角色增删 ===== */

function addCharacter() {
  const id = `角色${Date.now()}`;
  props.gallery.characters.push({ id, name: '新角色', icon: '👤', images: [] });
}

function removeCharacter(char: CharacterGallery) {
  const idx = props.gallery.characters.indexOf(char);
  if (idx >= 0) {
    props.gallery.characters.splice(idx, 1);
  }
}

/* ===== 图片增删 ===== */

function addImage(char: CharacterGallery) {
  char.images.push({ id: `${char.id}-图${Date.now()}`, label: '新阶段', url: '' });
}

function removeImage(char: CharacterGallery, image: StageImage) {
  const idx = char.images.indexOf(image);
  if (idx >= 0) {
    char.images.splice(idx, 1);
  }
}

/* ===== 图片上传（canvas 压缩为 dataURL，localStorage 可持久化） ===== */

function onUpload(image: StageImage, event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) {
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.onload = () => {
      const maxW = 800;
      const scale = Math.min(1, maxW / img.width);
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return;
      }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      image.url = canvas.toDataURL(file.type === 'image/png' ? 'image/png' : 'image/jpeg', 0.85);
      toast('图片已压缩并填入（≤800px）');
    };
    img.src = String(reader.result);
  };
  reader.readAsDataURL(file);
  (event.target as HTMLInputElement).value = '';
}

/* ===== 解锁条件表单 ===== */

function condType(image: StageImage): string {
  if (!image.unlock) {
    return 'none';
  }
  return image.unlock.type;
}

function setCondType(image: StageImage, type: string) {
  if (type === 'none') {
    image.unlock = undefined;
    return;
  }
  if (type === 'threshold') {
    image.unlock = { type: 'threshold', variable: '' };
    return;
  }
  if (type === 'equals') {
    image.unlock = { type: 'equals', variable: '', value: '' };
  }
}

function numField(image: StageImage, field: 'min' | 'max', event: Event) {
  if (!image.unlock || image.unlock.type !== 'threshold') {
    return;
  }
  const v = (event.target as HTMLInputElement).value;
  image.unlock[field] = v === '' ? undefined : Number(v);
}

function eqValue(image: StageImage, event: Event) {
  if (!image.unlock || image.unlock.type !== 'equals') {
    return;
  }
  const v = (event.target as HTMLInputElement).value;
  if (v === '') {
    image.unlock.value = '';
    return;
  }
  const n = Number(v);
  image.unlock.value = Number.isFinite(n) ? n : v;
}

/* ===== 保存 / 重置 / 导出 ===== */

function save() {
  localStorage.setItem(EDIT_KEY, JSON.stringify(props.gallery));
  toast('图鉴配置已保存到本地');
}

function reset() {
  if (!props.original) {
    return;
  }
  localStorage.removeItem(EDIT_KEY);
  const orig = structuredClone(props.original);
  (Object.keys(props.gallery) as (keyof GalleryConfig)[]).forEach(key => {
    delete props.gallery[key];
  });
  Object.assign(props.gallery, orig);
  toast('已恢复代码配置');
}

function exportJson() {
  exportText.value = JSON.stringify(props.gallery, null, 2);
}

async function copyExport() {
  try {
    await navigator.clipboard.writeText(exportText.value);
    toast('已复制到剪贴板');
  } catch {
    toast('复制失败，请手动选择文本');
  }
}

function toast(message: string) {
  if (typeof toastr !== 'undefined') {
    toastr.success(message);
  }
}
</script>

<style scoped>
.sb-gallery-edit {
  display: flex;
  flex-direction: column;
  gap: 0.9em;
}

.sb-gallery-edit-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45em;
}

.sb-ge-btn {
  padding: 0.25em 0.9em;
  border: 1px solid var(--sb-border);
  border-radius: var(--sb-radius-pill);
  background-color: var(--sb-surface);
  color: var(--sb-text);
  font-size: var(--sb-font-size-label);
  font-family: inherit;
  cursor: pointer;
}

.sb-ge-btn:hover:not(:disabled) {
  border-color: var(--sb-primary);
}

.sb-ge-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.sb-ge-danger {
  color: var(--sb-text-muted);
}

.sb-ge-danger:hover:not(:disabled) {
  border-color: var(--sb-danger);
  color: var(--sb-danger);
}

.sb-gallery-edit-char {
  display: flex;
  flex-direction: column;
  gap: 0.6em;
  padding: 0.7em;
  border: 1px solid var(--sb-border);
  border-radius: var(--sb-radius-panel);
  background-color: var(--sb-surface-alt);
}

.sb-gallery-edit-char-head {
  display: flex;
  align-items: center;
  gap: 0.45em;
}

.sb-gallery-edit-card {
  display: flex;
  gap: 0.6em;
  align-items: flex-start;
  padding: 0.55em;
  border: 1px solid var(--sb-border);
  border-radius: var(--sb-radius-panel);
  background-color: var(--sb-surface);
}

.sb-gallery-edit-thumb {
  flex-shrink: 0;
  width: 64px;
  height: 48px;
  border-radius: 6px;
  object-fit: cover;
  background-color: var(--sb-surface-alt);
}

.sb-gallery-edit-fields {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 0.4em;
  min-width: 0;
}

.sb-ge-input {
  width: 100%;
  padding: 0.22em 0.6em;
  border: 1px solid var(--sb-border);
  border-radius: var(--sb-radius-pill);
  background-color: var(--sb-surface);
  color: var(--sb-text);
  font-size: var(--sb-font-size-label);
  font-family: inherit;
  box-sizing: border-box;
}

.sb-ge-input:focus {
  outline: none;
  border-color: var(--sb-primary);
}

.sb-ge-icon {
  width: 3em;
  text-align: center;
}

.sb-ge-name {
  flex: 1;
  font-weight: 600;
}

.sb-gallery-edit-url {
  display: flex;
  gap: 0.4em;
}

.sb-gallery-edit-upload {
  flex-shrink: 0;
  padding: 0.22em 0.7em;
  border: 1px dashed var(--sb-border);
  border-radius: var(--sb-radius-pill);
  color: var(--sb-text-muted);
  font-size: var(--sb-font-size-label);
  cursor: pointer;
  white-space: nowrap;
}

.sb-gallery-edit-upload:hover {
  border-color: var(--sb-primary);
  color: var(--sb-text);
}

.sb-gallery-edit-upload input[type='file'] {
  display: none;
}

.sb-gallery-edit-cond {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4em;
}

.sb-ge-cond-type {
  flex-shrink: 0;
  width: auto;
}

.sb-ge-num {
  flex-shrink: 0;
  width: 5em;
}

.sb-ge-del {
  flex-shrink: 0;
  padding: 0.15em 0.5em;
}

.sb-gallery-edit-export {
  display: flex;
  flex-direction: column;
  gap: 0.4em;
}

.sb-gallery-edit-export pre {
  max-height: 12em;
  margin: 0;
  padding: 0.6em;
  overflow: auto;
  border: 1px solid var(--sb-border);
  border-radius: var(--sb-radius-panel);
  background-color: var(--sb-surface-alt);
  color: var(--sb-text);
  font-size: 11px;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-all;
}
</style>
