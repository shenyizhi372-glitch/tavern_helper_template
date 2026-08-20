/**
 * 我无口冷傲的吊带白袜天才异能者妹妹 状态栏配置：角色切换 tab + 分阶段立绘框架。
 *
 * 变量路径对应卡根 schema.ts（stat_data 点分路径，不含前缀）：
 * - 系统.当前剧情阶段 / 当前地点 / 最近事件
 * - 叶冰璃.调教进度 / 胸部状况 / 私处状况 / 淫纹状况 / 脸部状况 / 吊带袜状况 / 内心话
 * - 叶理.怀疑度
 * - 支线.苏沐雪 / 白汐 / 炎绯 / 林晚晴.攻略进度
 *
 * 调教进度阶段划分（与性格调色盘 EJS 一致）：
 * <30 抗拒期 / 30~59 动摇期 / 60~79 沉沦期 / >=80 臣服期
 * 怀疑度梯度：<30 风平浪静 / 30~59 盘问试探 / 60~84 暗中追查 / 85~99 临界逼近 / 100 满值对峙
 * 立绘图片 URL 为占位路径，素材后续放入 src/我无口冷傲的吊带白袜天才异能者妹妹/图片/ 后生效。
 */
import type { StatusBarConfig } from '../../../通用/状态栏/types';

/** 调教进度进度条阈值配色：冰蓝（抗拒）→ 黄（动摇）→ 橙（沉沦）→ 红（臣服） */
const trainThresholds = [
  { min: 80, color: '#e53935' },
  { min: 60, color: '#fb8c00' },
  { min: 30, color: '#fdd835' },
  { color: '#4fc3f7' },
];

/** 叶理怀疑度进度条阈值配色：绿（风平浪静）→ 黄 → 橙 → 红（临界/满值） */
const suspicionThresholds = [
  { min: 85, color: '#e53935' },
  { min: 60, color: '#fb8c00' },
  { min: 30, color: '#fdd835' },
  { color: '#66bb6a' },
];

/** 支线攻略进度阈值配色 */
const subThresholds = [
  { min: 80, color: '#ec407a' },
  { min: 50, color: '#f48fb1' },
  { color: '#4fc3f7' },
];

export const config: StatusBarConfig = {
  title: '无口妹妹 · 调教状态',
  roles: [
    { id: 'ybl', icon: '❄️', name: '叶冰璃' },
    { id: 'yeli', icon: '👁️', name: '叶理' },
    { id: 'sub', icon: '🌸', name: '支线' },
  ],
  sections: [
    {
      id: 'system',
      label: '系统',
      icon: '📍',
      fields: [
        { type: 'text', path: '系统.当前剧情阶段', label: '剧情阶段', icon: '📜' },
        { type: 'text', path: '系统.当前地点', label: '地点', icon: '📍' },
        { type: 'text', path: '系统.最近事件', label: '最近事件', icon: '📌' },
      ],
    },
    {
      id: 'ybl',
      role: 'ybl',
      label: '叶冰璃',
      icon: '❄️',
      fields: [
        { type: 'progress', path: '叶冰璃.调教进度', label: '调教进度', icon: '🩷', thresholds: trainThresholds },
        { type: 'text', path: '叶冰璃.胸部状况', label: '胸部', icon: '🍒' },
        { type: 'text', path: '叶冰璃.私处状况', label: '私处', icon: '🌸' },
        { type: 'text', path: '叶冰璃.淫纹状况', label: '淫纹', icon: '🩸' },
        { type: 'text', path: '叶冰璃.脸部状况', label: '脸部', icon: '👄' },
        { type: 'text', path: '叶冰璃.吊带袜状况', label: '吊带袜', icon: '🧦' },
        { type: 'text', path: '叶冰璃.内心话', label: '内心话', icon: '💭' },
      ],
    },
    {
      id: 'yeli',
      role: 'yeli',
      label: '叶理',
      icon: '👁️',
      fields: [
        { type: 'progress', path: '叶理.怀疑度', label: '怀疑度', icon: '⚠️', thresholds: suspicionThresholds },
        { type: 'text', path: '系统.最近事件', label: '动态', icon: '📌' },
      ],
    },
    {
      id: 'sub',
      role: 'sub',
      label: '支线',
      icon: '🌸',
      fields: [
        { type: 'progress', path: '支线.苏沐雪.攻略进度', label: '苏沐雪', icon: '📖', thresholds: subThresholds },
        { type: 'progress', path: '支线.白汐.攻略进度', label: '白汐', icon: '🐚', thresholds: subThresholds },
        { type: 'progress', path: '支线.炎绯.攻略进度', label: '炎绯', icon: '🔥', thresholds: subThresholds },
        { type: 'progress', path: '支线.林晚晴.攻略进度', label: '林晚晴', icon: '🌼', thresholds: subThresholds },
      ],
    },
  ],
  gallery: {
    characters: [
      {
        id: 'ybl',
        name: '叶冰璃',
        icon: '❄️',
        images: [
          {
            id: '抗拒',
            label: '抗拒',
            url: 'https://testingcf.jsdelivr.net/gh/shenyizhi372-glitch/tavern_helper_template/src/我无口冷傲的吊带白袜天才异能者妹妹/图片/叶冰璃_抗拒.png',
            unlock: { type: 'threshold', variable: '叶冰璃.调教进度', max: 29 },
          },
          {
            id: '动摇',
            label: '动摇',
            url: 'https://testingcf.jsdelivr.net/gh/shenyizhi372-glitch/tavern_helper_template/src/我无口冷傲的吊带白袜天才异能者妹妹/图片/叶冰璃_动摇.png',
            unlock: { type: 'threshold', variable: '叶冰璃.调教进度', min: 30, max: 59 },
          },
          {
            id: '沉沦',
            label: '沉沦',
            url: 'https://testingcf.jsdelivr.net/gh/shenyizhi372-glitch/tavern_helper_template/src/我无口冷傲的吊带白袜天才异能者妹妹/图片/叶冰璃_沉沦.png',
            unlock: { type: 'threshold', variable: '叶冰璃.调教进度', min: 60, max: 79 },
          },
          {
            id: '臣服',
            label: '臣服',
            url: 'https://testingcf.jsdelivr.net/gh/shenyizhi372-glitch/tavern_helper_template/src/我无口冷傲的吊带白袜天才异能者妹妹/图片/叶冰璃_臣服.png',
            unlock: { type: 'threshold', variable: '叶冰璃.调教进度', min: 80 },
          },
        ],
      },
    ],
  },
};
