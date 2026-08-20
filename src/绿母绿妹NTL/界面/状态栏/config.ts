/**
 * 绿母绿妹NTL 状态栏配置：双角色分区 + 分阶段立绘框架。
 *
 * 变量路径对应卡根 schema.ts（stat_data 点分路径，不含前缀）：
 * - 世界.当前日期 / 当前时间段 / 当前场景 / 最近事件
 * - 林小蛮.好感度 / 堕落度 / 胸部状况 / 私处状况 / 脸部状况 / 白袜状况 / 内心话
 * - 林凤仪.好感度 / 堕落度 / 胸部状况 / 私处状况 / 脸部状况 / 内心话
 *
 * 堕落度阶段划分（与性格调色盘 EJS 一致）：
 * <30 初见期 / 30~59 契约期(妈妈:动摇) / 60~79 调教期 / >=80 沦陷期
 * 立绘图片 URL 为占位路径，素材后续放入 src/绿母绿妹NTL/图片/ 后生效。
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

/** 角色通用字段模板（部位反应 + 内心话） */
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
  { type: 'text' as const, path: `${key}.胸部状况`, label: '胸部', icon: '🍒' },
  { type: 'text' as const, path: `${key}.私处状况`, label: '私处', icon: '🌸' },
  { type: 'text' as const, path: `${key}.脸部状况`, label: '脸部', icon: '👄' },
  ...extraFields,
  { type: 'text' as const, path: `${key}.内心话`, label: '内心话', icon: '💭' },
];

export const config: StatusBarConfig = {
  title: '绿母绿妹 · 契约状态',
  sections: [
    {
      id: 'system',
      label: '系统',
      icon: '📍',
      fields: [
        { type: 'text', path: '世界.当前日期', label: '日期', icon: '📅' },
        { type: 'text', path: '世界.当前时间段', label: '时段', icon: '🕐' },
        { type: 'text', path: '世界.当前场景', label: '场景', icon: '📍' },
        { type: 'text', path: '世界.最近事件', label: '最近事件', icon: '📜' },
      ],
    },
    {
      id: 'xiaoman',
      label: '林小蛮',
      icon: '👧',
      fields: girlFields('林小蛮', [
        { type: 'text', path: '林小蛮.白袜状况', label: '白袜', icon: '🧦' },
      ]),
    },
    {
      id: 'fengyi',
      label: '林凤仪',
      icon: '👩',
      fields: girlFields('林凤仪'),
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
        id: 'xiaoman',
        name: '林小蛮',
        icon: '👧',
        images: [
          {
            id: '初见',
            label: '初见',
            url: 'https://testingcf.jsdelivr.net/gh/shenyizhi372-glitch/tavern_helper_template/src/绿母绿妹NTL/图片/林小蛮_初见.png',
            unlock: { type: 'threshold', variable: '林小蛮.堕落度', max: 29 },
          },
          {
            id: '契约',
            label: '契约',
            url: 'https://testingcf.jsdelivr.net/gh/shenyizhi372-glitch/tavern_helper_template/src/绿母绿妹NTL/图片/林小蛮_契约.png',
            unlock: { type: 'threshold', variable: '林小蛮.堕落度', min: 30, max: 59 },
          },
          {
            id: '调教',
            label: '调教',
            url: 'https://testingcf.jsdelivr.net/gh/shenyizhi372-glitch/tavern_helper_template/src/绿母绿妹NTL/图片/林小蛮_调教.png',
            unlock: { type: 'threshold', variable: '林小蛮.堕落度', min: 60, max: 79 },
          },
          {
            id: '沦陷',
            label: '沦陷',
            url: 'https://testingcf.jsdelivr.net/gh/shenyizhi372-glitch/tavern_helper_template/src/绿母绿妹NTL/图片/林小蛮_沦陷.png',
            unlock: { type: 'threshold', variable: '林小蛮.堕落度', min: 80 },
          },
        ],
      },
      {
        id: 'fengyi',
        name: '林凤仪',
        icon: '👩',
        images: [
          {
            id: '初见',
            label: '初见',
            url: 'https://testingcf.jsdelivr.net/gh/shenyizhi372-glitch/tavern_helper_template/src/绿母绿妹NTL/图片/林凤仪_初见.png',
            unlock: { type: 'threshold', variable: '林凤仪.堕落度', max: 29 },
          },
          {
            id: '契约',
            label: '契约',
            url: 'https://testingcf.jsdelivr.net/gh/shenyizhi372-glitch/tavern_helper_template/src/绿母绿妹NTL/图片/林凤仪_契约.png',
            unlock: { type: 'threshold', variable: '林凤仪.堕落度', min: 30, max: 59 },
          },
          {
            id: '动摇',
            label: '动摇',
            url: 'https://testingcf.jsdelivr.net/gh/shenyizhi372-glitch/tavern_helper_template/src/绿母绿妹NTL/图片/林凤仪_动摇.png',
            unlock: { type: 'threshold', variable: '林凤仪.堕落度', min: 60, max: 79 },
          },
          {
            id: '沦陷',
            label: '沦陷',
            url: 'https://testingcf.jsdelivr.net/gh/shenyizhi372-glitch/tavern_helper_template/src/绿母绿妹NTL/图片/林凤仪_沦陷.png',
            unlock: { type: 'threshold', variable: '林凤仪.堕落度', min: 80 },
          },
        ],
      },
    ],
  },
};
