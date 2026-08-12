import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resolveImageSource } from '../image';

test('static 来源直接返回固定 URL', () => {
  assert.equal(resolveImageSource({ type: 'static', url: 'https://x/y.png' }, {}), 'https://x/y.png');
});

test('fromVariable 从数据按路径读取 URL', () => {
  const data = { 系统: { 场景图: 'https://x/scene.png' } };
  assert.equal(resolveImageSource({ type: 'fromVariable', path: '系统.场景图' }, data), 'https://x/scene.png');
  // 空值/非字符串 → null
  assert.equal(resolveImageSource({ type: 'fromVariable', path: '系统.缺失' }, data), null);
  assert.equal(resolveImageSource({ type: 'fromVariable', path: '系统.场景图' }, { 系统: { 场景图: '' } }), null);
});

test('mapped 按变量值查表映射', () => {
  const data = { 系统: { 当前地点: '厨房' } };
  const source = {
    type: 'mapped' as const,
    by: '系统.当前地点',
    map: { 厨房: 'https://x/kitchen.png', 卧室: 'https://x/bedroom.png' },
  };
  assert.equal(resolveImageSource(source, data), 'https://x/kitchen.png');
  // 查不到 → null
  assert.equal(resolveImageSource(source, { 系统: { 当前地点: '天台' } }), null);
  // by 指向的值不是字符串 → null
  assert.equal(resolveImageSource(source, { 系统: { 当前地点: 42 } }), null);
  assert.equal(resolveImageSource(source, { 系统: {} }), null);
});

test('resolveImageSource 不抛错（数据为 null/undefined）', () => {
  const mapped = { type: 'mapped' as const, by: 'a.b', map: { k: 'u' } };
  const fromVar = { type: 'fromVariable' as const, path: 'a.b' };
  assert.equal(resolveImageSource(mapped, null), null);
  assert.equal(resolveImageSource(fromVar, undefined), null);
});
