/**
 * 解锁条件判定（纯函数，可单测）
 */
import type { UnlockCondition } from './types';
import { getByPath } from './path';

/** 条件是否满足（data 为 stat_data；condition 省略 = 默认解锁） */
export function isUnlocked(condition: UnlockCondition | undefined, data: unknown): boolean {
  if (!condition) {
    return true;
  }
  switch (condition.type) {
    case 'threshold': {
      const value = Number(getByPath(data, condition.variable));
      if (!Number.isFinite(value)) {
        return false;
      }
      if (condition.min !== undefined && value < condition.min) {
        return false;
      }
      if (condition.max !== undefined && value > condition.max) {
        return false;
      }
      return true;
    }
    case 'equals':
      return getByPath(data, condition.variable) === condition.value;
    case 'all':
      return condition.conditions.every(c => isUnlocked(c, data));
    case 'any':
      return condition.conditions.some(c => isUnlocked(c, data));
  }
}

/** 条件的人类可读文案（锁定遮罩/图鉴提示用），如「角色.孙莹.好感度 ≥ 70」 */
export function unlockHint(condition: UnlockCondition | undefined): string {
  if (!condition) {
    return '';
  }
  switch (condition.type) {
    case 'threshold': {
      const parts: string[] = [];
      if (condition.min !== undefined) {
        parts.push(`≥ ${condition.min}`);
      }
      if (condition.max !== undefined) {
        parts.push(`≤ ${condition.max}`);
      }
      return `${condition.variable} ${parts.join(' 且 ')}`;
    }
    case 'equals':
      return `${condition.variable} = ${condition.value}`;
    case 'all':
      return condition.conditions.map(c => unlockHint(c)).join(' 且 ');
    case 'any':
      return condition.conditions.map(c => unlockHint(c)).join(' 或 ');
  }
}
