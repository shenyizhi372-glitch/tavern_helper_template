export const Schema = z.object({
  系统: z.object({
    当前剧情阶段: z.enum(['起·相遇', '承·破冰', '转·扩张', '合·验收']).prefault('起·相遇'),
    当前地点: z.string().prefault('王道异能学院'),
    最近事件: z.string().prefault('学院发布「研究异能黑暗森林里的魔兽人」委托，叶冰璃接下委托，独自深入森林'),
  }).prefault({}),
  叶冰璃: z.object({
    调教进度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
    胸部状况: z.string().prefault('匀称贫乳被蓝白裙衣襟轻轻遮住，乳尖平静'),
    私处状况: z.string().prefault('无毛肥穴闭合，尚未被开发'),
    淫纹状况: z.string().prefault('小腹光洁，还没有淫纹'),
    脸部状况: z.string().prefault('面无表情，湛蓝美眸空洞'),
    吊带袜状况: z.string().prefault('白色吊带袜干净整洁，勒着大腿根部雪白肉肉'),
    内心话: z.string().prefault('学院委托……尽快完成，不想在森林里多待'),
  }).prefault({}),
  叶理: z.object({
    怀疑度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
  }).prefault({}),
  支线: z.object({
    苏沐雪: z.object({
      攻略进度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
    }).prefault({}),
    白汐: z.object({
      攻略进度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
    }).prefault({}),
    炎绯: z.object({
      攻略进度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
    }).prefault({}),
    林晚晴: z.object({
      攻略进度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
    }).prefault({}),
  }).prefault({}),
});
export type Schema = z.output<typeof Schema>;
