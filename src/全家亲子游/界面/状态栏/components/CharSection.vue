<template>
  <div class="sb-char" :class="{ 'is-user': char._用户 }">
    <button class="sb-char-head" type="button" @click="open = !open" :aria-expanded="open">
      <span class="sb-chevron" :class="{ open }">▸</span>
      <span class="sb-char-emoji">{{ char.表情 || '👤' }}</span>
      <span class="sb-char-name">{{ name }}</span>
      <span v-if="char._用户" class="sb-char-tag">你</span>
      <span class="sb-char-count">5 项</span>
    </button>
    <div v-show="open" class="sb-char-body">
      <div class="sb-field">
        <span class="sb-field-emoji">👗</span>
        <span class="sb-field-label">穿着</span>
        <span class="sb-field-value">{{ char.穿着 || '—' }}</span>
      </div>
      <div class="sb-field">
        <span class="sb-field-emoji">👀</span>
        <span class="sb-field-label">神态</span>
        <span class="sb-field-value">{{ char.神态 || '—' }}</span>
      </div>
      <div class="sb-field">
        <span class="sb-field-emoji">😊</span>
        <span class="sb-field-label">心情</span>
        <span class="sb-field-value">{{ char.心情 || '—' }}</span>
      </div>
      <div class="sb-field">
        <span class="sb-field-emoji">🏃</span>
        <span class="sb-field-label">当前行动</span>
        <span class="sb-field-value">{{ char.当前行动 || '—' }}</span>
      </div>
      <div class="sb-field sb-field-affinity">
        <span class="sb-field-emoji">💗</span>
        <span class="sb-field-label">好感度</span>
        <span class="sb-affinity-track">
          <span class="sb-affinity-fill" :style="{ width: affinity + '%' }"></span>
        </span>
        <span class="sb-affinity-value">{{ affinity }}</span>
        <span class="sb-affinity-controls">
          <button class="sb-affinity-btn" type="button" :disabled="affinity <= 0" @click="adjust(-5)">-</button>
          <button class="sb-affinity-btn" type="button" :disabled="affinity >= 100" @click="adjust(5)">+</button>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import type { Schema } from '../../../schema';

const props = defineProps<{
  name: string;
  char: Schema['角色'][string];
  /** 数据存储：改 store.data 后 defineMvuDataStore 自动写回楼层变量 */
  store: { data: Schema };
}>();

// 默认展开（与穿花蝶传一致），点击表头折叠
const open = ref(true);

const affinity = computed(() => Math.round(Number(props.char.好感度) || 0));

/** 好感度调整（±5，钳制 0-100）——交互写回 MVU 变量，AI 下一轮感知 */
function adjust(delta: number) {
  const next = Math.min(100, Math.max(0, affinity.value + delta));
  props.store.data.角色[props.name].好感度 = next;
}
</script>

<style scoped>
.sb-field-affinity {
  align-items: center;
}

.sb-affinity-track {
  flex: 1;
  height: 8px;
  min-width: 48px;
  border-radius: 999px;
  background: var(--c-border);
  overflow: hidden;
}

.sb-affinity-fill {
  display: block;
  height: 100%;
  border-radius: 999px;
  background: var(--c-accent);
  transition: width 0.2s ease;
}

.sb-affinity-value {
  min-width: 2em;
  text-align: right;
  font-size: 12px;
  color: var(--c-text);
}

.sb-affinity-controls {
  display: inline-flex;
  gap: 4px;
}

.sb-affinity-btn {
  width: 22px;
  height: 22px;
  border: 1px solid var(--c-border);
  border-radius: 6px;
  background: var(--c-surface);
  color: var(--c-text);
  font-size: 13px;
  line-height: 1;
  cursor: pointer;
}

.sb-affinity-btn:hover:not(:disabled) {
  border-color: var(--c-primary);
}

.sb-affinity-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
