/**
 * 图片来源解析（纯函数，可单测）
 */
import type { ImageSource } from './types';
import { getByPath } from './path';

/**
 * 把 ImageSource 解析为最终图片 URL（或 null）。
 * - static：直接返回固定 URL
 * - fromVariable：从 data 按路径读取 URL 字符串
 * - mapped：从 data 按 by 读取键名，再查 map 表；查不到返回 null
 */
export function resolveImageSource(source: ImageSource, data: unknown): string | null {
  switch (source.type) {
    case 'static':
      return source.url;
    case 'fromVariable': {
      const value = getByPath(data, source.path);
      return typeof value === 'string' && value !== '' ? value : null;
    }
    case 'mapped': {
      const key = getByPath(data, source.by);
      if (typeof key !== 'string') {
        return null;
      }
      return source.map[key] ?? null;
    }
  }
}
