import { SqlManageStatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { GetSqlManageListV2FilterStatusEnum } from '@actiontech/shared/lib/api/sqle/service/SqlManage/index.enum';
import { ISqlManage } from '@actiontech/shared/lib/api/sqle/service/common';
import { TypeStatus } from './StatusFilter';

export type SqlManageOptimisticPatch = Partial<
  Pick<ISqlManage, 'status' | 'assignees' | 'remark' | 'priority'>
>;

export type SqlManageOptimisticWritePayload = {
  ids: number[];
  patch?: SqlManageOptimisticPatch;
  /** Shown when the row stays on the current tab */
  successMessage?: string;
};

export const OPTIMISTIC_GREEN_ROW_CLASS = 'sql-manage-optimistic-green';

export const willLeaveCurrentTab = (
  filterStatus: TypeStatus,
  nextStatus?: string
): boolean => {
  if (!nextStatus || filterStatus === 'all') {
    return false;
  }
  return filterStatus !== nextStatus;
};

export const leaveTabMessageKeyByStatus = (
  status: string
): string | undefined => {
  switch (status) {
    case SqlManageStatusEnum.solved:
    case GetSqlManageListV2FilterStatusEnum.solved:
      return 'sqlManagement.table.action.optimistic.movedToSolved';
    case SqlManageStatusEnum.ignored:
    case GetSqlManageListV2FilterStatusEnum.ignored:
      return 'sqlManagement.table.action.optimistic.movedToIgnored';
    case SqlManageStatusEnum.manual_audited:
    case GetSqlManageListV2FilterStatusEnum.manual_audited:
      return 'sqlManagement.table.action.optimistic.movedToManualAudited';
    case SqlManageStatusEnum.unhandled:
    case GetSqlManageListV2FilterStatusEnum.unhandled:
      return 'sqlManagement.table.action.optimistic.movedToUnhandled';
    default:
      return undefined;
  }
};

export const mergeOptimisticList = (
  list: ISqlManage[] | undefined,
  overlay: Record<number, SqlManageOptimisticPatch>,
  hiddenIds: Set<number>,
  pinnedRows?: Record<number, ISqlManage>
): ISqlManage[] => {
  const base = list ?? [];
  const baseIds = new Set(
    base
      .map((row) => (row.id != null ? Number(row.id) : NaN))
      .filter((id) => Number.isFinite(id))
  );
  const pinned = Object.values(pinnedRows ?? {}).filter((row) => {
    if (row.id == null) {
      return false;
    }
    const id = Number(row.id);
    return Number.isFinite(id) && !baseIds.has(id) && !hiddenIds.has(id);
  });

  return [...base, ...pinned]
    .filter((row) => row.id != null && !hiddenIds.has(Number(row.id)))
    .map((row) => {
      const id = Number(row.id);
      const patch = overlay[id];
      return patch ? { ...row, ...patch } : row;
    });
};
