import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseHexColor, readableTextColor } from '../color';

test('parseHexColor 支持 3 位与 6 位十六进制', () => {
  assert.deepEqual(parseHexColor('#f00'), [255, 0, 0]);
  assert.deepEqual(parseHexColor('3b4cca'), [59, 76, 202]);
  assert.deepEqual(parseHexColor('#FFFFFF'), [255, 255, 255]);
});

test('parseHexColor 非法输入返回 null', () => {
  assert.equal(parseHexColor('not-a-color'), null);
  assert.equal(parseHexColor('#ff00'), null);
  assert.equal(parseHexColor(''), null);
});

test('readableTextColor 浅底深字、深底白字', () => {
  assert.equal(readableTextColor('#ffffff'), '#1a1a1a');
  assert.equal(readableTextColor('#fdd835'), '#1a1a1a');
  assert.equal(readableTextColor('#000000'), '#ffffff');
  assert.equal(readableTextColor('#3b4cca'), '#ffffff');
  assert.equal(readableTextColor('#e53935'), '#ffffff');
});

test('readableTextColor 非法底色回退白字', () => {
  assert.equal(readableTextColor('bad'), '#ffffff');
});
