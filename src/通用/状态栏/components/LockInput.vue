<template>
  <span v-if="locked" class="sb-lock">
    <button v-if="!showInput" class="sb-lock-btn" type="button" @click="request" :title="lock?.hint">
      <span aria-hidden="true">🔒</span>
      <span>{{ lock?.hint ?? '已锁定' }}</span>
    </button>
    <span v-else class="sb-lock-form">
      <input
        v-model="input"
        class="sb-lock-input"
        type="password"
        placeholder="输入密钥"
        @keyup.enter="handleSubmit"
        @keyup.esc="cancel"
      />
      <button class="sb-lock-submit" type="button" @click="handleSubmit">解锁</button>
      <button class="sb-lock-cancel" type="button" @click="cancel">✕</button>
    </span>
  </span>
</template>

<script setup lang="ts">
import { inject } from 'vue';
import type { FieldLock } from '../types';
import { useFieldLock } from '../useFieldLock';

const props = defineProps<{
  lock?: FieldLock;
}>();

const emit = defineEmits<{ unlocked: [] }>();

/** 密钥解锁记录（由 App 注入 useSettings 的 keys） */
const keys = inject<{ value: string[] }>('sbKeys', { value: [] });

const { locked, showInput, input, request, submit, cancel } = useFieldLock(props.lock, keys);

function handleSubmit() {
  if (submit()) {
    emit('unlocked');
  }
}
</script>

<style scoped>
.sb-lock {
  display: inline-flex;
  align-items: center;
}

.sb-lock-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.35em;
  padding: 0.2em 0.8em;
  border: 1px dashed var(--sb-border);
  border-radius: var(--sb-radius-pill);
  background-color: var(--sb-surface-alt);
  color: var(--sb-text-muted);
  font-size: var(--sb-font-size-label);
  font-family: inherit;
  cursor: pointer;
}

.sb-lock-btn:hover {
  border-color: var(--sb-warning);
  color: var(--sb-text);
}

.sb-lock-form {
  display: inline-flex;
  align-items: center;
  gap: 0.4em;
}

.sb-lock-input {
  width: 9em;
  padding: 0.2em 0.6em;
  border: 1px solid var(--sb-border);
  border-radius: var(--sb-radius-pill);
  background-color: var(--sb-surface);
  color: var(--sb-text);
  font-size: var(--sb-font-size-label);
  font-family: inherit;
}

.sb-lock-input:focus {
  outline: none;
  border-color: var(--sb-primary);
}

.sb-lock-submit,
.sb-lock-cancel {
  padding: 0.15em 0.7em;
  border: 1px solid var(--sb-border);
  border-radius: var(--sb-radius-pill);
  background-color: var(--sb-surface);
  color: var(--sb-text);
  font-size: var(--sb-font-size-small);
  font-family: inherit;
  cursor: pointer;
}

.sb-lock-submit:hover {
  border-color: var(--sb-primary);
}

.sb-lock-cancel {
  padding: 0.15em 0.45em;
  color: var(--sb-text-muted);
}
</style>
