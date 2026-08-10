/**
 * 主题：默认主题（宝可梦卡风格）+ 合并与 CSS 变量转换（纯函数，可单测）
 *
 * 默认主题为「宝可梦卡」风格：
 * - ━━━ 分隔线夹分区标题（【区块名】）
 * - 符号图标 + 可折叠区块
 * - 宝可梦球配色（深蓝 + 红 + 卡纸米白）
 *
 * 具体风格后续再定，扩展点：新增主题配置键时，在 ThemeOverride 与
 * themeToCssVars 中同步补充即可。
 */
import type { Density, StatusBarTheme, ThemeOverride } from './types';

/** 密度 → 基础字号（组件内部使用 em，随密度整体缩放） */
const DENSITY_FONT_SIZES: Record<Density, string> = {
  compact: '12px',
  normal: '13.5px',
  comfortable: '15px',
};

export const defaultTheme: StatusBarTheme = {
  colors: {
    primary: '#3b4cca', // 宝可梦卡蓝
    accent: '#ff1f1f', // 宝可梦球红
    success: '#2e7d32',
    warning: '#f9a825',
    danger: '#c62828',
    surface: '#fdfbf7', // 卡纸米白
    surfaceAlt: '#f3efe5',
    text: '#2b2b2b',
    textMuted: '#6f6a5e',
    border: '#d8d2c4',
    progressTrack: '#e8e2d4',
    progressFill: '#ff1f1f',
  },
  font: {
    family: `-apple-system, 'Segoe UI', 'Microsoft YaHei', 'PingFang SC', sans-serif`,
    sizeSmall: '0.85em',
    sizeLabel: '0.92em',
  },
  radius: {
    panel: '10px',
    pill: '999px',
  },
  density: 'normal',
  section: {
    dividerChar: '━',
    headerStyle: 'divider',
    bracketLeft: '【',
    bracketRight: '】',
    iconCollapsed: '▶',
    iconExpanded: '▼',
  },
  spacing: {
    panelPadding: '0.8em',
    itemGap: '0.5em',
    sectionGap: '0.6em',
  },
};

/** 主题深合并：override 只覆盖给出的键，其余沿用 base */
export function mergeTheme(base: StatusBarTheme, override?: ThemeOverride | null): StatusBarTheme {
  if (!override) {
    return base;
  }
  return {
    colors: { ...base.colors, ...(override.colors ?? {}) },
    font: { ...base.font, ...(override.font ?? {}) },
    radius: { ...base.radius, ...(override.radius ?? {}) },
    section: { ...base.section, ...(override.section ?? {}) },
    spacing: { ...base.spacing, ...(override.spacing ?? {}) },
    density: override.density ?? base.density,
  };
}

/** 主题对象 → CSS 变量（界面通过 var(--sb-*) 消费） */
export function themeToCssVars(theme: StatusBarTheme): Record<string, string> {
  const { colors, font, radius, spacing } = theme;
  return {
    '--sb-primary': colors.primary,
    '--sb-accent': colors.accent,
    '--sb-success': colors.success,
    '--sb-warning': colors.warning,
    '--sb-danger': colors.danger,
    '--sb-surface': colors.surface,
    '--sb-surface-alt': colors.surfaceAlt,
    '--sb-text': colors.text,
    '--sb-text-muted': colors.textMuted,
    '--sb-border': colors.border,
    '--sb-progress-track': colors.progressTrack,
    '--sb-progress-fill': colors.progressFill,
    '--sb-font-family': font.family,
    '--sb-font-size': DENSITY_FONT_SIZES[theme.density],
    '--sb-font-size-small': font.sizeSmall,
    '--sb-font-size-label': font.sizeLabel,
    '--sb-radius-panel': radius.panel,
    '--sb-radius-pill': radius.pill,
    '--sb-pad-panel': spacing.panelPadding,
    '--sb-gap-item': spacing.itemGap,
    '--sb-gap-section': spacing.sectionGap,
  };
}
