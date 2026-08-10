import { test } from 'node:test';
import assert from 'node:assert/strict';
import { defaultTheme, mergeTheme, themeToCssVars } from '../theme';

test('mergeTheme 无覆盖时返回原主题', () => {
  assert.equal(mergeTheme(defaultTheme, undefined), defaultTheme);
});

test('mergeTheme 深合并：只覆盖给出的键，其余保留', () => {
  const merged = mergeTheme(defaultTheme, {
    colors: { primary: '#123456' },
    density: 'compact',
  });
  assert.equal(merged.colors.primary, '#123456');
  assert.equal(merged.colors.accent, defaultTheme.colors.accent);
  assert.equal(merged.density, 'compact');
  assert.deepEqual(merged.font, defaultTheme.font);
  assert.equal(merged.section.dividerChar, defaultTheme.section.dividerChar);
});

test('mergeTheme 空覆盖对象不改动主题', () => {
  const merged = mergeTheme(defaultTheme, {});
  assert.deepEqual(merged, defaultTheme);
});

test('themeToCssVars 输出功能语义 CSS 变量', () => {
  const vars = themeToCssVars(defaultTheme);
  assert.equal(vars['--sb-primary'], defaultTheme.colors.primary);
  assert.equal(vars['--sb-accent'], defaultTheme.colors.accent);
  assert.equal(vars['--sb-progress-track'], defaultTheme.colors.progressTrack);
  assert.equal(vars['--sb-font-family'], defaultTheme.font.family);
  assert.equal(vars['--sb-radius-pill'], defaultTheme.radius.pill);
});

test('themeToCssVars 密度决定基础字号', () => {
  const compact = themeToCssVars(mergeTheme(defaultTheme, { density: 'compact' }));
  const normal = themeToCssVars(defaultTheme);
  const comfortable = themeToCssVars(mergeTheme(defaultTheme, { density: 'comfortable' }));
  assert.equal(compact['--sb-font-size'], '12px');
  assert.equal(normal['--sb-font-size'], '13.5px');
  assert.equal(comfortable['--sb-font-size'], '15px');
});
