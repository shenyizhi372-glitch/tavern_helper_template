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

/**
 * 按点分路径写入值（用于交互组件写变量，写入后 defineMvuDataStore 自动双向同步）。
 * 中间层不存在时自动创建对象；target 不可写时返回 false。
 */
export function setByPath(target: unknown, path: string, value: unknown): boolean {
  if (target === null || target === undefined || typeof target !== 'object') {
    return false;
  }
  const keys = path.split('.').filter(key => key !== '');
  if (keys.length === 0) {
    return false;
  }
  let current = target as Record<string, unknown>;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (current[key] === null || current[key] === undefined || typeof current[key] !== 'object') {
      current[key] = {};
    }
    current = current[key] as Record<string, unknown>;
  }
  current[keys[keys.length - 1]] = value;
  return true;
}
