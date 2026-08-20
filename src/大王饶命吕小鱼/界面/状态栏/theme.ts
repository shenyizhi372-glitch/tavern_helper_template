/**
 * 主题覆盖：继承默认主题，按项目微调（暗金黑紫，背德调教风）。
 */
import type { ThemeOverride } from '../../../通用/状态栏/types';

export const theme: ThemeOverride = {
  colors: {
    primary: '#c9a227', // 暗金：徽章、强调
    accent: '#e0b93a', // 进度条填充
    danger: '#e53935', // 危险（高堕落度/察觉度）
    success: '#66bb6a', // 正向（低堕落度）
    warning: '#fb8c00', // 警示
    surface: '#26222b', // 面板底色（暗紫黑）
    surfaceAlt: '#322c38', // 次级底色
    text: '#f0e6d2', // 主文字（暖白）
    textMuted: '#a89f8e', // 次要文字
    textOnPrimary: '#1a1508', // 暗金上的前景文字
    border: '#4a4354', // 边框
    progressTrack: '#3a3444', // 进度条轨道
    progressFill: '#c9a227', // 进度条默认填充
  },
  radius: {
    panel: '10px',
    pill: '14px',
  },
  density: 'normal',
};
