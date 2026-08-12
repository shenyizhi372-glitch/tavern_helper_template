/**
 * Status_block 文本解析器（纯函数，无外部依赖，可单测）
 *
 * 解析「扮演准则/状态栏」条目规定的穿花蝶传式纯文本格式：
 *
 *   『📅 日期：5月12日 星期二 | ⏰ 时间：傍晚六点 | 📍 位置：家·厨房』
 *   <details><summary>[角色状态]</summary>
 *   - 👩 孙莹的状态
 *     - 🧑‍💼 当前行动：…
 *     - 👗 当前穿搭：…
 *   - 👨 <user>（张宝）的状态
 *     - 🧑‍💼 当前行动：…
 *   </details>
 *   『剧情发展』 1.[正常]… 2.[色情]… 3.[淫秽]… 4.[其他]…
 *
 * 字段行 = "- " 开头且含「：」；区块行 = "- " 开头且以「的状态」结尾；
 * 剧情发展 = 『剧情发展』 之后按 `数字.[类型]` 切分。
 */

export interface StatusField {
  /** 字段图标（如 🧑‍💼），AI 未输出时为空串 */
  emoji: string;
  /** 字段名（如 当前行动） */
  label: string;
  /** 字段值 */
  value: string;
}

export interface CharBlock {
  /** 角色图标（如 👩 / 👨） */
  emoji: string;
  /** 展示名（孙莹 / 张宝） */
  name: string;
  /** 是否 <user> 扮演的角色（张宝） */
  isUser: boolean;
  /** 状态字段列表 */
  fields: StatusField[];
}

export interface PlotOption {
  index: number;
  /** 类型（正常/色情/淫秽/其他） */
  type: string;
  text: string;
}

export interface StatusBlockData {
  date: string;
  time: string;
  place: string;
  chars: CharBlock[];
  plotOptions: PlotOption[];
  /** 原始文本（调试用） */
  raw: string;
}

/** 匹配 emoji 及其组合序列（含 ZWJ 连接与修饰符），后跟可选空格 */
const EMOJI_RE = /^(\p{Extended_Pictographic}(?:\u200D\p{Extended_Pictographic}|\p{Emoji_Modifier}|\uFE0F)*)\s*(.*)$/u;

function parseHead(head: string): { emoji: string; label: string } {
  const m = head.match(EMOJI_RE);
  if (m?.[1]) {
    return { emoji: m[1], label: m[2].trim() };
  }
  return { emoji: '', label: head.trim() };
}

/** 展示名清洗：`<user>（张宝）` → `张宝`；`孙莹` → `孙莹` */
function cleanName(rawName: string): string {
  return rawName.replace(/<user>/g, '').replace(/[（(]/g, '').replace(/[）)]/g, '').trim() || rawName.trim();
}

export function parseStatusBlock(raw: string): StatusBlockData {
  const data: StatusBlockData = { date: '', time: '', place: '', chars: [], plotOptions: [], raw };

  // 全局行：『📅 日期：… | ⏰ 时间：… | 📍 位置：…』
  const globalM = raw.match(/『([^』]+)』/);
  if (globalM) {
    for (const seg of globalM[1].split('|')) {
      const s = seg.trim();
      const colon = s.indexOf('：');
      const value = colon >= 0 ? s.slice(colon + 1).trim() : s;
      if (s.startsWith('📅')) data.date = value;
      else if (s.startsWith('⏰')) data.time = value;
      else if (s.startsWith('📍')) data.place = value;
    }
  }

  // 角色块与字段行（跳过空行、<details> 标签行、全局行、剧情发展行）
  let current: CharBlock | null = null;
  for (const rawLine of raw.split('\n')) {
    const line = rawLine.trim();
    if (!line || line.startsWith('<') || line.startsWith('『') || /^\d+\.\[/.test(line)) continue;

    const rest = line.replace(/^-\s*/, '');
    if (rest === line) continue; // 不以 "- " 开头，跳过（容错）

    const colon = rest.indexOf('：');
    if (colon >= 0) {
      // 字段行：- 🧑‍💼 当前行动：…
      const { emoji, label } = parseHead(rest.slice(0, colon));
      const value = rest.slice(colon + 1).trim();
      if (!current) {
        // 字段出现在任何角色块之前（格式异常），丢弃
        continue;
      }
      current.fields.push({ emoji, label, value });
      continue;
    }

    if (rest.endsWith('的状态')) {
      // 区块行：- 👩 孙莹的状态
      const { emoji, label } = parseHead(rest.slice(0, -'的状态'.length));
      current = { emoji, name: cleanName(label), isUser: label.includes('<user>'), fields: [] };
      data.chars.push(current);
    }
  }

  // 剧情发展：『剧情发展』 之后按 `数字.[类型]` 切分（单行或跨行均可）
  const plotIdx = raw.lastIndexOf('剧情发展');
  if (plotIdx >= 0) {
    const rest = raw.slice(plotIdx + '剧情发展'.length);
    for (const part of rest.split(/(?=\d+\.\[)/)) {
      const m = part.trim().match(/^(\d+)\.\[([^\]]+)\]([\s\S]*)$/);
      if (m) {
        data.plotOptions.push({ index: Number(m[1]), type: m[2].trim(), text: m[3].trim() });
      }
    }
  }

  return data;
}
