/**
 * 数据 store：连接 MVU 变量 stat_data（伪娘隐奸绿帽全家桶NTR schema）。
 * UI 修改 store.data 后 defineMvuDataStore 自动双向同步写回楼层变量。
 */
import { createStatusBarStore } from '../../../通用/状态栏/store';
import { Schema } from '../../schema';

export const useDataStore = createStatusBarStore({ schema: Schema });
