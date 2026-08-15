/**
 * 下山历练 状态栏配置：三女攻略进度 + 系统 + 调教者目标 + 攻略节奏。
 *
 * 变量路径对应卡根 schema.ts（stat_data 点分路径，不含前缀）：
 * - 系统.当前日期 / 当前时间段 / 当前场景 / 最近事件 / 结局分支
 * - user.当前目标 / 已攻略对象
 * - 二娘.攻略阶段 / 沦陷度 / 胸部状况 / 私处状况 / 表情状况 / 内心话
 * - 三娘.攻略阶段 / 沦陷度 / ...（同上）
 * - 大娘.攻略阶段 / 沦陷度 / ...（同上）
 *
 * 攻略阶段划分（与性格调色盘 EJS 一致）：
 * 二娘：1相识 2试探 3上手 4调教 5沉沦
 * 三娘：1相识 2设套 3落败 4调教 5沉沦
 * 大娘：1相识 2破防 3完败 4调教 5沦陷
 */
import type { StatusBarConfig } from '../../../通用/状态栏/types';

/** 攻略阶段进度条阈值配色（1~5，值越高越接近沦陷） */
const stageThresholds = [
  { min: 5, color: '#b71c1c' },
  { min: 4, color: '#e53935' },
  { min: 3, color: '#fb8c00' },
  { min: 2, color: '#f9a825' },
  { color: '#7cb342' },
];

/** 沦陷度进度条阈值配色 */
const corruptionThresholds = [
  { min: 80, color: '#b71c1c' },
  { min: 60, color: '#e53935' },
  { min: 30, color: '#fb8c00' },
  { color: '#7cb342' },
];

/** 角色通用字段模板（攻略阶段 + 沦陷度 + 部位反应 + 内心话） */
const girlFields = (key: string) => [
  {
    type: 'progress' as const,
    path: `${key}.攻略阶段`,
    label: '攻略阶段',
    icon: '🎯',
    min: 1,
    max: 5,
    showValue: true,
    thresholds: stageThresholds,
  },
  {
    type: 'progress' as const,
    path: `${key}.沦陷度`,
    label: '沦陷度',
    icon: '🌊',
    thresholds: corruptionThresholds,
  },
  { type: 'text' as const, path: `${key}.胸部状况`, label: '胸部', icon: '🍒' },
  { type: 'text' as const, path: `${key}.私处状况`, label: '私处', icon: '🌸' },
  { type: 'text' as const, path: `${key}.表情状况`, label: '表情', icon: '👄' },
  { type: 'text' as const, path: `${key}.内心话`, label: '内心话', icon: '💭' },
];

export const config: StatusBarConfig = {
  title: '下山历练 · 攻略进度',
  sections: [
    {
      id: 'system',
      label: '系统',
      icon: '📍',
      fields: [
        { type: 'text', path: '系统.当前日期', label: '日期', icon: '📅' },
        { type: 'text', path: '系统.当前时间段', label: '时段', icon: '🕐' },
        { type: 'text', path: '系统.当前场景', label: '场景', icon: '🗺️' },
        { type: 'text', path: '系统.最近事件', label: '最近事件', icon: '📜' },
      ],
    },
    {
      id: 'user',
      label: '调教者',
      icon: '🐍',
      fields: [
        { type: 'text', path: 'user.当前目标', label: '当前目标', icon: '🎯' },
        { type: 'text', path: 'user.已攻略对象', label: '已攻略', icon: '🏆' },
      ],
    },
    {
      id: 'erniang',
      label: '二娘 · 猫妖',
      icon: '🐱',
      fields: girlFields('二娘'),
    },
    {
      id: 'sanniang',
      label: '三娘 · 小魔女',
      icon: '🎀',
      fields: girlFields('三娘'),
    },
    {
      id: 'daniang',
      label: '大娘 · 剑仙',
      icon: '❄️',
      fields: girlFields('大娘'),
    },
    {
      id: 'pace',
      label: '攻略节奏',
      icon: '🎮',
      collapsible: false,
      fields: [
        {
          type: 'choice',
          path: '攻略节奏',
          label: '节奏',
          options: [
            { label: '推进调教', icon: '🔥', action: { mode: 'message', content: '（剧情朝调教推进方向发展）' } },
            { label: '日常调戏', icon: '😏', action: { mode: 'message', content: '（剧情朝日常调戏方向发展）' } },
            { label: '深入开发', icon: '💥', action: { mode: 'message', content: '（剧情朝深入开发方向发展）' } },
            { label: '自由发挥', icon: '🌀', action: { mode: 'message', content: '（剧情自由发展）' } },
          ],
        },
      ],
    },
  ],
};
