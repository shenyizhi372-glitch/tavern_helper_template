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
export type FieldType = 'text' | 'number' | 'progress' | 'enum' | 'stars' | 'image' | 'action' | 'choice' | 'slider' | 'input';

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

/* ==================== 交互与图片（V2 扩展） ==================== */

/** 图片来源：三种方式（纯数据，可 JSON/YAML 表达） */
export type ImageSource =
  /** 固定 URL（如 CDN 直链） */
  | { type: 'static'; url: string }
  /** 按变量值查表映射：AI 只需维护 by 指向的键名，前端映射到图 */
  | { type: 'mapped'; by: string; map: Record<string, string> }
  /** 变量直接存 URL */
  | { type: 'fromVariable'; path: string };

/** 图片适应模式 */
export type ImageFit = 'contain' | 'cover' | 'fill';

/** 图片字段 */
export interface ImageFieldConfig extends FieldBase {
  type: 'image';
  source: ImageSource;
  /** 图片适应模式，默认 contain */
  fit?: ImageFit;
  /** 宽高比（如 '16/9'、'1/1'），未设置则按图片原始比例 */
  ratio?: string;
  /** 加载失败/无图时的占位文案，默认 🖼️ */
  placeholder?: string;
}

/** 交互行为：写 MVU 变量（改 store.data → 自动双向同步） */
export interface VariableAction {
  mode: 'variable';
  /** 目标路径（相对 stat_data，支持任意嵌套） */
  path: string;
  /** 数值增量（与 value 二选一；数值字段常用） */
  delta?: number;
  /** 直接设值（与 delta 二选一） */
  value?: string | number | boolean;
  /** 执行后的 toastr 提示文案（可选；无 toastr 环境静默） */
  toast?: string;
}

/** 交互行为：作为用户消息发出并触发 AI */
export interface MessageAction {
  mode: 'message';
  /** 作为用户消息发出的内容 */
  content: string;
  /** 触发斜杠，默认 '/trigger' */
  slash?: string;
  /** 成功后的 toastr 提示文案（可选） */
  toast?: string;
}

export type FieldAction = VariableAction | MessageAction;

/** 按钮字段 */
export interface ActionFieldConfig extends FieldBase {
  type: 'action';
  action: FieldAction;
  /** 字段锁：输入密钥解锁后可交互 */
  lock?: FieldLock;
}

/** 选项组中的单个选项 */
export interface ChoiceOption {
  label: string;
  icon?: string;
  action: FieldAction;
}

/** 选项组字段（单选） */
export interface ChoiceFieldConfig extends FieldBase {
  type: 'choice';
  options: ChoiceOption[];
  /** 点击 message 型选项后是否禁用整组（防重复触发），默认 true */
  lockAfterPick?: boolean;
  /** 字段锁：输入密钥解锁后可交互 */
  lock?: FieldLock;
}

/** 滑块字段（拖动写变量） */
export interface SliderFieldConfig extends FieldBase {
  type: 'slider';
  /** 目标变量路径 */
  path: string;
  /** 下限，默认 0 */
  min?: number;
  /** 上限，默认 100 */
  max?: number;
  /** 步长，默认 1 */
  step?: number;
  /** 是否显示当前值，默认 true */
  showValue?: boolean;
  /** 写入防抖（毫秒），默认 300 */
  debounce?: number;
  /** 字段锁：输入密钥解锁后可交互 */
  lock?: FieldLock;
}

/** 文本输入字段（提交写变量） */
export interface InputFieldConfig extends FieldBase {
  type: 'input';
  /** 目标变量路径 */
  path: string;
  placeholder?: string;
  /** 提交时机：enter=回车提交（默认）/ blur=失焦提交 / live=实时写入 */
  commitOn?: 'enter' | 'blur' | 'live';
  maxLength?: number;
  /** 字段锁：输入密钥解锁后可交互 */
  lock?: FieldLock;
}

/** 面板级图片（顶部立绘区 / 背景图） */
export interface PanelImage {
  id: string;
  /** top=顶部立绘区；background=面板背景图 */
  position: 'top' | 'background';
  source: ImageSource;
  fit?: ImageFit;
  ratio?: string;
  placeholder?: string;
}

/* ==================== 图鉴 / 设置 / 字段锁（V3 扩展） ==================== */

/** 解锁条件（纯数据，可 JSON/YAML）：threshold 阈值 / equals 等值 / all 且 / any 或 */
export type UnlockCondition =
  | { type: 'threshold'; variable: string; min?: number; max?: number }
  | { type: 'equals'; variable: string; value: string | number | boolean }
  | { type: 'all'; conditions: UnlockCondition[] }
  | { type: 'any'; conditions: UnlockCondition[] };

/** 一张阶段图 */
export interface StageImage {
  id: string;
  /** 阶段展示名（如 日常 / 亲昵 / 沉沦） */
  label: string;
  /** 静态图 URL（CDN） */
  url: string;
  /** 解锁条件；省略 = 默认解锁 */
  unlock?: UnlockCondition;
  /** 单图密钥：输入匹配即解锁此图 */
  key?: string;
}

/** 角色图集（人物立绘分阶段） */
export interface CharacterGallery {
  id: string;
  name: string;
  icon?: string;
  images: StageImage[];
}

/** 图鉴配置（面板级） */
export interface GalleryConfig {
  characters: CharacterGallery[];
  /** 全局密钥：输入匹配则解锁全部图鉴（与字段锁共用同一密钥记录） */
  masterKey?: string;
}

/** 主题预设（设置界面切换用） */
export interface ThemePreset {
  id: string;
  label: string;
  theme: ThemeOverride;
}

/** 设置配置 */
export interface SettingsConfig {
  /** 项目自定义主题预设（内置三套之外追加） */
  themePresets?: ThemePreset[];
}

/** 字段锁：输入密钥解锁后控件才可交互 */
export interface FieldLock {
  key: string;
  /** 锁定提示文案（如 输入密钥后可调整） */
  hint?: string;
}

export type FieldConfig =
  | TextFieldConfig
  | NumberFieldConfig
  | ProgressFieldConfig
  | EnumFieldConfig
  | StarsFieldConfig
  | ImageFieldConfig
  | ActionFieldConfig
  | ChoiceFieldConfig
  | SliderFieldConfig
  | InputFieldConfig;

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
  /** 区块顶部配图（可选） */
  image?: {
    source: ImageSource;
    fit?: ImageFit;
    ratio?: string;
    placeholder?: string;
  };
  fields: FieldConfig[];
}

/** 状态栏总配置 */
export interface StatusBarConfig {
  /** 顶部标题，省略则不显示 */
  title?: string;
  /** 面板级图片（顶部立绘区 / 背景图），按声明顺序渲染 */
  images?: PanelImage[];
  /** 图鉴配置（人物立绘分阶段 + 解锁 + 密钥），开启设置界面的图鉴 tab */
  gallery?: GalleryConfig;
  /** 设置配置（自定义主题预设等） */
  settings?: SettingsConfig;
  sections: SectionConfig[];
}
