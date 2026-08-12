import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { waitUntil } from 'async-wait-until';
import App from './App.vue';
import './global.css';

// 酒馆助手渲染本代码块时已预注入 $ / Vue / _ 等全局变量；
// MVU 变量框架就绪且当前楼层已有 stat_data 后再挂载
$(async () => {
  await waitGlobalInitialized('Mvu');
  await waitUntil(() => _.has(getVariables({ type: 'message' }), 'stat_data'));
  createApp(App).use(createPinia()).mount('#app');
});
