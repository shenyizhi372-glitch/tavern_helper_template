import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getByPath, isEmptyValue } from '../path';

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
