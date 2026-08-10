/**
 * 配置校验与规范化（纯函数，可单测）
 *
 * TS 接入时直接写类型化配置即可；从 JSON/YAML 加载配置时，
 * 用 parseStatusBarConfig 校验并填充默认值。
 */
import { z } from 'zod';
import type { FieldConfig, SectionConfig, StatusBarConfig } from './types';

const enumStyleSchema = z.object({
  label: z.string().optional(),
  color: z.string().optional(),
  icon: z.string().optional(),
});

const fieldBaseSchema = {
  path: z.string().min(1, 'field.path 不能为空'),
  label: z.string().min(1, 'field.label 不能为空'),
  icon: z.string().optional(),
  fallback: z.string().optional(),
};

const fieldSchema = z.discriminatedUnion('type', [
  z.object({ ...fieldBaseSchema, type: z.literal('text') }),
  z.object({
    ...fieldBaseSchema,
    type: z.literal('number'),
    precision: z.number().int().nonnegative().optional(),
  }),
  z.object({
    ...fieldBaseSchema,
    type: z.literal('progress'),
    min: z.number().optional(),
    max: z.number().optional(),
    showValue: z.boolean().optional(),
    thresholds: z.array(z.object({ min: z.number().optional(), color: z.string().min(1) })).optional(),
  }),
  z.object({ ...fieldBaseSchema, type: z.literal('enum'), mapping: z.record(z.string(), enumStyleSchema) }),
  z.object({ ...fieldBaseSchema, type: z.literal('stars'), max: z.number().positive().optional() }),
]);

const sectionSchema = z.object({
  id: z.string().min(1, 'section.id 不能为空'),
  label: z.string().min(1, 'section.label 不能为空'),
  icon: z.string().optional(),
  collapsible: z.boolean().optional(),
  defaultCollapsed: z.boolean().optional(),
  fields: z.array(fieldSchema).min(1, 'section.fields 至少需要一个字段'),
});

const configSchema = z.object({
  title: z.string().optional(),
  sections: z.array(sectionSchema).min(1, 'sections 至少需要一个区块'),
});

/**
 * 校验外部配置（JSON/YAML 等运行时来源），失败时抛出带路径的 zod 错误。
 * 校验通过后自动填充默认值。
 */
export function parseStatusBarConfig(input: unknown): StatusBarConfig {
  return normalizeStatusBarConfig(configSchema.parse(input) as unknown as StatusBarConfig);
}

/** 填充字段/区块默认值（fallback、collapsible、defaultCollapsed） */
export function normalizeStatusBarConfig(config: StatusBarConfig): StatusBarConfig {
  return {
    ...config,
    sections: config.sections.map((section: SectionConfig) => ({
      ...section,
      collapsible: section.collapsible ?? true,
      defaultCollapsed: section.defaultCollapsed ?? false,
      fields: section.fields.map((field: FieldConfig) => ({
        ...field,
        fallback: field.fallback ?? '—',
      })),
    })),
  };
}
