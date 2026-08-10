/**
 * 通用状态栏 - 配置与主题类型定义
 *
 * 本文件只定义「数据契约」，不包含任何项目专属字段。
 * 界面如何展示变量，完全由外部传入的 StatusBarConfig 决定。
 */

/** 展示密度 */
export type Density = 'compact' | 'normal' | 'comfortable';

/** 主题配色（功能语义命名，禁止视觉描述命名） */
export interface ThemeColors {
  /** 主色：徽章、强调元素 */
  primary: string;
  /** 强调色：进度条填充等 */
  accent: string;
  /** 正向状态（如低危险度） */
  success: string;
  /** 警示状态 */
  warning: string;
  /** 危险状态 */
  danger: string;
  /** 面板底色 */
  surface: string;
  /** 次级底色（表头、交替行） */
  surfaceAlt: string;
  /** 主文字 */
  text: string;
  /** 次要文字（标签） */
  textMuted: string;
  /** 边框、分隔线 */
  border: string;
  /** 进度条轨道 */
  progressTrack: string;
  /** 进度条默认填充色 */
  progressFill: string;
}

export interface ThemeFont {
  /** 字体族，如 'Microsoft YaHei', sans-serif */
  family: string;
  /** 小字号（角标、辅助信息） */
  sizeSmall: string;
  /** 标签字号 */
  sizeLabel: string;
}

export interface ThemeRadius {
  /** 区块圆角 */
  panel: string;
  /** 徽章圆角 */
  pill: string;
}

/** 分区标题样式 */
export interface ThemeSection {
  /** 分隔线字符（如 ━ ─ ═） */
  dividerChar: string;
  /** 标题形态：divider=分隔线夹标题，card=色块标题栏 */
  headerStyle: 'divider' | 'card';
  /** 标题左括号（如 【） */
  bracketLeft: string;
  /** 标题右括号（如 】） */
  bracketRight: string;
  /** 折叠图标 */
  iconCollapsed: string;
  /** 展开图标 */
  iconExpanded: string;
}

export interface ThemeSpacing {
  /** 区块内容内边距 */
  panelPadding: string;
  /** 条目间距 */
  itemGap: string;
  /** 区块间距 */
  sectionGap: string;
}

export interface StatusBarTheme {
  colors: ThemeColors;
  font: ThemeFont;
  radius: ThemeRadius;
  density: Density;
  section: ThemeSection;
  spacing: ThemeSpacing;
}

/** 主题覆盖：只写想改的键，其余沿用默认主题 */
export type ThemeOverride = {
  colors?: Partial<ThemeColors>;
  font?: Partial<ThemeFont>;
  radius?: Partial<ThemeRadius>;
  section?: Partial<ThemeSection>;
  spacing?: Partial<ThemeSpacing>;
  density?: Density;
};

/** 字段类型 */
export type FieldType = 'text' | 'number' | 'progress' | 'enum' | 'stars';

/** 字段公共属性 */
export interface FieldBase {
  /** stat_data 内的点分路径，如 '系统.当前视角'（不需要 stat_data. 前缀） */
  path: string;
  /** 展示标签 */
  label: string;
  /** 图标：符号字符（如 ❤）或 FontAwesome 类名（如 'fa-solid fa-heart'） */
  icon?: string;
  /** 值缺失或为空时的占位文案，默认 '—' */
  fallback?: string;
}

/** 纯文本展示 */
export interface TextFieldConfig extends FieldBase {
  type: 'text';
}

/** 数字展示 */
export interface NumberFieldConfig extends FieldBase {
  type: 'number';
  /** 小数位数（四舍五入），不传保留原值 */
  precision?: number;
}

/** 数值进度条 */
export interface ProgressFieldConfig extends FieldBase {
  type: 'progress';
  /** 下限，默认 0 */
  min?: number;
  /** 上限，默认 100 */
  max?: number;
  /** 是否显示 当前/上限 数值，默认 true */
  showValue?: boolean;
  /** 阈值配色：按 min 从大到小声明，取第一个 value >= threshold.min 的颜色 */
  thresholds?: Array<{ min?: number; color: string }>;
}

/** 枚举值的一种徽章样式 */
export interface EnumStyle {
  /** 展示文案，默认原值 */
  label?: string;
  /** 徽章底色，默认主题主色 */
  color?: string;
  /** 徽章图标 */
  icon?: string;
}

/** 枚举值 → 徽章映射 */
export interface EnumFieldConfig extends FieldBase {
  type: 'enum';
  /** 值 → 徽章样式；未覆盖的值按原值渲染 */
  mapping: Record<string, EnumStyle>;
}

/** 星级展示（★★★★☆） */
export interface StarsFieldConfig extends FieldBase {
  type: 'stars';
  /** 星级上限，默认 5 */
  max?: number;
}

export type FieldConfig =
  | TextFieldConfig
  | NumberFieldConfig
  | ProgressFieldConfig
  | EnumFieldConfig
  | StarsFieldConfig;

/** 分组区块 */
export interface SectionConfig {
  /** 唯一 id */
  id: string;
  /** 区块标题 */
  label: string;
  /** 区块图标 */
  icon?: string;
  /** 是否可折叠，默认 true */
  collapsible?: boolean;
  /** 默认是否折叠，默认 false */
  defaultCollapsed?: boolean;
  fields: FieldConfig[];
}

/** 状态栏总配置 */
export interface StatusBarConfig {
  /** 顶部标题，省略则不显示 */
  title?: string;
  sections: SectionConfig[];
}
