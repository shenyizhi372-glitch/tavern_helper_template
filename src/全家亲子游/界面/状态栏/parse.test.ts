import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseStatusBlock } from './parse';

/** 开场白 0（家·厨房）的真实状态栏样例 */
const SAMPLE_KITCHEN = `『📅 日期：5月12日 星期二 | ⏰ 时间：傍晚六点 | 📍 位置：家·厨房』
<details><summary>[角色状态]</summary>
- 👩 孙莹的状态
  - 🧑‍💼 当前行动：系围裙炒番茄牛腩，扬声催儿子摆碗筷
  - 👗 当前穿搭：吊带背心外系围裙，家常睡裤
  - 💭 当前内心：儿子今天黏人，腿间又流白带了
  - 🍒 胸部状况：围裙系带勒出胸线，背心领口敞着
  - 🌸 私处状况：内裤边濡湿一小块，只当白带
  - 👄 脸部状况：被油烟气熏得泛红，发丝有些散
  - 📅 最近性行为：无
- 👨 <user>（张宝）的状态
  - 🧑‍💼 当前行动：贴着妈妈后背，手搭在她腰侧
  - 👔 当前穿搭：校服外套没脱，脚踩拖鞋
  - 😊 可见神态：闷声不吭，呼吸沉沉扑在妈妈后颈
  - 📅 最近性行为：近日偷奸妈妈数次
</details>
『剧情发展』
1.[正常]应声去摆碗筷，开饭等爸爸视频 2.[色情]借摆碗筷贴近妈妈，手不老实 3.[淫秽]从身后抵住妈妈，隔着睡裤磨蹭 4.[其他]提作业话题岔开`;

test('解析全局行（日期/时间/位置）', () => {
  const d = parseStatusBlock(SAMPLE_KITCHEN);
  assert.equal(d.date, '5月12日 星期二');
  assert.equal(d.time, '傍晚六点');
  assert.equal(d.place, '家·厨房');
});

test('解析两个角色块及字段', () => {
  const d = parseStatusBlock(SAMPLE_KITCHEN);
  assert.equal(d.chars.length, 2);

  const [sun, zhang] = d.chars;
  assert.equal(sun.emoji, '👩');
  assert.equal(sun.name, '孙莹');
  assert.equal(sun.isUser, false);
  assert.equal(sun.fields.length, 7);
  assert.equal(sun.fields[0].emoji, '🧑‍💼');
  assert.equal(sun.fields[0].label, '当前行动');
  assert.equal(sun.fields[0].value, '系围裙炒番茄牛腩，扬声催儿子摆碗筷');

  assert.equal(zhang.emoji, '👨');
  assert.equal(zhang.name, '张宝');
  assert.equal(zhang.isUser, true);
  assert.equal(zhang.fields.length, 4);
});

test('解析剧情发展（单行 4 选项）', () => {
  const d = parseStatusBlock(SAMPLE_KITCHEN);
  assert.equal(d.plotOptions.length, 4);
  assert.deepEqual(
    d.plotOptions.map(o => [o.index, o.type]),
    [
      [1, '正常'],
      [2, '色情'],
      [3, '淫秽'],
      [4, '其他'],
    ],
  );
  assert.equal(d.plotOptions[0].text, '应声去摆碗筷，开饭等爸爸视频');
  assert.equal(d.plotOptions[2].text, '从身后抵住妈妈，隔着睡裤磨蹭');
});

test('剧情发展跨行输出也可解析', () => {
  const text = `『📅 日期：5月9日 | ⏰ 时间：上午 | 📍 位置：游乐场』
- 👩 孙莹的状态
  - 🧑‍💼 当前行动：排队
『剧情发展』
1.[正常]去吃饭
2.[色情]牵妈妈手
3.[淫秽]躲进更衣室
4.[其他]回家`;
  const d = parseStatusBlock(text);
  assert.equal(d.plotOptions.length, 4);
  assert.equal(d.plotOptions[1].text, '牵妈妈手');
});

test('无状态栏内容时返回空结构（不抛错）', () => {
  const d = parseStatusBlock('');
  assert.equal(d.date, '');
  assert.equal(d.chars.length, 0);
  assert.equal(d.plotOptions.length, 0);
});

test('缺失 emoji 的字段行可解析（label 为整段）', () => {
  const text = `『📍 位置：鬼屋』
- 👩 孙莹的状态
  - 当前行动：被吓软在地`;
  const d = parseStatusBlock(text);
  assert.equal(d.chars[0].fields[0].emoji, '');
  assert.equal(d.chars[0].fields[0].label, '当前行动');
});

test('字段值含「：」时只按第一个冒号切分', () => {
  const text = `- 👩 孙莹的状态
  - 📅 最近性行为：数日前地铁偷奸妈妈`;
  const d = parseStatusBlock(text);
  assert.equal(d.chars[0].fields[0].value, '数日前地铁偷奸妈妈');
});
