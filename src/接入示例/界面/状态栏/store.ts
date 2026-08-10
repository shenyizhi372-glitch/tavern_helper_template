/**
 * 数据 store：连接 MVU 变量 stat_data。
 * 传入项目 schema 开启类型校验；不传则使用保真模式（不剥除任何字段）。
 */
import { createStatusBarStore } from '../../../通用/状态栏/store';
import { Schema } from './schema';

export const useDataStore = createStatusBarStore({ schema: Schema });
