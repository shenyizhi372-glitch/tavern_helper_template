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
import type { Density, StatusBarTheme, ThemeOverride, ThemePreset } from './types';

/** 密度 → 基础字号（组件内部使用 em，随密度整体缩放） */
export const DENSITY_FONT_SIZES: Record<Density, string> = {
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
    textOnPrimary: '#ffffff',
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
    '--sb-text-on-primary': colors.textOnPrimary,
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

/** 内置主题预设（设置界面切换用；'default' 即宝可梦卡默认主题） */
export const presetThemes: ThemePreset[] = [
  {
    id: 'family',
    label: '温馨家庭',
    theme: {
      colors: {
        primary: '#b0714f',
        accent: '#d98f8f',
        success: '#7fa57f',
        warning: '#d9a441',
        danger: '#c05252',
        surface: '#fffaf3',
        surfaceAlt: '#f7efe2',
        text: '#4d4138',
        textMuted: '#a4937f',
        textOnPrimary: '#ffffff',
        border: '#e9dcc9',
        progressTrack: '#e9dcc9',
        progressFill: '#d98f8f',
      },
      font: { family: `'Microsoft YaHei', 'PingFang SC', 'Noto Sans SC', system-ui, sans-serif` },
    },
  },
  {
    id: 'night',
    label: '暗色夜行',
    theme: {
      colors: {
        primary: '#9d7bd8',
        accent: '#e07bd0',
        success: '#7fc98a',
        warning: '#d9b45c',
        danger: '#e06060',
        surface: '#23212b',
        surfaceAlt: '#2e2b3a',
        text: '#e8e4f0',
        textMuted: '#9a93ad',
        textOnPrimary: '#23212b', // 暗夜主色为浅紫，深色前景文字保证对比度
        border: '#433e54',
        progressTrack: '#3a3550',
        progressFill: '#9d7bd8',
      },
      font: { family: `-apple-system, 'Segoe UI', 'Microsoft YaHei', sans-serif` },
      radius: { panel: '12px' },
    },
  },
];
