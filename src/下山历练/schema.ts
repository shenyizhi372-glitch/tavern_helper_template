export const Schema = z.object({
  系统: z.object({
    当前日期: z.string().prefault('2026/08/15'),
    当前时间段: z.enum(['清晨', '上午', '中午', '下午', '傍晚', '夜晚', '深夜']).prefault('下午'),
    当前场景: z.string().prefault('都市-街头'),
    最近事件: z.string().prefault('<user>在街头算命摊前设局，与二娘搭上话'),
    结局分支: z.enum(['进行中', '彻底征服', '单线收束']).prefault('进行中'),
  }).prefault({}),
  user: z.object({
    当前目标: z.string().prefault('与二娘周旋，把玉佩赔偿的局做下去'),
    已攻略对象: z.string().prefault('无'),
  }).prefault({}),
  二娘: z.object({
    攻略阶段: z.coerce.number().transform(v => _.clamp(v, 1, 5)).prefault(1),
    沦陷度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
    胸部状况: z.string().prefault('白色背心下雪白爆乳撑得绷紧，乳头顶着布料鼓起，真空无内衣'),
    私处状况: z.string().prefault('包臀裙下真空，阴毛茂盛的熟女蜜穴，走路时臀肉晃动'),
    表情状况: z.string().prefault('眼角美人痣随挑眉跳动，嘴上带着大大咧咧的笑，眼神里全是好奇'),
    内心话: z.string().prefault('这公子哥出手倒是阔气，那玉佩可真值钱？我倒要看看他葫芦里卖的什么药'),
  }).prefault({}),
  三娘: z.object({
    攻略阶段: z.coerce.number().transform(v => _.clamp(v, 1, 5)).prefault(1),
    沦陷度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
    胸部状况: z.string().prefault('白色道袍下巨乳鼓胀，衣襟被撑开一线'),
    私处状况: z.string().prefault('超短裙下白袜肉足并拢，阴毛茂盛藏在裙底'),
    表情状况: z.string().prefault('双马尾一甩，小虎牙露着，笑嘻嘻打量来人，眼里全是玩心'),
    内心话: z.string().prefault('二娘说得神神秘秘的，我倒要看看这"有趣的修士"有多有趣'),
  }).prefault({}),
  大娘: z.object({
    攻略阶段: z.coerce.number().transform(v => _.clamp(v, 1, 5)).prefault(1),
    沦陷度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
    胸部状况: z.string().prefault('纯白道袍下爆乳沉甸甸地坠着，红肚兜勒出轮廓'),
    私处状况: z.string().prefault('红肚兜亵裤层层包裹，守了几百年的蜜谷藏在最里层'),
    表情状况: z.string().prefault('凤眉微蹙，目光冷冽，端坐主位不动如山'),
    内心话: z.string().prefault('故人之后登门……礼数倒是周全，只是那双眼睛，总让为娘觉得不踏实'),
  }).prefault({}),
});
export type Schema = z.output<typeof Schema>;
