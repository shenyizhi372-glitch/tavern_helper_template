/**
 * 从雌小鬼NTL 状态栏配置：角色切换 tab + 分阶段立绘框架。
 *
 * 变量路径对应卡根 schema.ts（stat_data 点分路径，不含前缀）：
 * - 世界.当前日期 / 时段 / 当前地点 / 最近事件
 * - 四女.好感度 / 堕落度 / 胸部状况 / 私处状况 / 脸部状况 / 内心话（妮丝另有白袜状况）
 *
 * 堕落度阶段划分（与性格调色盘 EJS 一致）：
 * <30 抗拒期 / 30~59 动摇期 / 60~79 沉迷期 / >=80 臣服期
 * 立绘图片 URL 为占位路径，素材后续放入 src/从雌小鬼NTL/图片/ 后生效。
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

/** 四女通用字段模板（行动/穿搭 + 部位反应 + 内心话） */
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
  title: '从雌小鬼 · 调教状态',
  roles: [
    { id: 'gulan', icon: '👑', name: '师傅古兰' },
    { id: 'nise', icon: '👧', name: '妮丝' },
    { id: 'aoluola', icon: '👩', name: '奥萝拉' },
    { id: 'yisina', icon: '🐱', name: '伊丝娜' },
  ],
  sections: [
    {
      id: 'system',
      label: '系统',
      icon: '📍',
      fields: [
        { type: 'text', path: '世界.当前日期', label: '日期', icon: '📅' },
        { type: 'text', path: '世界.时段', label: '时段', icon: '🕐' },
        { type: 'text', path: '世界.当前地点', label: '地点', icon: '📍' },
        { type: 'text', path: '世界.最近事件', label: '最近事件', icon: '📜' },
      ],
    },
    {
      id: 'gulan',
      role: 'gulan',
      label: '师傅古兰',
      icon: '👑',
      fields: girlFields('师傅古兰', [
        { type: 'text', path: '师傅古兰.威严状况', label: '威严', icon: '🗡️' },
      ]),
    },
    {
      id: 'nise',
      role: 'nise',
      label: '妮丝',
      icon: '👧',
      fields: girlFields('妮丝', [
        { type: 'text', path: '妮丝.白袜状况', label: '白袜', icon: '🧦' },
      ]),
    },
    {
      id: 'aoluola',
      role: 'aoluola',
      label: '奥萝拉',
      icon: '👩',
      fields: girlFields('奥萝拉', [
        { type: 'text', path: '奥萝拉.黑丝状况', label: '黑丝', icon: '🖤' },
      ]),
    },
    {
      id: 'yisina',
      role: 'yisina',
      label: '伊丝娜',
      icon: '🐱',
      fields: girlFields('伊丝娜', [
        { type: 'text', path: '伊丝娜.猫耳猫尾状况', label: '猫耳猫尾', icon: '🐈' },
      ]),
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
  gallery: {
    characters: [
      {
        id: 'gulan',
        name: '师傅古兰',
        icon: '👑',
        images: [
          {
            id: '抗拒',
            label: '抗拒',
            url: 'https://testingcf.jsdelivr.net/gh/shenyizhi372-glitch/tavern_helper_template/src/从雌小鬼NTL/图片/师傅古兰_抗拒.png',
            unlock: { type: 'threshold', variable: '师傅古兰.堕落度', max: 29 },
          },
          {
            id: '动摇',
            label: '动摇',
            url: 'https://testingcf.jsdelivr.net/gh/shenyizhi372-glitch/tavern_helper_template/src/从雌小鬼NTL/图片/师傅古兰_动摇.png',
            unlock: { type: 'threshold', variable: '师傅古兰.堕落度', min: 30, max: 59 },
          },
          {
            id: '沉迷',
            label: '沉迷',
            url: 'https://testingcf.jsdelivr.net/gh/shenyizhi372-glitch/tavern_helper_template/src/从雌小鬼NTL/图片/师傅古兰_沉迷.png',
            unlock: { type: 'threshold', variable: '师傅古兰.堕落度', min: 60, max: 79 },
          },
          {
            id: '臣服',
            label: '臣服',
            url: 'https://testingcf.jsdelivr.net/gh/shenyizhi372-glitch/tavern_helper_template/src/从雌小鬼NTL/图片/师傅古兰_臣服.png',
            unlock: { type: 'threshold', variable: '师傅古兰.堕落度', min: 80 },
          },
        ],
      },
      {
        id: 'nise',
        name: '妮丝',
        icon: '👧',
        images: [
          {
            id: '抗拒',
            label: '抗拒',
            url: 'https://testingcf.jsdelivr.net/gh/shenyizhi372-glitch/tavern_helper_template/src/从雌小鬼NTL/图片/妮丝_抗拒.png',
            unlock: { type: 'threshold', variable: '妮丝.堕落度', max: 29 },
          },
          {
            id: '动摇',
            label: '动摇',
            url: 'https://testingcf.jsdelivr.net/gh/shenyizhi372-glitch/tavern_helper_template/src/从雌小鬼NTL/图片/妮丝_动摇.png',
            unlock: { type: 'threshold', variable: '妮丝.堕落度', min: 30, max: 59 },
          },
          {
            id: '沉迷',
            label: '沉迷',
            url: 'https://testingcf.jsdelivr.net/gh/shenyizhi372-glitch/tavern_helper_template/src/从雌小鬼NTL/图片/妮丝_沉迷.png',
            unlock: { type: 'threshold', variable: '妮丝.堕落度', min: 60, max: 79 },
          },
          {
            id: '臣服',
            label: '臣服',
            url: 'https://testingcf.jsdelivr.net/gh/shenyizhi372-glitch/tavern_helper_template/src/从雌小鬼NTL/图片/妮丝_臣服.png',
            unlock: { type: 'threshold', variable: '妮丝.堕落度', min: 80 },
          },
        ],
      },
      {
        id: 'aoluola',
        name: '奥萝拉',
        icon: '👩',
        images: [
          {
            id: '抗拒',
            label: '抗拒',
            url: 'https://testingcf.jsdelivr.net/gh/shenyizhi372-glitch/tavern_helper_template/src/从雌小鬼NTL/图片/奥萝拉_抗拒.png',
            unlock: { type: 'threshold', variable: '奥萝拉.堕落度', max: 29 },
          },
          {
            id: '动摇',
            label: '动摇',
            url: 'https://testingcf.jsdelivr.net/gh/shenyizhi372-glitch/tavern_helper_template/src/从雌小鬼NTL/图片/奥萝拉_动摇.png',
            unlock: { type: 'threshold', variable: '奥萝拉.堕落度', min: 30, max: 59 },
          },
          {
            id: '沉迷',
            label: '沉迷',
            url: 'https://testingcf.jsdelivr.net/gh/shenyizhi372-glitch/tavern_helper_template/src/从雌小鬼NTL/图片/奥萝拉_沉迷.png',
            unlock: { type: 'threshold', variable: '奥萝拉.堕落度', min: 60, max: 79 },
          },
          {
            id: '臣服',
            label: '臣服',
            url: 'https://testingcf.jsdelivr.net/gh/shenyizhi372-glitch/tavern_helper_template/src/从雌小鬼NTL/图片/奥萝拉_臣服.png',
            unlock: { type: 'threshold', variable: '奥萝拉.堕落度', min: 80 },
          },
        ],
      },
      {
        id: 'yisina',
        name: '伊丝娜',
        icon: '🐱',
        images: [
          {
            id: '抗拒',
            label: '抗拒',
            url: 'https://testingcf.jsdelivr.net/gh/shenyizhi372-glitch/tavern_helper_template/src/从雌小鬼NTL/图片/伊丝娜_抗拒.png',
            unlock: { type: 'threshold', variable: '伊丝娜.堕落度', max: 29 },
          },
          {
            id: '动摇',
            label: '动摇',
            url: 'https://testingcf.jsdelivr.net/gh/shenyizhi372-glitch/tavern_helper_template/src/从雌小鬼NTL/图片/伊丝娜_动摇.png',
            unlock: { type: 'threshold', variable: '伊丝娜.堕落度', min: 30, max: 59 },
          },
          {
            id: '沉迷',
            label: '沉迷',
            url: 'https://testingcf.jsdelivr.net/gh/shenyizhi372-glitch/tavern_helper_template/src/从雌小鬼NTL/图片/伊丝娜_沉迷.png',
            unlock: { type: 'threshold', variable: '伊丝娜.堕落度', min: 60, max: 79 },
          },
          {
            id: '臣服',
            label: '臣服',
            url: 'https://testingcf.jsdelivr.net/gh/shenyizhi372-glitch/tavern_helper_template/src/从雌小鬼NTL/图片/伊丝娜_臣服.png',
            unlock: { type: 'threshold', variable: '伊丝娜.堕落度', min: 80 },
          },
        ],
      },
    ],
  },
};
