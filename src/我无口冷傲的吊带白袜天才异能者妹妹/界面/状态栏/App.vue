<template>
  <StatusBar :config="config" :theme="theme" :data="store.data" />
</template>

<script setup lang="ts">
import StatusBar from '../../../通用/状态栏/App.vue';
import { config } from './config';
import { theme } from './theme';
import { useDataStore } from './store';

const store = useDataStore();
</script>
