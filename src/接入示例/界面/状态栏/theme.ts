/**
 * 主题覆盖示例：继承默认「宝可梦卡」主题，只覆盖想改的键。
 * 想完全自定义风格时，也可以整体传入自定义 StatusBarTheme。
 */
import type { ThemeOverride } from '../../../通用/状态栏/types';

export const theme: ThemeOverride = {
  colors: {
    primary: '#2f3f9f', // 徽章主色加深
    surface: '#fffdf6', // 面板底色微调
  },
  radius: {
    panel: '8px',
  },
  density: 'normal',
};
