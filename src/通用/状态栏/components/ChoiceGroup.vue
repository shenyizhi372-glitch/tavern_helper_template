<template>
  <span class="sb-choice">
    <LockInput v-if="lockLocked" :lock="field.lock" />
    <template v-else>
      <button
        v-for="(option, index) in field.options"
        :key="option.label"
        class="sb-choice-opt"
        type="button"
        :disabled="locked || busyIndex !== null"
        @click="pick(option, index)"
      >
        <SbIcon v-if="option.icon" :icon="option.icon" />
        <span>{{ option.label }}</span>
      </button>
    </template>
  </span>
</template>

<script setup lang="ts">
import { computed, inject, ref } from 'vue';
import type { ChoiceFieldConfig } from '../types';
import { getByPath, setByPath } from '../path';
import SbIcon from './SbIcon.vue';
import LockInput from './LockInput.vue';

const props = defineProps<{
  field: ChoiceFieldConfig;
  store?: { data: unknown };
}>();

/** 密钥解锁记录（由 App 注入 useSettings 的 keys） */
const keys = inject<{ value: string[] }>('sbKeys', { value: [] });

const lockLocked = computed(() => !!props.field.lock && !keys.value.includes(props.field.lock.key));

/** message 型选项被点击后整组锁定（防重复触发） */
const locked = ref(false);
/** 正在执行中的选项下标（loading 态） */
const busyIndex = ref<number | null>(null);

function notify(message?: string) {
  if (message && typeof toastr !== 'undefined') {
    toastr.success(message);
  }
}

async function pick(option: (typeof props.field.options)[number], index: number) {
  if (locked.value || busyIndex.value !== null) {
    return;
  }
  const action = option.action;
  if (action.mode === 'variable') {
    if (!props.store) {
      return;
    }
    const current = getByPath(props.store.data, action.path);
    const next = action.delta !== undefined ? (Number(current) || 0) + action.delta : action.value;
    setByPath(props.store.data, action.path, next);
    notify(action.toast);
    return;
  }
  busyIndex.value = index;
  try {
    await createChatMessages([{ role: 'user', message: action.content }]);
    triggerSlash(action.slash ?? '/trigger');
    notify(action.toast ?? '已选择');
    if (props.field.lockAfterPick !== false) {
      locked.value = true;
    }
  } finally {
    busyIndex.value = null;
  }
}
</script>

<style scoped>
.sb-choice {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 0.4em;
  justify-content: flex-end;
}

.sb-choice-opt {
  display: inline-flex;
  align-items: center;
  gap: 0.35em;
  padding: 0.2em 0.8em;
  border: 1px solid var(--sb-border);
  border-radius: var(--sb-radius-pill);
  background-color: var(--sb-surface);
  color: var(--sb-text);
  font-size: var(--sb-font-size-label);
  font-family: inherit;
  cursor: pointer;
  transition: background-color 0.15s ease, border-color 0.15s ease;
}

.sb-choice-opt:hover:not(:disabled) {
  background-color: var(--sb-surface-alt);
  border-color: var(--sb-primary);
}

.sb-choice-opt:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}
</style>
