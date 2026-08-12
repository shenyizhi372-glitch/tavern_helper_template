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
        <span class="sb-affinity-value">{{ affinity }}</span>
        <span class="sb-affinity-controls">
          <LockInput v-if="lockLocked" :lock="affinityLock" />
          <input
            v-else
            class="sb-affinity-range"
            type="range"
            min="0"
            max="100"
            step="1"
            :value="affinity"
            @input="onRangeInput"
          />
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, ref } from 'vue';
import type { Schema } from '../../../schema';
import LockInput from '../../../../通用/状态栏/components/LockInput.vue';
import { affinityLock } from '../gallery';

const props = defineProps<{
  name: string;
  char: Schema['角色'][string];
  /** 数据存储：改 store.data 后 defineMvuDataStore 自动写回楼层变量 */
  store: { data: Schema };
}>();

/** 密钥解锁记录（由 App 注入 useSettings 的 keys） */
const keys = inject<{ value: string[] }>('sbKeys', { value: [] });

/** 好感度调节锁定：输入家庭密钥解锁后可调 */
const lockLocked = computed(() => !keys.value.includes(affinityLock.key));

// 默认展开（与穿花蝶传一致），点击表头折叠
const open = ref(true);

const affinity = computed(() => Math.round(Number(props.char.好感度) || 0));

/** 滑块拖动写回 MVU 变量（defineMvuDataStore 自动同步），防抖 300ms */
let rangeTimer: ReturnType<typeof setTimeout> | null = null;

function onRangeInput(event: Event) {
  const value = Number((event.target as HTMLInputElement).value);
  if (rangeTimer) {
    clearTimeout(rangeTimer);
  }
  rangeTimer = setTimeout(() => {
    props.store.data.角色[props.name].好感度 = value;
  }, 300);
}
</script>

<style scoped>
.sb-field-affinity {
  align-items: center;
}

.sb-affinity-value {
  min-width: 2em;
  text-align: right;
  font-size: 12px;
  color: var(--c-text);
}

.sb-affinity-controls {
  display: inline-flex;
  align-items: center;
}

.sb-affinity-range {
  width: 9em;
  accent-color: var(--c-primary);
  cursor: pointer;
}
</style>
