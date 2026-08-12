/**
 * 数据 store：连接 MVU 变量 stat_data（全家亲子游 schema）。
 * UI 修改 store.data 后 defineMvuDataStore 自动双向同步写回楼层变量。
 */
import { defineMvuDataStore } from '@util/mvu';
import { Schema } from '../../schema';

export const useDataStore = defineMvuDataStore(Schema, { type: 'message', message_id: getCurrentMessageId() });
