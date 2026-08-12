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

test('parseStatusBarConfig 通过交互与图片字段配置', () => {
  const parsed = parseStatusBarConfig({
    title: '交互面板',
    images: [
      { id: '立绘', position: 'top', source: { type: 'static', url: 'https://x/avatar.png' }, ratio: '1/1' },
      { id: '背景', position: 'background', source: { type: 'mapped', by: '系统.地点', map: { 厨房: 'https://x/k.png' } } },
    ],
    sections: [
      {
        id: 's1',
        label: '操作',
        fields: [
          { type: 'image', path: '场景图', label: '场景', source: { type: 'fromVariable', path: '系统.场景图' } },
          { type: 'action', path: '好感', label: '好感+1', action: { mode: 'variable', path: '角色.好感度', delta: 1 } },
          { type: 'action', path: '对话', label: '打招呼', action: { mode: 'message', content: '你好呀' } },
          {
            type: 'choice',
            path: '选择', label: '怎么回应？',
            options: [
              { label: '拥抱', action: { mode: 'message', content: '我抱住了她' } },
              { label: '加好感', action: { mode: 'variable', path: '角色.好感度', delta: 5 } },
            ],
          },
          { type: 'slider', path: '心情', label: '心情', min: 0, max: 100, step: 5 },
          { type: 'input', path: '留言', label: '留言', commitOn: 'enter' },
        ],
      },
    ],
  });
  assert.equal(parsed.images?.length, 2);
  assert.equal(parsed.sections[0].fields.length, 6);
});

test('parseStatusBarConfig 拒绝非法交互配置', () => {
  // message 行为缺 content
  assert.throws(() =>
    parseStatusBarConfig({
      sections: [{ id: 'a', label: 'a', fields: [{ type: 'action', path: 'a', label: 'b', action: { mode: 'message' } }] }],
    }),
  );
  // variable 行为缺 path
  assert.throws(() =>
    parseStatusBarConfig({
      sections: [{ id: 'a', label: 'a', fields: [{ type: 'action', path: 'a', label: 'b', action: { mode: 'variable', delta: 1 } }] }],
    }),
  );
  // choice 缺 options
  assert.throws(() =>
    parseStatusBarConfig({
      sections: [{ id: 'a', label: 'a', fields: [{ type: 'choice', path: 'a', label: 'b' }] }],
    }),
  );
  // slider 缺 path
  assert.throws(() =>
    parseStatusBarConfig({
      sections: [{ id: 'a', label: 'a', fields: [{ type: 'slider', label: 'b' }] }],
    }),
  );
  // static 图片缺 url
  assert.throws(() =>
    parseStatusBarConfig({
      sections: [{ id: 'a', label: 'a', fields: [{ type: 'image', path: 'a', label: 'b', source: { type: 'static' } }] }],
    }),
  );
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
