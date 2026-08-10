export const Schema = z.object({
  系统: z.object({
    当前日期: z.string().prefault(''),
    时段: z.string().prefault(''),
    当前地点: z.string().prefault(''),
    当前视角: z.enum(['丈夫', '小胖']).prefault('丈夫'),
    小胖来访状态: z.string().prefault(''),
  }),
  凯瑟琳: z.object({
    沦陷阶段: z.enum(['纯真期', '试探期', '沉沦期', '堕落期']).prefault('纯真期'),
    身体开发度: z.coerce.number().prefault(0),
    身体状态: z.string().prefault(''),
    最近事件: z.string().prefault(''),
  }),
  小胖: z.object({
    欲望值: z.coerce.number().prefault(30),
    最近行为: z.string().prefault(''),
  }),
});
export type Schema = z.output<typeof Schema>;
