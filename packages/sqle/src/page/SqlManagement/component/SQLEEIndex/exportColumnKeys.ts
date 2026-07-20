import LocalStorageWrapper from '@actiontech/shared/lib/utils/LocalStorageWrapper';
import { ActiontechTableColumn } from '@actiontech/shared/lib/components/ActiontechTable';
import { ISqlManage } from '@actiontech/shared/lib/api/sqle/service/common';
import { SqlManagementTableFilterParamType } from './column';

export const SQL_MANAGEMENT_TABLE_NAME = 'sql_management_list';

const SQL_MANAGEMENT_EXPORT_COLUMN_KEYS = [
  'sql_fingerprint',
  'sql',
  'source',
  'audit_result',
  'instance_name',
  'schema_name',
  'priority',
  'assignees',
  'endpoints',
  'status',
  'remark'
] as const;

type SqlManagementExportColumnKey =
  (typeof SQL_MANAGEMENT_EXPORT_COLUMN_KEYS)[number];

type SqlManagementColumnSettings = Partial<
  Record<
    string,
    {
      order?: number;
      show?: boolean;
    }
  >
>;

const exportColumnKeySet = new Set<string>(SQL_MANAGEMENT_EXPORT_COLUMN_KEYS);

const getColumnDataIndex = (
  dataIndex: ActiontechTableColumn<
    ISqlManage,
    SqlManagementTableFilterParamType
  >[number]['dataIndex']
) => {
  return typeof dataIndex === 'string' ? dataIndex : undefined;
};

const readLocalColumnSettings = (
  tableName: string,
  username: string
): SqlManagementColumnSettings => {
  try {
    const localColumns = JSON.parse(
      LocalStorageWrapper.getOrDefault(tableName, '{}')
    );
    return localColumns?.[username] ?? {};
  } catch {
    return {};
  }
};

export const getSqlManagementExportColumnKeys = (
  columns: ActiontechTableColumn<ISqlManage, SqlManagementTableFilterParamType>,
  username: string,
  tableName = SQL_MANAGEMENT_TABLE_NAME
): SqlManagementExportColumnKey[] => {
  const localColumnSettings = readLocalColumnSettings(tableName, username);

  return columns
    .map((column, index) => {
      const columnKey = getColumnDataIndex(column.dataIndex);
      if (!columnKey || !exportColumnKeySet.has(columnKey)) {
        return undefined;
      }

      const localSetting = localColumnSettings[columnKey];
      return {
        key: columnKey as SqlManagementExportColumnKey,
        show: localSetting?.show ?? column.show ?? true,
        order: localSetting?.order ?? index + 1,
        defaultOrder: index + 1
      };
    })
    .filter((column): column is NonNullable<typeof column> => {
      return !!column && column.show;
    })
    .sort((currentColumn, nextColumn) => {
      return (
        currentColumn.order - nextColumn.order ||
        currentColumn.defaultOrder - nextColumn.defaultOrder
      );
    })
    .map((column) => column.key);
};
