<template>
  <i v-if="isFontAwesome" :class="icon" aria-hidden="true"></i>
  <span v-else-if="icon" class="sb-symbol" aria-hidden="true">{{ icon }}</span>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  /** 符号字符（如 ❤）或 FontAwesome 类名（如 'fa-solid fa-heart'） */
  icon?: string;
}>();

/** 以 fa 开头的类名视为 FontAwesome 图标，其余视为符号字符 */
const isFontAwesome = computed(() => !!props.icon && /^fa[srb]?[\s-]/.test(props.icon.trim()));
</script>

<style scoped>
.sb-symbol {
  display: inline-block;
  line-height: 1;
}
</style>
