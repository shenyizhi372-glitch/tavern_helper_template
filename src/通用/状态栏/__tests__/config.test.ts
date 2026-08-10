import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { NumberFieldConfig, StatusBarConfig } from '../types';
import { normalizeStatusBarConfig, parseStatusBarConfig } from '../config.schema';

const validConfig = {
  title: '当前状态',
  sections: [
    {
      id: 's1',
      label: '系统',
      icon: '📍',
      fields: [
        { type: 'text', path: '系统.当前视角', label: '视角' },
        {
          type: 'progress',
          path: '凯瑟琳.身体开发度',
          label: '开发度',
          thresholds: [
            { min: 66, color: '#e53935' },
            { color: '#2e7d32' },
          ],
        },
        { type: 'enum', path: '系统.视角', label: '视角', mapping: { 丈夫: { label: '丈夫', color: '#3b4cca' } } },
        { type: 'stars', path: '凯瑟琳.开发度', label: '星级', max: 5 },
        { type: 'number', path: '小胖.欲望值', label: '欲望', precision: 1 },
      ],
    },
  ],
};

test('parseStatusBarConfig 通过合法配置并填充默认值', () => {
  const parsed = parseStatusBarConfig(validConfig);
  assert.equal(parsed.title, '当前状态');
  assert.equal(parsed.sections[0].fields[0].fallback, '—');
  assert.equal(parsed.sections[0].collapsible, true);
  assert.equal(parsed.sections[0].defaultCollapsed, false);
  const numberField = parsed.sections[0].fields[4] as NumberFieldConfig;
  assert.equal(numberField.precision, 1);
});

test('parseStatusBarConfig 拒绝非法配置并给出错误', () => {
  assert.throws(() => parseStatusBarConfig({ sections: [] }));
  assert.throws(() =>
    parseStatusBarConfig({
      sections: [{ id: 'a', label: 'a', fields: [{ type: 'text', label: '缺 path' }] }],
    }),
  );
  assert.throws(() =>
    parseStatusBarConfig({
      sections: [{ id: 'a', label: 'a', fields: [{ type: 'unknown', path: 'a', label: '未知类型' }] }],
    }),
  );
  assert.throws(() =>
    parseStatusBarConfig({
      sections: [{ id: 'a', label: 'a', fields: [{ type: 'enum', path: 'a', label: '缺 mapping' }] }],
    }),
  );
});

test('normalizeStatusBarConfig 保留显式配置值', () => {
  const config = {
    sections: [
      {
        id: 'a',
        label: 'a',
        collapsible: false,
        defaultCollapsed: true,
        fields: [{ type: 'text', path: 'a', label: 'b', fallback: '无' }],
      },
    ],
  } as unknown as StatusBarConfig;
  const normalized = normalizeStatusBarConfig(config);
  assert.equal(normalized.sections[0].collapsible, false);
  assert.equal(normalized.sections[0].defaultCollapsed, true);
  assert.equal(normalized.sections[0].fields[0].fallback, '无');
});
