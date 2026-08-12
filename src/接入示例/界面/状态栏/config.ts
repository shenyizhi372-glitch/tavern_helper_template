/**
 * 演示配置：基于现有项目变量（系统 / 凯瑟琳 / 小胖）
 *
 * 这份配置演示了通用状态栏的全部能力：
 * - text：纯文本
 * - enum：枚举值 → 彩色徽章（含图标映射）
 * - progress：数值进度条（0-100 自动渲染 + 阈值配色）
 * - stars：星级展示（★★★★☆）
 * - slider：滑块（拖动写变量，防抖 300ms）
 * - input：文本输入（回车提交写变量）
 * - choice：选项组（点击写变量 / 发消息触发 AI）
 * - number：数值展示（可指定小数位）
 *
 * 真实项目接入时，把本文件按自己的变量路径重写即可，界面代码零改动。
 */
import type { StatusBarConfig } from '../../../通用/状态栏/types';

export const config: StatusBarConfig = {
  title: '当前状态',
  sections: [
    {
      id: 'system',
      label: '系统',
      icon: '📍',
      fields: [
        { type: 'text', path: '系统.当前日期', label: '日期', icon: '📅' },
        { type: 'text', path: '系统.时段', label: '时段', icon: '🕐' },
        { type: 'text', path: '系统.当前地点', label: '地点', icon: '📍' },
        {
          type: 'enum',
          path: '系统.当前视角',
          label: '视角',
          icon: '👁️',
          mapping: {
            丈夫: { label: '丈夫视角', color: '#3b4cca' },
            小胖: { label: '小胖视角', color: '#e91e63' },
          },
        },
        { type: 'text', path: '系统.小胖来访状态', label: '来访', icon: '🚪', fallback: '未在' },
      ],
    },
    {
      id: 'katherine',
      label: '凯瑟琳',
      icon: '💗',
      fields: [
        {
          type: 'enum',
          path: '凯瑟琳.沦陷阶段',
          label: '沦陷阶段',
          icon: '🌊',
          mapping: {
            纯真期: { color: '#66bb6a' },
            试探期: { color: '#fdd835' },
            沉沦期: { color: '#ff8a65' },
            堕落期: { color: '#e53935' },
          },
        },
        {
          type: 'progress',
          path: '凯瑟琳.身体开发度',
          label: '身体开发度',
          icon: '💠',
          showValue: true,
          thresholds: [
            { min: 66, color: '#e53935' }, // 高 → 危险红
            { min: 33, color: '#f9a825' }, // 中 → 警示黄
            { color: '#2e7d32' }, // 低 → 安全绿
          ],
        },
        { type: 'text', path: '凯瑟琳.身体状态', label: '状态', icon: '✨' },
        { type: 'text', path: '凯瑟琳.最近事件', label: '最近事件', icon: '📜' },
        // 演示 stars 类型：0-100 的数值按 5 星展示（值/20 取整）
        { type: 'stars', path: '凯瑟琳.身体开发度', label: '开发星级', icon: '⭐', max: 5 },
        // 演示 slider 类型：拖动写回 凯瑟琳.身体开发度（防抖 300ms）
        { type: 'slider', path: '凯瑟琳.身体开发度', label: '开发度调节', icon: '🎚️', min: 0, max: 100, step: 1, showValue: true },
        // 演示 input 类型：回车提交写回 凯瑟琳.身体状态
        { type: 'input', path: '凯瑟琳.身体状态', label: '状态记录', icon: '✍️', placeholder: '输入当前状态…', commitOn: 'enter' },
        // 演示 choice 类型：点击选项直接写变量（message 型选项会触发 AI）
        {
          type: 'choice',
          path: '凯瑟琳.沦陷阶段',
          label: '阶段推进',
          icon: '🌊',
          options: [
            { label: '纯真期', icon: '🤍', action: { mode: 'variable', path: '凯瑟琳.沦陷阶段', value: '纯真期' } },
            { label: '试探期', icon: '💛', action: { mode: 'variable', path: '凯瑟琳.沦陷阶段', value: '试探期' } },
            { label: '沉沦期', icon: '🧡', action: { mode: 'variable', path: '凯瑟琳.沦陷阶段', value: '沉沦期' } },
            { label: '堕落期', icon: '❤️', action: { mode: 'variable', path: '凯瑟琳.沦陷阶段', value: '堕落期' } },
          ],
        },
      ],
    },
    {
      id: 'xiaopang',
      label: '小胖',
      icon: '🔥',
      fields: [
        {
          type: 'progress',
          path: '小胖.欲望值',
          label: '欲望值',
          icon: '🔥',
          showValue: true,
          thresholds: [
            { min: 66, color: '#e53935' },
            { min: 33, color: '#f57c00' },
            { color: '#2e7d32' },
          ],
        },
        // 演示 number 类型：数值展示（可指定小数位）
        { type: 'number', path: '小胖.欲望值', label: '欲望数值', icon: '🔢', precision: 0 },
        { type: 'text', path: '小胖.最近行为', label: '最近行为', icon: '🎭' },
      ],
    },
  ],
};
