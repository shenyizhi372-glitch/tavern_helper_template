<template>
  <span class="sb-action-wrap">
    <LockInput v-if="lockLocked" :lock="field.lock" />
    <button v-else class="sb-action" type="button" :disabled="busy || !enabled" @click="run">
      <SbIcon v-if="field.icon" :icon="field.icon" />
      <span>{{ field.label }}</span>
    </button>
  </span>
</template>

<script setup lang="ts">
import { computed, inject, ref } from 'vue';
import type { ActionFieldConfig } from '../types';
import { getByPath, setByPath } from '../path';
import SbIcon from './SbIcon.vue';
import LockInput from './LockInput.vue';

const props = defineProps<{
  field: ActionFieldConfig;
  /** 数据存储（写变量模式需要；不传则按钮禁用） */
  store?: { data: unknown };
}>();

/** 密钥解锁记录（由 App 注入 useSettings 的 keys） */
const keys = inject<{ value: string[] }>('sbKeys', { value: [] });

const lockLocked = computed(() => !!props.field.lock && !keys.value.includes(props.field.lock.key));

/** 无 store 时 variable 模式按钮禁用 */
const enabled = computed(() => {
  if (props.field.action.mode === 'variable') {
    return !!props.store;
  }
  return true;
});

const busy = ref(false);

function notify(message?: string) {
  if (message && typeof toastr !== 'undefined') {
    toastr.success(message);
  }
}

async function run() {
  const action = props.field.action;
  if (action.mode === 'variable') {
    if (!props.store) {
      return;
    }
    const current = getByPath(props.store.data, action.path);
    const next =
      action.delta !== undefined ? (Number(current) || 0) + action.delta : action.value;
    setByPath(props.store.data, action.path, next);
    notify(action.toast);
    return;
  }
  busy.value = true;
  try {
    await createChatMessages([{ role: 'user', message: action.content }]);
    triggerSlash(action.slash ?? '/trigger');
    notify(action.toast ?? '已发送');
  } finally {
    busy.value = false;
  }
}
</script>

<style scoped>
.sb-action-wrap {
  display: inline-flex;
}

.sb-action {
  display: inline-flex;
  align-items: center;
  gap: 0.4em;
  padding: 0.25em 0.9em;
  border: 1px solid var(--sb-border);
  border-radius: var(--sb-radius-pill);
  background-color: var(--sb-surface);
  color: var(--sb-text);
  font-size: var(--sb-font-size-label);
  font-family: inherit;
  cursor: pointer;
  transition: background-color 0.15s ease, border-color 0.15s ease;
}

.sb-action:hover:not(:disabled) {
  background-color: var(--sb-surface-alt);
  border-color: var(--sb-primary);
}

.sb-action:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
