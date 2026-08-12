# MVU 制卡流程（以全家亲子游为样板）

本文把「MVU 角色卡」从零到可交互可配图前端的完整链路走一遍，以 `src/全家亲子游/` 为实例。
读完你可以给任意新卡搭 MVU 体系。

## MVU 是什么

MVU（Model-View-Update）= 一套「变量框架」：

- **变量**：存在每个消息楼层（message）的 `stat_data` 字段里，AI 每轮通过消息里的变量更新命令维护它
- **AI 更新**：AI 在回复末尾输出 `<UpdateVariable><JSONPatch>…</JSONPatch></UpdateVariable>`，酒馆助手解析并写楼层变量（JSON Patch 风格：replace / delta / insert / remove / move）
- **前端读取**：界面通过 `defineMvuDataStore(Schema, {type:'message', message_id:getCurrentMessageId()})` 订阅当前楼层变量
- **前端写入**：改 `store.data.x` → 自动写回楼层变量 → 下一轮世界书把新变量注入提示词 → AI 感知

```
AI 输出 <UpdateVariable> → 酒馆助手解析 → 楼层变量 stat_data
      ↑                                    ↓
世界书注入新变量给 AI ←────── 前端 defineMvuDataStore 读取/写入
```

## 全链路五件套

### 1. schema.ts —— 变量结构（唯一真相）

```ts
// src/全家亲子游/schema.ts
export const Schema = z.object({
  系统: z.object({ 日期: z.string().prefault(''), 时间: z.string().prefault(''), 地点: z.string().prefault('家·客厅') }),
  角色: z.record(z.string(), z.object({
    表情: z.string().prefault('👤'),
    _用户: z.boolean().prefault(false),          // _ 开头 = 只读，AI 不更新
    穿着: z.string().prefault(''),
    神态: z.string().prefault(''),
    心情: z.string().prefault(''),
    当前行动: z.string().prefault(''),
    好感度: z.coerce.number().prefault(50),      // 数值字段，前端可交互
  })),
  剧情: z.object({
    当前事件: z.string().prefault(''),
    可选发展: z.array(z.object({ type: z.string().prefault('正常'), text: z.string().prefault('') })).prefault([]),
  }),
});
```

要点：
- `z.coerce.number()` 容忍 AI 输出字符串数字
- 动态键（角色表）用 `z.record(z.string(), …)`
- `_` 开头字段只读（前端标记用，如 `_用户`）

### 2. 注册脚本 —— 让酒馆助手认识 schema

```ts
// src/全家亲子游/脚本/变量结构/index.ts
import { registerMvuSchema } from 'https://testingcf.jsdelivr.net/gh/StageDog/tavern_resource/dist/util/mvu_zod.js';
import { Schema } from '../../schema';

$(() => { registerMvuSchema(Schema); });
```

`pnpm watch` 时 webpack 会自动把 schema.ts 转成 `schema.json`（校验 initvar 用）。

### 3. 世界书条目（4 个文件，放 `世界书/变量/`）

| 文件 | 作用 |
| --- | --- |
| `initvar.yaml` | 变量初始值（按 schema.json 结构写，含 `# yaml-language-server: $schema=../../schema.json` 头） |
| `变量列表.txt` | `{{format_message_variable::stat_data}}` —— 把当前变量注入提示词给 AI 看 |
| `变量更新规则.yaml` | 每个变量的更新规则：`type`（number/format/索引签名）、`range`（如好感度 0~100）、`check`（何时更新、幅度多少） |
| `变量输出格式.yaml` | 固定模板：要求 AI 输出 `<UpdateVariable>` + JSON Patch（照抄官方格式即可） |

要点：
- `角色.${角色名}` 的嵌套写法表示动态键规则（对所有角色生效）
- `check` 是 AI 更新变量的行为准则，写得越具体更新越稳定
- 前端可改的字段（如好感度）也要给 AI 写 check（否则 AI 下一轮可能覆写前端改动）

### 4. 前端接入

```ts
// src/全家亲子游/界面/状态栏/store.ts
import { defineMvuDataStore } from '@util/mvu';
import { Schema } from '../../schema';
export const useDataStore = defineMvuDataStore(Schema, { type: 'message', message_id: getCurrentMessageId() });
```

```ts
// index.ts —— 等 MVU 就绪再挂载
$(async () => {
  await waitGlobalInitialized('Mvu');
  await waitUntil(() => _.has(getVariables({ type: 'message' }), 'stat_data'));
  createApp(App).use(createPinia()).mount('#app');
});
```

组件里：`const store = useDataStore(); store.data.系统.地点` 直接读；
写：`store.data.角色['孙莹'].好感度 = 65`（自动同步回楼层变量，无需手动调用任何 API）。

**交互进故事的两条路**：
1. **写变量**（按钮/滑块/输入）→ AI 下一轮感知（经变量注入）
2. **发消息**（剧情选项）→ `createChatMessages([{role:'user',message}])` + `triggerSlash('/trigger')` → 直接推进对话

**配图**：静态图放 `src/{项目}/图片/`，推送 GitHub 后经 jsdelivr CDN 引用；前端用 mapped 映射（变量值→URL），AI 只维护键名。

**阶段立绘与解锁**：人物图片可分阶段（gallery 配置），解锁条件 = 变量阈值/等值（`unlock` 纯数据声明），达标自动解锁且永久记录；密钥（masterKey/单图 key）可强制解锁。设置界面（⚙️）提供主题/字号/图鉴浏览。详见接入文档「人物立绘图鉴」「设置界面」「字段锁」章节。

### 5. 正则接入

界面产物的 HTML 代码块由卡内正则（仅显示模式）注入消息楼层：
`<StatusPlaceHolder/>` 占位 → 替换为 `$('body').load('CDN地址')` 代码块。正则只定位、不解析数据。

## 常见坑

| 坑 | 说明 |
| --- | --- |
| schema 与 initvar 不一致 | `pnpm watch` 会生成 schema.json，initvar 写错会在导入时被校验 |
| 前端写的字段被 AI 覆写 | 该字段在变量更新规则里没写 check，或 check 没约束幅度 |
| `_` 字段被 AI 改 | 规则模板明确「don't update field names starts with `_`」 |
| strip 破坏变量 | `defineMvuDataStore` 传不完整的 schema 会剥除未声明字段并写回；保证 schema 覆盖全部字段，或用通用保真模式 |
| 选项重复触发 | message 型选项点击后整组禁用（lockAfterPick） |

## 构建部署

```bash
pnpm test      # 单测
pnpm build     # 产物在 dist/{项目}/界面/状态栏/index.html
```

推送 GitHub → CI 自动构建 dist + 打版本 tag → `https://testingcf.jsdelivr.net/gh/{用户}/{仓库}/dist/{项目}/界面/状态栏/index.html`
