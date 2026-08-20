/**
 * 古风肥臀 · 调教全家桶 状态栏配置：五女角色切换 tab。
 *
 * 变量路径对应卡根 schema.ts（stat_data 点分路径，不含前缀）：
 * - 系统.当前时间 / 当前地点 / 当前场景 / 当前对象
 * - 五女.调教阶段（抗拒/动摇/沉沦/依恋） / 顺从度（0~100） / 依恋度（0~100）
 *
 * 调教阶段与性格调色盘 EJS 一致：抗拒→动摇→沉沦→依恋。
 */
import type { StatusBarConfig } from '../../../通用/状态栏/types';

/** 顺从度进度条阈值配色：低灰、中黄、高橙、满红（调教越深越"堕落"色） */
const obedienceThresholds = [
  { min: 80, color: '#c62828' },
  { min: 50, color: '#fb8c00' },
  { min: 20, color: '#fdd835' },
  { color: '#9e9e9e' },
];

/** 依恋度进度条阈值配色：低灰、中粉、高玫红 */
const attachmentThresholds = [
  { min: 80, color: '#d81b60' },
  { min: 50, color: '#f06292' },
  { min: 20, color: '#f8bbd0' },
  { color: '#9e9e9e' },
];

/** 五女通用字段模板（阶段 + 顺从度 + 依恋度） */
const girlFields = (key: string) => [
  {
    type: 'text' as const,
    path: `${key}.调教阶段`,
    label: '调教阶段',
    icon: '🔗',
  },
  {
    type: 'progress' as const,
    path: `${key}.顺从度`,
    label: '顺从度',
    icon: '🦴',
    thresholds: obedienceThresholds,
  },
  {
    type: 'progress' as const,
    path: `${key}.依恋度`,
    label: '依恋度',
    icon: '💗',
    thresholds: attachmentThresholds,
  },
];

export const config: StatusBarConfig = {
  title: '古风肥臀 · 调教全家桶',
  roles: [
    { id: 'lxy', icon: '👸', name: '洛雪莹' },
    { id: 'kke', icon: '🎀', name: '叶可儿' },
    { id: 'tne', icon: '🧸', name: '叶甜儿' },
    { id: 'wne', icon: '📖', name: '叶雯儿' },
    { id: 'qne', icon: '🍼', name: '叶芊儿' },
  ],
  sections: [
    {
      id: 'system',
      label: '系统',
      icon: '📍',
      fields: [
        { type: 'text', path: '系统.当前时间', label: '时间', icon: '🕐' },
        { type: 'text', path: '系统.当前地点', label: '地点', icon: '🏯' },
        { type: 'text', path: '系统.当前场景', label: '场景', icon: '📍' },
        { type: 'text', path: '系统.当前对象', label: '调教对象', icon: '🎯' },
      ],
    },
    {
      id: 'lxy',
      role: 'lxy',
      label: '洛雪莹',
      icon: '👸',
      fields: girlFields('洛雪莹'),
    },
    {
      id: 'kke',
      role: 'kke',
      label: '叶可儿',
      icon: '🎀',
      fields: girlFields('叶可儿'),
    },
    {
      id: 'tne',
      role: 'tne',
      label: '叶甜儿',
      icon: '🧸',
      fields: girlFields('叶甜儿'),
    },
    {
      id: 'wne',
      role: 'wne',
      label: '叶雯儿',
      icon: '📖',
      fields: girlFields('叶雯儿'),
    },
    {
      id: 'qne',
      role: 'qne',
      label: '叶芊儿',
      icon: '🍼',
      fields: girlFields('叶芊儿'),
    },
  ],
};

/** 项目自定义主题预设（古风暗红调教风），设置界面可切换 */
export const settings = {
  themePresets: [
    {
      id: 'gufeng',
      label: '古风暗红',
      theme: {
        colors: {
          primary: '#8e2f2f',
          accent: '#c62828',
          success: '#2e7d32',
          warning: '#f9a825',
          danger: '#b71c1c',
          surface: '#fff8f6',
          surfaceAlt: '#fdf0ec',
          text: '#3b2b2b',
          textMuted: '#a0857f',
          textOnPrimary: '#ffffff',
          border: '#e8d5d0',
          progressTrack: '#ead9d4',
          progressFill: '#c62828',
        },
        font: { family: `'Microsoft YaHei', 'PingFang SC', 'Noto Sans SC', system-ui, sans-serif` },
        radius: { panel: '10px', pill: '14px' },
      },
    },
    {
      id: 'gold',
      label: '鎏金宫庭',
      theme: {
        colors: {
          primary: '#8d6e2f',
          accent: '#b8860b',
          success: '#2e7d32',
          warning: '#f9a825',
          danger: '#b71c1c',
          surface: '#fdfbf5',
          surfaceAlt: '#f7f1e0',
          text: '#3a3324',
          textMuted: '#a3926b',
          textOnPrimary: '#ffffff',
          border: '#e6dcc0',
          progressTrack: '#efe7d2',
          progressFill: '#b8860b',
        },
        font: { family: `'Microsoft YaHei', 'PingFang SC', 'Noto Sans SC', system-ui, sans-serif` },
        radius: { panel: '10px', pill: '14px' },
      },
    },
  ],
};
