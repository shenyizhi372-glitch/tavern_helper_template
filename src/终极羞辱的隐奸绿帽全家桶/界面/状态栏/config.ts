/**
 * 终极羞辱的隐奸绿帽全家桶 状态栏配置：六女角色切换 tab + 图鉴成就面板。
 *
 * 变量路径对应卡根 schema.ts（stat_data 点分路径，不含前缀）：
 * - 世界.当前日期 / 时间段 / 当前场景 / 最近事件 / 收集进度
 * - 六女.好感度 / 堕落度 / 当前行动 / 当前穿搭 / 胸部状况 / 私处状况 / 脸部状况 / 内心话 / 最近性行为
 * - 沐冰铃.契合度（100→14，越低调教成果越大）；守护神沐星怜.处女膜进度（55→100）、愿望卷收集
 *
 * 堕落度阶段划分（与性格调色盘 EJS 一致）：
 * <30 抗拒期 / 30~59 动摇期 / 60~79 沉迷期 / >=80 臣服期
 */
import type { StatusBarConfig } from '../../../通用/状态栏/types';

/** 堕落度进度条阈值配色：低绿、中黄、高橙、红 */
const corruptionThresholds = [
  { min: 80, color: '#e53935' },
  { min: 60, color: '#fb8c00' },
  { min: 30, color: '#fdd835' },
  { color: '#66bb6a' },
];

/** 好感度进度条阈值配色 */
const affectionThresholds = [
  { min: 80, color: '#e91e63' },
  { min: 50, color: '#f48fb1' },
  { color: '#9e9e9e' },
];

/** 契合度进度条阈值（越低越好，红→绿） */
const affinityThresholds = [
  { min: 80, color: '#e53935' },
  { min: 50, color: '#fb8c00' },
  { min: 20, color: '#fdd835' },
  { color: '#66bb6a' },
];

/** 处女膜进度阈值配色（越高越接近开苞，绿→红） */
const hymenThresholds = [
  { min: 80, color: '#e53935' },
  { min: 60, color: '#fb8c00' },
  { min: 40, color: '#fdd835' },
  { color: '#66bb6a' },
];

/** 六女通用字段模板（进度条 + 部位反应 + 内心话） */
const girlFields = (key: string, extraFields: Array<{ type: 'text'; path: string; label: string; icon: string }> = []) => [
  {
    type: 'progress' as const,
    path: `${key}.好感度`,
    label: '好感度',
    icon: '💗',
    thresholds: affectionThresholds,
  },
  {
    type: 'progress' as const,
    path: `${key}.堕落度`,
    label: '堕落度',
    icon: '🌊',
    thresholds: corruptionThresholds,
  },
  { type: 'text' as const, path: `${key}.当前行动`, label: '行动', icon: '🧑‍💼' },
  { type: 'text' as const, path: `${key}.当前穿搭`, label: '穿搭', icon: '👗' },
  { type: 'text' as const, path: `${key}.胸部状况`, label: '胸部', icon: '🍒' },
  { type: 'text' as const, path: `${key}.私处状况`, label: '私处', icon: '🌸' },
  { type: 'text' as const, path: `${key}.脸部状况`, label: '脸部', icon: '👄' },
  ...extraFields,
  { type: 'text' as const, path: `${key}.内心话`, label: '内心话', icon: '💭' },
  { type: 'text' as const, path: `${key}.最近性行为`, label: '最近性行为', icon: '📅' },
];

export const config: StatusBarConfig = {
  title: '终极羞辱 · 全家桶调教',
  roles: [
    { id: 'mwj', icon: '👩', name: '沐温凝' },
    { id: 'myr', icon: '👑', name: '沐嫣染' },
    { id: 'mbl', icon: '❄️', name: '沐冰铃' },
    { id: 'msn', icon: '💼', name: '沐霜凝' },
    { id: 'rr', icon: '🩰', name: '软软' },
    { id: 'shs', icon: '🐉', name: '守护神' },
  ],
  sections: [
    {
      id: 'system',
      label: '系统',
      icon: '📍',
      fields: [
        { type: 'text', path: '世界.当前日期', label: '日期', icon: '📅' },
        { type: 'text', path: '世界.时间段', label: '时段', icon: '🕐' },
        { type: 'text', path: '世界.当前场景', label: '场景', icon: '📍' },
        { type: 'text', path: '世界.最近事件', label: '最近事件', icon: '📜' },
        { type: 'text', path: '世界.收集进度', label: '收集进度', icon: '📖' },
      ],
    },
    {
      id: 'mwj',
      role: 'mwj',
      label: '沐温凝',
      icon: '👩',
      fields: girlFields('沐温凝', [
        { type: 'text', path: '沐温凝.黑丝裤袜状况', label: '裤袜', icon: '🖤' },
      ]),
    },
    {
      id: 'myr',
      role: 'myr',
      label: '沐嫣染',
      icon: '👑',
      fields: girlFields('沐嫣染', [
        { type: 'text', path: '沐嫣染.神赐力状况', label: '神赐力', icon: '🔥' },
      ]),
    },
    {
      id: 'mbl',
      role: 'mbl',
      label: '沐冰铃',
      icon: '❄️',
      fields: [
        {
          type: 'progress',
          path: '沐冰铃.契合度',
          label: '契合度',
          icon: '📐',
          thresholds: affinityThresholds,
        },
        ...girlFields('沐冰铃'),
      ],
    },
    {
      id: 'msn',
      role: 'msn',
      label: '沐霜凝',
      icon: '💼',
      fields: girlFields('沐霜凝', [
        { type: 'text', path: '沐霜凝.蜜穴状况', label: '蜜穴', icon: '🎀' },
      ]),
    },
    {
      id: 'rr',
      role: 'rr',
      label: '软软',
      icon: '🩰',
      fields: girlFields('软软', [
        { type: 'text', path: '软软.芭蕾裙状况', label: '芭蕾裙', icon: '🩱' },
      ]),
    },
    {
      id: 'shs',
      role: 'shs',
      label: '守护神',
      icon: '🐉',
      fields: [
        {
          type: 'progress',
          path: '守护神沐星怜.处女膜进度',
          label: '处女膜进度',
          icon: '🔞',
          thresholds: hymenThresholds,
        },
        { type: 'text', path: '守护神沐星怜.愿望卷收集', label: '愿望卷', icon: '🎫' },
        ...girlFields('守护神沐星怜'),
      ],
    },
    {
      id: 'plot',
      label: '剧情发展',
      icon: '🎯',
      collapsible: false,
      fields: [
        {
          type: 'choice',
          path: '剧情发展',
          label: '下一步',
          options: [
            { label: '正常', icon: '🍀', action: { mode: 'message', content: '（剧情正常推进）' } },
            { label: '暧昧', icon: '💋', action: { mode: 'message', content: '（剧情朝暧昧方向发展）' } },
            { label: '露骨', icon: '🔥', action: { mode: 'message', content: '（剧情朝露骨方向发展）' } },
            { label: '其他', icon: '🌀', action: { mode: 'message', content: '（剧情自由发展）' } },
          ],
        },
      ],
    },
  ],
};

/** 项目自定义主题预设（暗红调教风），设置界面可切换 */
export const settings = {
  themePresets: [
    {
      id: 'zhongji',
      label: '暗红调教',
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
  ],
};
