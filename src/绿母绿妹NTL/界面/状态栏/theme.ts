/**
 * 主题覆盖：继承默认主题，按项目微调（蔷薇粉 + 黑丝暗调）。
 */
import type { ThemeOverride } from '../../../通用/状态栏/types';

export const theme: ThemeOverride = {
  colors: {
    primary: '#c2185b', // 蔷薇粉：徽章、强调
    accent: '#ad1457', // 进度条填充
    danger: '#c62828', // 危险（高堕落度）
    surface: '#fff9fb', // 面板底色（暖粉白）
    surfaceAlt: '#fdf0f4', // 次级底色
  },
  radius: {
    panel: '10px',
    pill: '14px',
  },
  density: 'normal',
};
