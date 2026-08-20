export const Schema = z.object({
  系统: z.object({
    当前时间: z.string().prefault('中兴三年 秋 申时'),
    当前地点: z.string().prefault('蛮帅府'),
    当前场景: z.string().prefault('大堂'),
    当前对象: z.enum(['洛雪莹', '叶可儿', '叶甜儿', '叶雯儿', '叶芊儿', '多女']).prefault('洛雪莹'),
  }).prefault({}),
  洛雪莹: z.object({
    调教阶段: z.enum(['抗拒', '动摇', '沉沦', '依恋']).prefault('抗拒'),
    顺从度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
    依恋度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
  }).prefault({}),
  叶可儿: z.object({
    调教阶段: z.enum(['抗拒', '动摇', '沉沦', '依恋']).prefault('抗拒'),
    顺从度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
    依恋度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
  }).prefault({}),
  叶甜儿: z.object({
    调教阶段: z.enum(['抗拒', '动摇', '沉沦', '依恋']).prefault('抗拒'),
    顺从度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
    依恋度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
  }).prefault({}),
  叶雯儿: z.object({
    调教阶段: z.enum(['抗拒', '动摇', '沉沦', '依恋']).prefault('抗拒'),
    顺从度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
    依恋度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
  }).prefault({}),
  叶芊儿: z.object({
    调教阶段: z.enum(['抗拒', '动摇', '沉沦', '依恋']).prefault('动摇'),
    顺从度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
    依恋度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
  }).prefault({}),
});
export type Schema = z.output<typeof Schema>;
