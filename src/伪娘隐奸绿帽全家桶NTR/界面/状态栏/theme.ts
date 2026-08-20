/**
 * 主题覆盖：继承默认主题，按项目微调（暗夜绿调：绿帽 + 调教掌控感）。
 */
import type { ThemeOverride } from '../../../通用/状态栏/types';

export const theme: ThemeOverride = {
  colors: {
    primary: '#66bb6a', // 绿：徽章、强调（绿帽的绿）
    accent: '#4caf50', // 进度条填充
    success: '#66bb6a',
    warning: '#fdd835',
    danger: '#ef5350',
    surface: '#1e1e26', // 面板底色（暗夜）
    surfaceAlt: '#2a2a34', // 次级底色
    text: '#e8e8ea',
    textMuted: '#9e9ea6',
    textOnPrimary: '#101014',
    border: '#3a3a46',
    progressTrack: '#3a3a46',
    progressFill: '#4caf50',
  },
  font: {
    family: "'Microsoft YaHei', 'Sarasa Mono SC', sans-serif",
  },
  radius: {
    panel: '10px',
    pill: '14px',
  },
  density: 'normal',
};
