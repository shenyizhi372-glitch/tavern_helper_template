<template>
  <div class="status-root">
    <StatusPanel v-if="store.data" :data="store.data" :store="store" />
    <div v-else class="status-missing">[状态栏缺失]</div>
  </div>
</template>

<script setup lang="ts">
import StatusPanel from './components/StatusPanel.vue';
import { useDataStore } from './store';

const store = useDataStore();
</script>

<style scoped>
.status-root {
  width: 100%;
}

.status-missing {
  display: none;
}
</style>
