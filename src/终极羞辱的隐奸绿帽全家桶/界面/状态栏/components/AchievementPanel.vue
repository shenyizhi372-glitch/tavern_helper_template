<template>
  <div class="ach-panel">
    <!-- 六女收集卡 -->
    <div class="ach-section-title">👩‍👧‍👦 全家收集图鉴</div>
    <div class="ach-grid">
      <div
        v-for="g in girls"
        :key="g.key"
        class="ach-card"
        :class="{ collected: isCollected(g.name) }"
      >
        <div class="ach-card-head">
          <span class="ach-card-icon">{{ g.icon }}</span>
          <span class="ach-card-name">{{ g.name }}</span>
          <span class="ach-stage" :style="stageStyle(g.key)">{{ stageLabel(g.key) }}</span>
        </div>
        <div class="ach-card-foot">
          <span v-if="isCollected(g.name)" class="ach-badge ach-badge-yes">✓ 已收集</span>
          <span v-else class="ach-badge ach-badge-no">✗ 未收集</span>
        </div>
      </div>
    </div>

    <!-- 硬指标进度 -->
    <div class="ach-section-title">📊 调教硬指标</div>
    <div class="ach-metrics">
      <div class="ach-metric-row">
        <span class="ach-metric-label">🔗 兄妹契合度（越低调教越深）</span>
        <ProgressBar :config="affinityCfg" :value="stat('沐冰铃.契合度')" />
      </div>
      <div class="ach-metric-row">
        <span class="ach-metric-label">🔞 守护神处女膜进度</span>
        <ProgressBar :config="hymenCfg" :value="stat('守护神沐星怜.处女膜进度')" />
      </div>
    </div>

    <!-- 愿望卷收集 -->
    <div class="ach-section-title">🎫 愿望卷收集</div>
    <div class="ach-ticket-list">
      <div class="ach-ticket-item">{{ stat('守护神沐星怜.愿望卷收集') || '无（尚未向<user>发放愿望卷）' }}</div>
    </div>

    <!-- 收集总进度 -->
    <div class="ach-section-title">📖 收集进度</div>
    <div class="ach-progress-text">{{ stat('世界.收集进度') || '暂无收集，图鉴待开启' }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import ProgressBar from '../../../../通用/状态栏/components/ProgressBar.vue';
import type { ProgressFieldConfig } from '../../../../通用/状态栏/types';

const props = defineProps<{ data: unknown }>();

/** stat_data 点分路径取值 */
function stat(path: string): unknown {
  const d = props.data as Record<string, unknown> | undefined;
  if (!d) return undefined;
  let cur: unknown = d;
  for (const seg of path.split('.')) {
    if (cur && typeof cur === 'object' && seg in (cur as Record<string, unknown>)) {
      cur = (cur as Record<string, unknown>)[seg];
    } else {
      return undefined;
    }
  }
  return cur;
}

const girls = [
  { key: '沐温凝', name: '沐温凝', icon: '👩' },
  { key: '沐嫣染', name: '沐嫣染', icon: '👑' },
  { key: '沐冰铃', name: '沐冰铃', icon: '❄️' },
  { key: '沐霜凝', name: '沐霜凝', icon: '💼' },
  { key: '软软', name: '软软', icon: '🩰' },
  { key: '守护神沐星怜', name: '守护神', icon: '🐉' },
];

/** 收集状态：世界.收集进度 文本中包含角色名即视为已收集 */
function isCollected(name: string): boolean {
  const progress = String(stat('世界.收集进度') ?? '');
  if (!progress || progress.includes('暂无')) return false;
  return progress.includes(name);
}

function corruption(key: string): number {
  return Number(stat(`${key}.堕落度`)) || 0;
}

function stageLabel(key: string): string {
  const c = corruption(key);
  if (c >= 80) return '臣服期';
  if (c >= 60) return '沉迷期';
  if (c >= 30) return '动摇期';
  return '抗拒期';
}

function stageStyle(key: string): Record<string, string> {
  const c = corruption(key);
  const colors = [
    { min: 80, bg: '#e53935' },
    { min: 60, bg: '#fb8c00' },
    { min: 30, bg: '#fdd835', dark: true },
    { bg: '#66bb6a' },
  ];
  for (const t of colors) {
    if (c >= (t.min ?? -Infinity)) {
      return { backgroundColor: t.bg, color: t.dark ? '#333' : '#fff' };
    }
  }
  return { backgroundColor: '#66bb6a', color: '#fff' };
}

const affinityCfg = computed<ProgressFieldConfig>(() => ({
  type: 'progress',
  path: '沐冰铃.契合度',
  label: '契合度',
  icon: '🔗',
  min: 0,
  max: 100,
  showValue: true,
  thresholds: [
    { min: 80, color: '#e53935' },
    { min: 50, color: '#fb8c00' },
    { min: 20, color: '#fdd835' },
    { color: '#66bb6a' },
  ],
}));

const hymenCfg = computed<ProgressFieldConfig>(() => ({
  type: 'progress',
  path: '守护神沐星怜.处女膜进度',
  label: '处女膜进度',
  icon: '🔞',
  min: 0,
  max: 100,
  showValue: true,
  thresholds: [
    { min: 80, color: '#e53935' },
    { min: 60, color: '#fb8c00' },
    { min: 40, color: '#fdd835' },
    { color: '#66bb6a' },
  ],
}));
</script>

<style scoped>
.ach-panel {
  padding: 0.2em 0;
}

.ach-section-title {
  margin: 0.6em 0 0.4em;
  font-weight: 700;
  color: var(--sb-text);
}

.ach-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(9.5em, 1fr));
  gap: 0.4em;
}

.ach-card {
  padding: 0.5em 0.6em;
  border: 1px solid var(--sb-border);
  border-radius: var(--sb-radius-panel);
  background-color: var(--sb-surface-alt);
  opacity: 0.75;
}

.ach-card.collected {
  opacity: 1;
  border-color: var(--sb-primary);
  box-shadow: 0 0 0 1px var(--sb-primary) inset;
}

.ach-card-head {
  display: flex;
  align-items: center;
  gap: 0.35em;
  margin-bottom: 0.35em;
}

.ach-card-icon {
  font-size: 1.2em;
}

.ach-card-name {
  font-weight: 700;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ach-stage {
  font-size: 0.72em;
  padding: 0.1em 0.4em;
  border-radius: var(--sb-radius-pill);
  white-space: nowrap;
}

.ach-card-foot {
  text-align: right;
}

.ach-badge {
  font-size: 0.75em;
  padding: 0.1em 0.4em;
  border-radius: var(--sb-radius-pill);
}

.ach-badge-yes {
  background-color: var(--sb-primary);
  color: #fff;
}

.ach-badge-no {
  background-color: var(--sb-border);
  color: var(--sb-text-muted);
}

.ach-metrics {
  display: flex;
  flex-direction: column;
  gap: 0.35em;
}

.ach-metric-row {
  display: flex;
  align-items: center;
  gap: 0.5em;
}

.ach-metric-label {
  flex: 0 0 13em;
  font-size: 0.82em;
}

.ach-ticket-list {
  margin-bottom: 0.2em;
}

.ach-ticket-item {
  padding: 0.4em 0.6em;
  border: 1px dashed var(--sb-border);
  border-radius: var(--sb-radius-panel);
  background-color: var(--sb-surface-alt);
  font-size: 0.85em;
}

.ach-progress-text {
  padding: 0.4em 0.6em;
  border: 1px dashed var(--sb-border);
  border-radius: var(--sb-radius-panel);
  background-color: var(--sb-surface-alt);
  font-size: 0.85em;
}
</style>
