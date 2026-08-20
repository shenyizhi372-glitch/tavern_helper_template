export const Schema = z.object({
  世界: z.object({
    当前日期: z.string().prefault('2026/08/15'),
    当前时间段: z.enum(['清晨', '上午', '中午', '下午', '傍晚', '夜晚', '深夜']).prefault('夜晚'),
    当前场景: z.string().prefault('情趣酒店-大床房'),
    剧情阶段: z.enum(['第一阶', '二进阶', '三阶背堕', '结局后']).prefault('第一阶'),
    最近事件: z.string().prefault('<user>以灵石为报酬与鱼鱼（吕小鱼）达成调教交易，兔女郎直播正在进行；吕树仍被蒙在鼓里'),
  }).prefault({}),
  吕小鱼: z.object({
    堕落度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(15),
    任务进度: z.enum(['第一阶', '二进阶', '三阶背堕', '全部完成']).prefault('第一阶'),
    胸部状况: z.string().prefault('贫乳幼乳被兔女郎连体衣勒出轮廓，乳尖被黄瓜汁抹得亮晶晶'),
    私处状况: z.string().prefault('粉嫩幼穴紧致闭合，被黄瓜插过后微微红肿，还挂着淫水'),
    衣物状况: z.string().prefault('兔女郎连体衣，配兔耳与兔尾，内里没穿内裤'),
    调教要求: z.string().prefault('第一阶清单·兔女郎直播：穿兔女郎服配合直播，五枚灵石报酬；下一步小院破处，开价五百颗灵石'),
    内心话: z.string().prefault('黑大叔这个冤大头……灵石到手就行，不过那根大东西……好像也不是不能忍'),
  }).prefault({}),
  吕树: z.object({
    察觉度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(5),
    负面情绪值: z.coerce.number().transform(v => Math.max(v, 0)).prefault(5000),
  }).prefault({}),
  卡洛儿: z.object({
    驯化度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
    内心话: z.string().prefault('梦里那个中国男孩……到底在哪里，我一定要找到他'),
  }).prefault({}),
  姜束衣: z.object({
    雌堕度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
    内心话: z.string().prefault('今天也要守着师傅与师公，绝不能让人发现我的真实身份'),
  }).prefault({}),
  曹青辞: z.object({
    接触度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
  }).prefault({}),
  user: z.object({
    灵石: z.coerce.number().transform(v => Math.max(v, 0)).prefault(1000),
    当前任务: z.string().prefault('第一阶清单：兔女郎直播进行中；下一步安排小院破处（五百颗灵石）'),
  }).prefault({}),
});
export type Schema = z.output<typeof Schema>;
