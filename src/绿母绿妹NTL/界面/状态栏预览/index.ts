import { createApp } from 'vue';
import App from './App.vue';

// 预览页：无酒馆助手环境，直接挂载（zod 全局由模板中 zod.global.js 同步提供）
$(() => {
  createApp(App).mount('#app');
});
