<template>
  <div class="sb-header">
    <span class="sb-header-item">
      <span class="sb-header-icon">📅</span>
      <span class="sb-header-label">日期</span>
      <span class="sb-header-value">{{ data.日期 || '—' }}</span>
    </span>
    <span class="sb-header-sep" />
    <span class="sb-header-item">
      <span class="sb-header-icon">⏰</span>
      <span class="sb-header-label">时间</span>
      <span class="sb-header-value">{{ data.时间 || '—' }}</span>
    </span>
    <span class="sb-header-sep" />
    <span class="sb-header-item sb-header-place">
      <span class="sb-header-icon">📍</span>
      <span class="sb-header-label">位置</span>
      <span class="sb-header-value">{{ data.地点 || '—' }}</span>
    </span>
  </div>
</template>

<script setup lang="ts">
import type { Schema } from '../../../schema';

defineProps<{ data: Schema['系统'] }>();
</script>
