/**
 * 大王饶命吕小鱼 状态栏配置：角色切换 tab + 各角色状态展示。
 *
 * 变量路径对应卡根 schema.ts（stat_data 点分路径，不含前缀）：
 * - 世界.当前日期 / 当前时间段 / 当前场景 / 剧情阶段 / 最近事件
 * - 吕小鱼.堕落度 / 任务进度 / 胸部状况 / 私处状况 / 衣物状况 / 调教要求 / 内心话
 * - 吕树.察觉度 / 负面情绪值；卡洛儿.驯化度；姜束衣.雌堕度；曹青辞.接触度；user.灵石 / 当前任务
 *
 * 堕落度阶段划分（与性格调色盘 EJS 一致）：
 * <30 抗拒期 / 30~59 口嫌体正直期 / 60~79 叫主人期 / >=80 土下座期
 * 驯化度：<40 大小姐 / 40~69 动摇 / >=70 白皮猪；雌堕度：<40 假小子 / 40~69 动摇 / >=70 雌堕
 */
import type { StatusBarConfig } from '../../../通用/状态栏/types';

/** 堕落度进度条阈值配色：低绿、中黄、高橙、红 */
const corruptionThresholds = [
  { min: 80, color: '#e53935' },
  { min: 60, color: '#fb8c00' },
  { min: 30, color: '#fdd835' },
  { color: '#66bb6a' },
];

/** 驯化度/雌堕度阈值配色：三段式 */
const tamingThresholds = [
  { min: 70, color: '#e53935' },
  { min: 40, color: '#fb8c00' },
  { color: '#66bb6a' },
];

/** 吕树察觉度阈值配色：绿帽警报，越高越危险 */
const awareThresholds = [
  { min: 70, color: '#e53935' },
  { min: 40, color: '#fb8c00' },
  { color: '#66bb6a' },
];

/** 任务阶段枚举徽章 */
const stageMapping = {
  第一阶: { label: '第一阶', icon: '🥕' },
  二进阶: { label: '二进阶', icon: '🎭' },
  三阶背堕: { label: '三阶背堕', icon: '🔥' },
  结局后: { label: '结局后', icon: '👑' },
};

export const config: StatusBarConfig = {
  title: '大王饶命 · 调教状态',
  roles: [
    { id: 'xiaoyu', icon: '👧', name: '吕小鱼' },
    { id: 'kaluoer', icon: '👱‍♀️', name: '卡洛儿' },
    { id: 'jiangshuyi', icon: '⚔️', name: '姜束衣' },
  ],
  sections: [
    {
      id: 'system',
      label: '系统',
      icon: '📍',
      fields: [
        { type: 'text', path: '世界.当前日期', label: '日期', icon: '📅' },
        { type: 'text', path: '世界.当前时间段', label: '时段', icon: '🕐' },
        { type: 'text', path: '世界.当前场景', label: '场景', icon: '🗺️' },
        { type: 'enum', path: '世界.剧情阶段', label: '任务阶段', icon: '🎯', mapping: stageMapping },
        { type: 'text', path: '世界.最近事件', label: '最近事件', icon: '📜' },
      ],
    },
    {
      id: 'xiaoyu',
      role: 'xiaoyu',
      label: '吕小鱼',
      icon: '👧',
      fields: [
        { type: 'progress', path: '吕小鱼.堕落度', label: '堕落度', icon: '🌊', thresholds: corruptionThresholds },
        { type: 'enum', path: '吕小鱼.任务进度', label: '任务进度', icon: '📋', mapping: stageMapping },
        { type: 'text', path: '吕小鱼.衣物状况', label: '衣物', icon: '👗' },
        { type: 'text', path: '吕小鱼.胸部状况', label: '胸部', icon: '🍒' },
        { type: 'text', path: '吕小鱼.私处状况', label: '私处', icon: '🌸' },
        { type: 'text', path: '吕小鱼.调教要求', label: '调教要求', icon: '📌' },
        { type: 'text', path: '吕小鱼.内心话', label: '内心话', icon: '💭' },
      ],
    },
    {
      id: 'kaluoer',
      role: 'kaluoer',
      label: '卡洛儿',
      icon: '👱‍♀️',
      fields: [
        { type: 'progress', path: '卡洛儿.驯化度', label: '驯化度', icon: '🦄', thresholds: tamingThresholds },
        { type: 'text', path: '卡洛儿.内心话', label: '内心话', icon: '💭' },
      ],
    },
    {
      id: 'jiangshuyi',
      role: 'jiangshuyi',
      label: '姜束衣',
      icon: '⚔️',
      fields: [
        { type: 'progress', path: '姜束衣.雌堕度', label: '雌堕度', icon: '🌹', thresholds: tamingThresholds },
        { type: 'text', path: '姜束衣.内心话', label: '内心话', icon: '💭' },
      ],
    },
    {
      id: 'lushu',
      label: '吕树',
      icon: '🫣',
      fields: [
        { type: 'progress', path: '吕树.察觉度', label: '察觉度', icon: '🚨', thresholds: awareThresholds },
        { type: 'number', path: '吕树.负面情绪值', label: '负面情绪值', icon: '⚡' },
      ],
    },
    {
      id: 'caoqingci',
      label: '曹青辞',
      icon: '🧊',
      fields: [
        { type: 'progress', path: '曹青辞.接触度', label: '接触度', icon: '❄️', thresholds: tamingThresholds },
      ],
    },
    {
      id: 'user',
      label: '主人',
      icon: '💰',
      fields: [
        { type: 'number', path: 'user.灵石', label: '灵石', icon: '💎' },
        { type: 'text', path: 'user.当前任务', label: '当前任务', icon: '📌' },
      ],
    },
  ],
};
