/**
 * 伪娘隐奸绿帽全家桶NTR 状态栏配置：角色切换 tab + 分阶段立绘框架。
 *
 * 变量路径对应卡根 schema.ts（stat_data 点分路径，不含前缀）：
 * - 世界.当前时间 / 当前场景 / 沐昕察觉度
 * - user.攻略阶段 / 已攻略对象
 * - 六女与萝莉团.堕落度 / 调教进度 / 最近性行为（软软变量路径为阮软）
 *
 * 堕落度阶段划分（与性格调色盘 EJS 一致）：
 * <30 抗拒期 / 30~59 动摇期 / 60~79 沉迷期 / >=80 臣服期
 * 立绘图片 URL 为占位路径，素材后续放入 src/伪娘隐奸绿帽全家桶NTR/图片/ 后生效。
 */
import type { StatusBarConfig } from '../../../通用/状态栏/types';

/** 堕落度进度条阈值配色：低绿、中黄、高橙、红 */
const corruptionThresholds = [
  { min: 80, color: '#ef5350' },
  { min: 60, color: '#fb8c00' },
  { min: 30, color: '#fdd835' },
  { color: '#66bb6a' },
];

/** 沐昕察觉度阈值配色 */
const noticeThresholds = [
  { min: 80, color: '#ef5350' },
  { min: 40, color: '#fdd835' },
  { color: '#66bb6a' },
];

/** 女性角色通用字段模板（堕落度 + 调教进度 + 最近性行为） */
const girlFields = (key: string) => [
  {
    type: 'progress' as const,
    path: `${key}.堕落度`,
    label: '堕落度',
    icon: '🌊',
    thresholds: corruptionThresholds,
  },
  { type: 'text' as const, path: `${key}.调教进度`, label: '调教进度', icon: '📖' },
  { type: 'text' as const, path: `${key}.最近性行为`, label: '最近性行为', icon: '🔥' },
];

/** 图鉴立绘占位 URL 模板（素材放入 src/伪娘隐奸绿帽全家桶NTR/图片/ 后生效） */
const stageImages = (char: string, name: string, icon: string, variable: string) => ({
  id: char,
  name,
  icon,
  images: [
    {
      id: '抗拒',
      label: '抗拒',
      url: `https://testingcf.jsdelivr.net/gh/shenyizhi372-glitch/tavern_helper_template/src/伪娘隐奸绿帽全家桶NTR/图片/${char}_抗拒.png`,
      unlock: { type: 'threshold' as const, variable, max: 29 },
    },
    {
      id: '动摇',
      label: '动摇',
      url: `https://testingcf.jsdelivr.net/gh/shenyizhi372-glitch/tavern_helper_template/src/伪娘隐奸绿帽全家桶NTR/图片/${char}_动摇.png`,
      unlock: { type: 'threshold' as const, variable, min: 30, max: 59 },
    },
    {
      id: '沉迷',
      label: '沉迷',
      url: `https://testingcf.jsdelivr.net/gh/shenyizhi372-glitch/tavern_helper_template/src/伪娘隐奸绿帽全家桶NTR/图片/${char}_沉迷.png`,
      unlock: { type: 'threshold' as const, variable, min: 60, max: 79 },
    },
    {
      id: '臣服',
      label: '臣服',
      url: `https://testingcf.jsdelivr.net/gh/shenyizhi372-glitch/tavern_helper_template/src/伪娘隐奸绿帽全家桶NTR/图片/${char}_臣服.png`,
      unlock: { type: 'threshold' as const, variable, min: 80 },
    },
  ],
});

export const config: StatusBarConfig = {
  title: '伪娘隐奸 · 全家桶攻略',
  roles: [
    { id: 'baiyaqin', icon: '👩', name: '白雅琴' },
    { id: 'muyanran', icon: '🔥', name: '沐嫣染' },
    { id: 'mubingling', icon: '🧊', name: '沐冰铃' },
    { id: 'baiyating', icon: '💋', name: '白雅婷' },
    { id: 'ruanruan', icon: '🎀', name: '软软' },
    { id: 'qinyun', icon: '👘', name: '秦韵' },
    { id: 'tuantuan', icon: '🧒', name: '萝莉团' },
  ],
  sections: [
    {
      id: 'system',
      label: '攻略总览',
      icon: '🎯',
      fields: [
        { type: 'text', path: '世界.当前时间', label: '时间', icon: '📅' },
        { type: 'text', path: '世界.当前场景', label: '场景', icon: '📍' },
        {
          type: 'enum',
          path: 'user.攻略阶段',
          label: '攻略阶段',
          icon: '🛗',
          mapping: {
            潜伏渗透: { label: '潜伏渗透', color: '#66bb6a', icon: '🕵️' },
            当面攻略: { label: '当面攻略', color: '#fdd835', icon: '🗣️' },
            全面掌控: { label: '全面掌控', color: '#ef5350', icon: '👑' },
          },
        },
        {
          type: 'progress',
          path: '世界.沐昕察觉度',
          label: '沐昕察觉度',
          icon: '👀',
          thresholds: noticeThresholds,
        },
        { type: 'text', path: 'user.已攻略对象', label: '已攻略', icon: '🏆' },
      ],
    },
    { id: 'baiyaqin', role: 'baiyaqin', label: '白雅琴', icon: '👩', fields: girlFields('白雅琴') },
    { id: 'muyanran', role: 'muyanran', label: '沐嫣染', icon: '🔥', fields: girlFields('沐嫣染') },
    { id: 'mubingling', role: 'mubingling', label: '沐冰铃', icon: '🧊', fields: girlFields('沐冰铃') },
    { id: 'baiyating', role: 'baiyating', label: '白雅婷', icon: '💋', fields: girlFields('白雅婷') },
    { id: 'ruanruan', role: 'ruanruan', label: '软软', icon: '🎀', fields: girlFields('阮软') },
    { id: 'qinyun', role: 'qinyun', label: '秦韵', icon: '👘', fields: girlFields('秦韵') },
    { id: 'tuantuan', role: 'tuantuan', label: '萝莉团', icon: '🧒', fields: girlFields('萝莉团') },
  ],
  gallery: {
    characters: [
      stageImages('白雅琴', '白雅琴', '👩', '白雅琴.堕落度'),
      stageImages('沐嫣染', '沐嫣染', '🔥', '沐嫣染.堕落度'),
      stageImages('沐冰铃', '沐冰铃', '🧊', '沐冰铃.堕落度'),
      stageImages('白雅婷', '白雅婷', '💋', '白雅婷.堕落度'),
      stageImages('软软', '软软', '🎀', '阮软.堕落度'),
      stageImages('秦韵', '秦韵', '👘', '秦韵.堕落度'),
      stageImages('萝莉团', '萝莉团', '🧒', '萝莉团.堕落度'),
    ],
  },
};
