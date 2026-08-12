import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { UnlockCondition } from '../types';
import { isUnlocked, unlockHint } from '../unlock';

const data = {
  角色: { 孙莹: { 好感度: 75 } },
  剧情: { 阶段: '沉沦' },
};

test('无条件 = 默认解锁', () => {
  assert.equal(isUnlocked(undefined, data), true);
});

test('threshold：min 达标解锁', () => {
  const cond: UnlockCondition = { type: 'threshold', variable: '角色.孙莹.好感度', min: 70 };
  assert.equal(isUnlocked(cond, data), true);
  assert.equal(isUnlocked({ type: 'threshold', variable: '角色.孙莹.好感度', min: 80 }, data), false);
});

test('threshold：max 上限与区间', () => {
  assert.equal(isUnlocked({ type: 'threshold', variable: '角色.孙莹.好感度', max: 80 }, data), true);
  assert.equal(isUnlocked({ type: 'threshold', variable: '角色.孙莹.好感度', max: 70 }, data), false);
  assert.equal(isUnlocked({ type: 'threshold', variable: '角色.孙莹.好感度', min: 70, max: 80 }, data), true);
  assert.equal(isUnlocked({ type: 'threshold', variable: '角色.孙莹.好感度', min: 76, max: 80 }, data), false);
});

test('threshold：变量缺失/非数字视为未解锁', () => {
  assert.equal(isUnlocked({ type: 'threshold', variable: '角色.不存在.值', min: 1 }, data), false);
  assert.equal(isUnlocked({ type: 'threshold', variable: '剧情.阶段', min: 1 }, data), false);
});

test('equals：等值判定', () => {
  assert.equal(isUnlocked({ type: 'equals', variable: '剧情.阶段', value: '沉沦' }, data), true);
  assert.equal(isUnlocked({ type: 'equals', variable: '剧情.阶段', value: '纯真' }, data), false);
});

test('all：全部满足', () => {
  const cond: UnlockCondition = {
    type: 'all',
    conditions: [
      { type: 'threshold', variable: '角色.孙莹.好感度', min: 70 },
      { type: 'equals', variable: '剧情.阶段', value: '沉沦' },
    ],
  };
  assert.equal(isUnlocked(cond, data), true);
  assert.equal(
    isUnlocked(
      {
        type: 'all',
        conditions: [
          { type: 'threshold', variable: '角色.孙莹.好感度', min: 90 },
          { type: 'equals', variable: '剧情.阶段', value: '沉沦' },
        ],
      },
      data,
    ),
    false,
  );
});

test('any：任一满足', () => {
  const cond: UnlockCondition = {
    type: 'any',
    conditions: [
      { type: 'threshold', variable: '角色.孙莹.好感度', min: 90 },
      { type: 'equals', variable: '剧情.阶段', value: '沉沦' },
    ],
  };
  assert.equal(isUnlocked(cond, data), true);
});

test('unlockHint 生成可读文案', () => {
  assert.equal(unlockHint({ type: 'threshold', variable: '好感度', min: 70 }), '好感度 ≥ 70');
  assert.equal(unlockHint({ type: 'threshold', variable: '好感度', min: 70, max: 90 }), '好感度 ≥ 70 且 ≤ 90');
  assert.equal(unlockHint({ type: 'equals', variable: '阶段', value: '沉沦' }), '阶段 = 沉沦');
  assert.equal(unlockHint(undefined), '');
});
