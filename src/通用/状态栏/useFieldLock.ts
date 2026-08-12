/**
 * 字段锁状态（输入密钥解锁后可交互）
 * keys 传 useSettings 的 keys ref（同 key 的锁共享解锁状态）
 */
import { computed, ref } from 'vue';
import type { FieldLock } from './types';

export function useFieldLock(lock: FieldLock | undefined, keys: { value: string[] }) {
  const showInput = ref(false);
  const input = ref('');

  const locked = computed(() => !!lock && !keys.value.includes(lock.key));

  /** 点击锁定控件：弹出密钥输入 */
  function request() {
    if (locked.value) {
      showInput.value = true;
    }
  }

  /** 提交密钥：匹配即解锁（记录到 keys） */
  function submit(): boolean {
    if (!lock) {
      return true;
    }
    if (input.value.trim() === lock.key) {
      if (!keys.value.includes(lock.key)) {
        keys.value = [...keys.value, lock.key];
      }
      showInput.value = false;
      input.value = '';
      return true;
    }
    return false;
  }

  function cancel() {
    showInput.value = false;
    input.value = '';
  }

  return { locked, showInput, input, request, submit, cancel };
}
