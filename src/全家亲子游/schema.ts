/**
 * 全家亲子游 - MVU 变量结构
 *
 * 迁移自纯文本 <Status_block> 驱动的旧版：
 * - 系统：日期/时间/地点（原全局行）
 * - 角色：动态键 Record（原角色块；孙莹/张宝等，可增删）
 * - 剧情：当前事件 + 可选发展（原剧情发展选项，AI 每轮写入，前端渲染为可点击选项）
 *
 * 注意：schema 与 世界书/initvar.yaml、脚本/变量结构 保持一致；
 * `_` 开头的字段为只读（AI 不更新，见变量更新规则）。
 */
import { z } from 'zod';

export const Schema = z.object({
  系统: z.object({
    日期: z.string().prefault(''),
    时间: z.string().prefault(''),
    地点: z.string().prefault('家·客厅'),
  }),
  角色: z.record(
    z.string(),
    z.object({
      表情: z.string().prefault('👤'),
      // 以下为只读字段（_ 开头，AI 不更新）
      _用户: z.boolean().prefault(false),
      // 展示字段
      穿着: z.string().prefault(''),
      神态: z.string().prefault(''),
      心情: z.string().prefault(''),
      当前行动: z.string().prefault(''),
      // 身体状态字段（全家亲子游孙莹状态栏，AI 每轮更新）
      胸部状况: z.string().prefault(''),
      私处状况: z.string().prefault(''),
      脸部状况: z.string().prefault(''),
      最近性行为: z.string().prefault(''),
      // 交互字段（前端可调，AI 按 check 规则更新）
      好感度: z.coerce.number().prefault(50),
    }),
  ),
  剧情: z.object({
    当前事件: z.string().prefault(''),
    可选发展: z
      .array(
        z.object({
          type: z.string().prefault('正常'),
          text: z.string().prefault(''),
        }),
      )
      .prefault([]),
  }),
});

export type Schema = z.output<typeof Schema>;
