/**
 * 颜色工具（纯函数，可单测）
 */

/** 把 #rgb / #rrggbb 解析为 [r, g, b]（0-255），解析失败返回 null */
export function parseHexColor(color: string): [number, number, number] | null {
  const hex = color.trim().replace(/^#/, '');
  if (/^[0-9a-fA-F]{3}$/.test(hex)) {
    const [r, g, b] = hex.split('').map(c => parseInt(c + c, 16));
    return [r, g, b];
  }
  if (/^[0-9a-fA-F]{6}$/.test(hex)) {
    return [parseInt(hex.slice(0, 2), 16), parseInt(hex.slice(2, 4), 16), parseInt(hex.slice(4, 6), 16)];
  }
  return null;
}

/** 相对亮度（WCAG），0（黑）~ 1（白） */
export function relativeLuminance(rgb: [number, number, number]): number {
  const linearize = (channel: number) => {
    const c = channel / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * linearize(rgb[0]) + 0.7152 * linearize(rgb[1]) + 0.0722 * linearize(rgb[2]);
}

/**
 * 根据背景色自动选择可读的文字颜色（#ffffff / #1a1a1a）。
 * 背景不是合法十六进制色时返回白色。
 */
export function readableTextColor(background: string): string {
  const rgb = parseHexColor(background);
  if (!rgb) {
    return '#ffffff';
  }
  return relativeLuminance(rgb) > 0.45 ? '#1a1a1a' : '#ffffff';
}
