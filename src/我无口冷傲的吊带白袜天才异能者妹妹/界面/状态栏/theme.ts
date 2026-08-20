/**
 * 主题覆盖：继承默认主题，按项目微调（永冬冰蓝 + 吊带袜冷调）。
 */
import type { ThemeOverride } from '../../../通用/状态栏/types';

export const theme: ThemeOverride = {
  colors: {
    primary: '#0288d1', // 冰蓝：徽章、强调
    accent: '#4fc3f7', // 进度条填充
    danger: '#e53935', // 危险（高怀疑度 / 臣服阶段）
    surface: '#f4faff', // 面板底色（冰白）
    surfaceAlt: '#e8f4fd', // 次级底色
  },
  radius: {
    panel: '10px',
    pill: '14px',
  },
  density: 'normal',
};
