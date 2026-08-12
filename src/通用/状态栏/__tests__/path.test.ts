import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getByPath, isEmptyValue, setByPath } from '../path';

test('getByPath 读取嵌套路径', () => {
  const data = { 系统: { 当前视角: '丈夫', 地点: { 名称: '家' } } };
  assert.equal(getByPath(data, '系统.当前视角'), '丈夫');
  assert.equal(getByPath(data, '系统.地点.名称'), '家');
});

test('getByPath 缺失路径返回 undefined 不抛错', () => {
  const data = { 系统: { 当前视角: '丈夫' } };
  assert.equal(getByPath(data, '系统.不存在'), undefined);
  assert.equal(getByPath(data, '不存在.键'), undefined);
  assert.equal(getByPath(data, '系统.当前视角.再往下'), undefined);
  assert.equal(getByPath(data, '系统.当前视角'), '丈夫');
});

test('getByPath 空路径返回原对象', () => {
  const data = { a: 1 };
  assert.equal(getByPath(data, ''), data);
});

test('getByPath 容忍空段与 null 中间层', () => {
  const data = { a: { b: 1 }, n: null };
  assert.equal(getByPath(data, 'a..b'), 1);
  assert.equal(getByPath(data, 'n.深层'), undefined);
});

test('isEmptyValue 只把 undefined/null/空串视为空', () => {
  assert.equal(isEmptyValue(undefined), true);
  assert.equal(isEmptyValue(null), true);
  assert.equal(isEmptyValue(''), true);
  assert.equal(isEmptyValue(0), false);
  assert.equal(isEmptyValue('0'), false);
  assert.equal(isEmptyValue(false), false);
});

test('setByPath 写入嵌套路径并自动创建中间层', () => {
  const data: Record<string, unknown> = { 系统: { 当前地点: '家' } };
  assert.equal(setByPath(data, '孙莹.好感度', 60), true);
  assert.deepEqual(data, { 系统: { 当前地点: '家' }, 孙莹: { 好感度: 60 } });
  // 覆盖已有值
  setByPath(data, '系统.当前地点', '厨房');
  assert.equal((data.系统 as Record<string, unknown>).当前地点, '厨房');
  // 深层自动创建（deepEqual 有类型守卫，先转回 Record 再访问）
  setByPath(data, 'a.b.c.d', 1);
  const raw = data as unknown as Record<string, unknown>;
  const a = raw.a as Record<string, unknown>;
  const b = a.b as Record<string, unknown>;
  const c = b.c as Record<string, unknown>;
  assert.equal(c.d, 1);
});

test('setByPath 对不可写目标返回 false', () => {
  assert.equal(setByPath(null, 'a', 1), false);
  assert.equal(setByPath(undefined, 'a', 1), false);
  assert.equal(setByPath('str', 'a', 1), false);
  assert.equal(setByPath(42, 'a', 1), false);
  assert.equal(setByPath({}, '', 1), false);
});
