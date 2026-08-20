/**
 * 配置校验与规范化（纯函数，可单测）
 *
 * TS 接入时直接写类型化配置即可；从 JSON/YAML 加载配置时，
 * 用 parseStatusBarConfig 校验并填充默认值。
 */
import { z } from 'zod';
import type { FieldConfig, SectionConfig, StatusBarConfig, UnlockCondition } from './types';

const enumStyleSchema = z.object({
  label: z.string().optional(),
  color: z.string().optional(),
  icon: z.string().optional(),
});

const imageSourceSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('static'), url: z.string().min(1, 'static 图片 url 不能为空') }),
  z.object({ type: z.literal('mapped'), by: z.string().min(1), map: z.record(z.string(), z.string().min(1)) }),
  z.object({ type: z.literal('fromVariable'), path: z.string().min(1) }),
]);

const imageStyleFields = {
  source: imageSourceSchema,
  fit: z.enum(['contain', 'cover', 'fill']).optional(),
  ratio: z.string().optional(),
  placeholder: z.string().optional(),
};
const imageStyleSchema = z.object(imageStyleFields);

const variableActionSchema = z.object({
  mode: z.literal('variable'),
  path: z.string().min(1, 'variable 行为 path 不能为空'),
  delta: z.number().optional(),
  value: z.union([z.string(), z.number(), z.boolean()]).optional(),
  toast: z.string().optional(),
});

const messageActionSchema = z.object({
  mode: z.literal('message'),
  content: z.string().min(1, 'message 行为 content 不能为空'),
  slash: z.string().optional(),
  toast: z.string().optional(),
});

const fieldActionSchema = z.discriminatedUnion('mode', [variableActionSchema, messageActionSchema]);

const choiceOptionSchema = z.object({
  label: z.string().min(1, '选项 label 不能为空'),
  icon: z.string().optional(),
  action: fieldActionSchema,
});

const fieldLockSchema = z.object({
  key: z.string().min(1, '锁密钥不能为空'),
  hint: z.string().optional(),
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
  z.object({ ...fieldBaseSchema, type: z.literal('image'), ...imageStyleFields }),
  z.object({ ...fieldBaseSchema, type: z.literal('action'), action: fieldActionSchema, lock: fieldLockSchema.optional() }),
  z.object({
    ...fieldBaseSchema,
    type: z.literal('choice'),
    options: z.array(choiceOptionSchema).min(1, 'choice 至少需要一个选项'),
    lockAfterPick: z.boolean().optional(),
    lock: fieldLockSchema.optional(),
  }),
  z.object({
    ...fieldBaseSchema,
    type: z.literal('slider'),
    path: z.string().min(1, 'slider path 不能为空'),
    min: z.number().optional(),
    max: z.number().optional(),
    step: z.number().positive().optional(),
    showValue: z.boolean().optional(),
    debounce: z.number().nonnegative().optional(),
    lock: fieldLockSchema.optional(),
  }),
  z.object({
    ...fieldBaseSchema,
    type: z.literal('input'),
    path: z.string().min(1, 'input path 不能为空'),
    placeholder: z.string().optional(),
    commitOn: z.enum(['enter', 'blur', 'live']).optional(),
    maxLength: z.number().nonnegative().optional(),
    lock: fieldLockSchema.optional(),
  }),
]);

const panelImageSchema = z.object({
  id: z.string().min(1, '图片 id 不能为空'),
  position: z.enum(['top', 'background']),
  ...imageStyleFields,
});

/* ===== 图鉴 / 设置 / 字段锁 ===== */

const unlockConditionSchema: z.ZodType<UnlockCondition> = z.lazy(() =>
  z.discriminatedUnion('type', [
    z.object({
      type: z.literal('threshold'),
      variable: z.string().min(1),
      min: z.number().optional(),
      max: z.number().optional(),
    }),
    z.object({
      type: z.literal('equals'),
      variable: z.string().min(1),
      value: z.union([z.string(), z.number(), z.boolean()]),
    }),
    z.object({ type: z.literal('all'), conditions: z.array(unlockConditionSchema).min(1) }),
    z.object({ type: z.literal('any'), conditions: z.array(unlockConditionSchema).min(1) }),
  ]),
);

const stageImageSchema = z.object({
  id: z.string().min(1, '图片 id 不能为空'),
  label: z.string().min(1, '阶段名不能为空'),
  url: z.string().min(1, '图片 url 不能为空'),
  unlock: unlockConditionSchema.optional(),
  key: z.string().optional(),
});

const characterGallerySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  icon: z.string().optional(),
  images: z.array(stageImageSchema).min(1),
});

const gallerySchema = z.object({
  characters: z.array(characterGallerySchema).min(1),
  masterKey: z.string().optional(),
});

const themePresetSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  theme: z.record(z.string(), z.unknown()).optional(), // ThemeOverride 结构宽松校验
});

const settingsSchema = z.object({
  themePresets: z.array(themePresetSchema).optional(),
});

const sectionSchema = z.object({
  id: z.string().min(1, 'section.id 不能为空'),
  label: z.string().min(1, 'section.label 不能为空'),
  icon: z.string().optional(),
  role: z.string().optional(),
  collapsible: z.boolean().optional(),
  defaultCollapsed: z.boolean().optional(),
  image: imageStyleSchema.optional(),
  fields: z.array(fieldSchema).min(1, 'section.fields 至少需要一个字段'),
});

const roleTabSchema = z.object({
  id: z.string().min(1, 'role.id 不能为空'),
  icon: z.string().optional(),
  name: z.string().optional(),
});

const configSchema = z.object({
  title: z.string().optional(),
  roles: z.array(roleTabSchema).optional(),
  images: z.array(panelImageSchema).optional(),
  gallery: gallerySchema.optional(),
  settings: settingsSchema.optional(),
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
