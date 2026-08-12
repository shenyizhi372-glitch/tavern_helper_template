<template>
  <span class="sb-input-wrap">
    <LockInput v-if="lockLocked" :lock="field.lock" />
    <input
      v-else
      class="sb-input"
      type="text"
      :placeholder="field.placeholder"
      :maxlength="field.maxLength"
      v-model="text"
      @keyup.enter="onCommit"
      @blur="onBlurCommit"
    />
  </span>
</template>

<script setup lang="ts">
import { computed, inject, ref } from 'vue';
import type { InputFieldConfig } from '../types';
import { setByPath } from '../path';
import LockInput from './LockInput.vue';

const props = defineProps<{
  field: InputFieldConfig;
  store?: { data: unknown };
}>();

/** 密钥解锁记录（由 App 注入 useSettings 的 keys） */
const keys = inject<{ value: string[] }>('sbKeys', { value: [] });

const lockLocked = computed(() => !!props.field.lock && !keys.value.includes(props.field.lock.key));

const text = ref('');

function commit() {
  if (props.store) {
    setByPath(props.store.data, props.field.path, text.value);
  }
}

function onCommit() {
  if (props.field.commitOn === 'blur') {
    return;
  }
  commit();
}

function onBlurCommit() {
  if (props.field.commitOn === 'live') {
    return;
  }
  commit();
}
</script>

<style scoped>
.sb-input {
  width: 100%;
  max-width: 12em;
  padding: 0.2em 0.6em;
  border: 1px solid var(--sb-border);
  border-radius: var(--sb-radius-pill);
  background-color: var(--sb-surface);
  color: var(--sb-text);
  font-size: var(--sb-font-size-label);
  font-family: inherit;
}

.sb-input:focus {
  outline: none;
  border-color: var(--sb-primary);
}
</style>
