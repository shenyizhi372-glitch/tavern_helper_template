/**
 * 通用状态栏数据 store：运行时按 MVU 变量 stat_data 动态读取
 *
 * 关键点：defineMvuDataStore 在轮询时会把解析结果写回消息变量（updateVariablesWith），
 * zod 默认 strip 会剥除 schema 未声明的字段。因此通用模式使用保真 schema
 * （z.object({}).passthrough()），不做任何剥除/改写，保证不破坏角色卡的 stat_data。
 *
 * 接入项目传入自己的 schema（options.schema）时，走类型校验模式；
 * 未声明的字段会被 strip 并写回 —— 这是原生行为，由接入方自行保证 schema 完整。
 */
import { z } from 'zod';
import { defineMvuDataStore } from '@util/mvu';

/** 保真 schema：接受任意字段，原样保留 */
const PERMISSIVE_SCHEMA = z.object({}).passthrough();

/** defineMvuDataStore 接受的 schema 类型 */
type MvuSchema = Parameters<typeof defineMvuDataStore>[0];

export interface StatusBarStoreOptions {
  /** 项目自定义 schema（如 schema.ts 的 Schema）。不传时使用保真 schema（推荐） */
  schema?: MvuSchema;
  /** 变量读取位置，默认当前消息楼层 */
  variable_option?: VariableOption;
}

/**
 * 创建状态栏数据 store。
 * 返回 pinia store 定义，组件中 useStore() 后通过 store.data 访问 stat_data 对象。
 */
export function createStatusBarStore(options: StatusBarStoreOptions = {}) {
  const schema = options.schema ?? PERMISSIVE_SCHEMA;
  const variable_option = options.variable_option ?? { type: 'message', message_id: getCurrentMessageId() };
  return defineMvuDataStore(schema, variable_option);
}
