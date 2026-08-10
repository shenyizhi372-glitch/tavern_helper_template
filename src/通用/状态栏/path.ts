/**
 * 点分路径工具（纯函数，可单测）
 */

/**
 * 按点分路径从对象取值，如 getByPath(data, '系统.当前视角')。
 * 任意一层缺失都返回 undefined，不抛错。
 */
export function getByPath(data: unknown, path: string): unknown {
  if (path === '') {
    return data;
  }
  let current: unknown = data;
  for (const key of path.split('.')) {
    if (key === '') {
      continue;
    }
    if (current === null || current === undefined || typeof current !== 'object') {
      return undefined;
    }
    current = (current as Record<string, unknown>)[key];
  }
  return current;
}

/** 是否视为「空值」：undefined / null / 空字符串 */
export function isEmptyValue(value: unknown): boolean {
  return value === undefined || value === null || value === '';
}
