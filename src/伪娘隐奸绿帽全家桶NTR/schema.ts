export const Schema = z.object({
  世界: z.object({
    当前时间: z.string(),
    当前场景: z.string(),
    沐昕察觉度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(10),
  }),
  user: z.object({
    攻略阶段: z.enum(['潜伏渗透', '当面攻略', '全面掌控']),
    已攻略对象: z.array(z.string()),
  }),
  白雅琴: z.object({
    堕落度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
    调教进度: z.string(),
    最近性行为: z.string(),
  }),
  沐嫣染: z.object({
    堕落度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
    调教进度: z.string(),
    最近性行为: z.string(),
  }),
  沐冰铃: z.object({
    堕落度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
    调教进度: z.string(),
    最近性行为: z.string(),
  }),
  白雅婷: z.object({
    堕落度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
    调教进度: z.string(),
    最近性行为: z.string(),
  }),
  阮软: z.object({
    堕落度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
    调教进度: z.string(),
    最近性行为: z.string(),
  }),
  秦韵: z.object({
    堕落度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
    调教进度: z.string(),
    最近性行为: z.string(),
  }),
  萝莉团: z.object({
    堕落度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
    调教进度: z.string(),
    最近性行为: z.string(),
  }),
});
export type Schema = z.output<typeof Schema>;
