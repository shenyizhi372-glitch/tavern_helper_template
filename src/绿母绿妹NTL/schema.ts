export const Schema = z.object({
  世界: z.object({
    当前日期: z.string().prefault('2026/08/11'),
    当前时间段: z.string().prefault('上午'),
    当前场景: z.string().prefault('林家-客厅'),
    剧情阶段: z.enum(['初始', '妹妹契约期', '母亲契约期', '母女沦陷期']).prefault('初始'),
    最近事件: z.string().prefault('<user>注意到林家母女，开始布局'),
  }).prefault({}),
  林小蛮: z.object({
    好感度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
    堕落度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
    胸部状况: z.string().prefault('贫乳平坦，乳尖被衣料摩擦得微微挺立，颜色泛粉'),
    私处状况: z.string().prefault('白虎肥穴紧致闭合，两片粉嫩厚唇贴在一起，被紧身裤勒出骆驼趾的轮廓，爱液微微渗出润湿了裤缝'),
    脸部状况: z.string().prefault('童颜泛着粉红，虎牙咬着下唇，眼神躲闪却忍不住偷瞄'),
    白袜状况: z.string().prefault('纯白袜筒干净，脚趾在鞋里蜷起又松开'),
    内心话: z.string().prefault('什么偶像培训……不就是让我穿这种裤子给他们看吗，可哥哥让我坚持，我总不能让他失望'),
  }).prefault({}),
  林凤仪: z.object({
    好感度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
    堕落度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
    胸部状况: z.string().prefault('木瓜巨乳沉甸甸地坠着，乳尖在布料下悄然挺立，乳晕颜色深红'),
    私处状况: z.string().prefault('黑阴毛茂盛下肥厚的阴唇充血微肿，蜜缝湿润，稍一挤压就渗出黏腻的爱液'),
    脸部状况: z.string().prefault('凤目微眯，眉间蹙起，潮红从耳根蔓延到脖颈'),
    内心话: z.string().prefault('这个年轻人……我守寡这些年，怎会因为他一句话就……不行，莫要再想'),
  }).prefault({}),
});
export type Schema = z.output<typeof Schema>;
