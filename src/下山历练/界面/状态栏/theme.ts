/**
 * 主题覆盖：继承默认主题，按项目微调（魔道暗紫 + 绯红，贴合调教禁忌感）。
 */
import type { ThemeOverride } from '../../../通用/状态栏/types';

export const theme: ThemeOverride = {
  colors: {
    primary: '#6a1b9a', // 魔道紫：徽章、强调
    accent: '#c2185b', // 绯红：进度条填充
    danger: '#b71c1c', // 危险（高沦陷度）
    surface: '#faf5ff', // 面板底色（淡紫白）
    surfaceAlt: '#f3e9ff', // 次级底色
  },
  radius: {
    panel: '10px',
    pill: '14px',
  },
  density: 'normal',
};
