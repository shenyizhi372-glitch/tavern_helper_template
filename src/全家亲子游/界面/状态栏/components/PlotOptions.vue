<template>
  <div class="sb-plot">
    <div class="sb-plot-title">剧情发展</div>
    <div class="sb-plot-opts">
      <button
        v-for="(o, i) in options"
        :key="i"
        class="sb-plot-opt"
        :class="[`t-${o.type}`, { picked: picked === i }]"
        type="button"
        :disabled="busy || picked !== null"
        @click="pick(i)"
      >
        <b class="sb-plot-type">{{ o.type }}</b>
        <span class="sb-plot-text">{{ o.text }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { Schema } from '../../../schema';

const props = defineProps<{ options: Schema['剧情']['可选发展'] }>();

const busy = ref(false);
const picked = ref<number | null>(null);

/**
 * 点击剧情选项 → 作为用户消息发出并触发 AI 继续（选择框示例模式）。
 * 预览环境（无酒馆助手全局）下降级为本地提示。
 */
async function pick(index: number) {
  if (busy.value || picked.value !== null) {
    return;
  }
  const option = props.options[index];
  picked.value = index;
  busy.value = true;
  try {
    if (typeof createChatMessages === 'function' && typeof triggerSlash === 'function') {
      await createChatMessages([{ role: 'user', message: `[剧情发展] ${option.type}：${option.text}` }]);
      triggerSlash('/trigger');
    } else if (typeof toastr !== 'undefined') {
      toastr.info(`[预览] 已选择：${option.text}`);
    }
  } finally {
    busy.value = false;
  }
}
</script>

<style scoped>
.sb-plot {
  /* 面板底部整行（与 .sb-layout 左右边距对齐） */
  margin: 4px 10px 10px;
  padding: 10px 12px;
  background: var(--c-surface-alt);
  border-radius: 10px;
}

.sb-plot-title {
  margin-bottom: 8px;
  font-size: 12px;
  font-weight: 700;
  color: var(--c-text-muted);
  letter-spacing: 0.1em;
}

.sb-plot-opts {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.sb-plot-opt {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border: 1px solid var(--c-border);
  border-radius: 12px;
  background: var(--c-surface);
  color: var(--c-text);
  font-size: 13px;
  font-family: inherit;
  text-align: left;
  cursor: pointer;
  transition: border-color 0.15s ease, transform 0.1s ease;
}

.sb-plot-opt:hover:not(:disabled) {
  border-color: var(--c-primary);
  transform: translateX(2px);
}

.sb-plot-opt:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.sb-plot-opt.picked {
  border-color: var(--c-success);
}

.sb-plot-type {
  flex-shrink: 0;
  font-size: 12px;
}

.sb-plot-text {
  line-height: 1.5;
}

/* 类型着色（沿用原 t-* 约定） */
.t-正常 .sb-plot-type {
  color: var(--c-success);
}

.t-色情 .sb-plot-type {
  color: var(--c-accent);
}

.t-淫秽 .sb-plot-type {
  color: var(--c-danger);
}

.t-其他 .sb-plot-type {
  color: var(--c-text-muted);
}
</style>
