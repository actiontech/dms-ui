import LocalStorageWrapper from '@actiontech/shared/lib/utils/LocalStorageWrapper';
import { ActiontechTableColumn } from '@actiontech/shared/lib/components/ActiontechTable';
import { ISqlManage } from '@actiontech/shared/lib/api/sqle/service/common';
import { SqlManagementTableFilterParamType } from './column';

export const SQL_MANAGEMENT_TABLE_NAME = 'sql_management_list';

const LIST_AUDIT_RESULT_COLUMN_KEY = 'audit_result';
const AUDIT_LEVEL_EXPORT_KEY = 'audit_level';
const RULE_DESC_EXPORT_KEY = 'rule_desc';
const OBJECT_NAME_EXPORT_KEY = 'object_name';

const SQL_MANAGEMENT_EXPORT_COLUMN_KEYS = [
  'sql_fingerprint',
  'sql',
  'source',
  AUDIT_LEVEL_EXPORT_KEY,
  RULE_DESC_EXPORT_KEY,
  OBJECT_NAME_EXPORT_KEY,
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

const isExportableColumnKey = (
  columnKey: string,
  extraKeySet: Set<string> | undefined
) => {
  if (columnKey === LIST_AUDIT_RESULT_COLUMN_KEY) {
    return true;
  }

  return (
    exportColumnKeySet.has(columnKey as SqlManagementExportColumnKey) ||
    !!extraKeySet?.has(columnKey)
  );
};

const expandListColumnKeyToExportKeys = (columnKey: string): string[] => {
  if (columnKey === LIST_AUDIT_RESULT_COLUMN_KEY) {
    return [AUDIT_LEVEL_EXPORT_KEY, RULE_DESC_EXPORT_KEY];
  }

  return [columnKey];
};

const injectObjectNameExportKey = (exportKeys: string[]): string[] => {
  if (!exportKeys.length || exportKeys.includes(OBJECT_NAME_EXPORT_KEY)) {
    return exportKeys;
  }

  const ruleDescIndex = exportKeys.indexOf(RULE_DESC_EXPORT_KEY);
  if (ruleDescIndex >= 0) {
    return [
      ...exportKeys.slice(0, ruleDescIndex + 1),
      OBJECT_NAME_EXPORT_KEY,
      ...exportKeys.slice(ruleDescIndex + 1)
    ];
  }

  const sourceIndex = exportKeys.indexOf('source');
  if (sourceIndex >= 0) {
    return [
      ...exportKeys.slice(0, sourceIndex + 1),
      OBJECT_NAME_EXPORT_KEY,
      ...exportKeys.slice(sourceIndex + 1)
    ];
  }

  return [...exportKeys, OBJECT_NAME_EXPORT_KEY];
};

export const getSqlManagementExportColumnKeys = (
  columns: ActiontechTableColumn<ISqlManage, SqlManagementTableFilterParamType>,
  username: string,
  extraKeys?: readonly string[],
  tableName = SQL_MANAGEMENT_TABLE_NAME
): string[] => {
  const localColumnSettings = readLocalColumnSettings(tableName, username);
  const extraKeySet = extraKeys?.length ? new Set(extraKeys) : undefined;

  const visibleExportKeys = columns
    .map((column, index) => {
      const columnKey = getColumnDataIndex(column.dataIndex);
      if (!columnKey || !isExportableColumnKey(columnKey, extraKeySet)) {
        return undefined;
      }

      const localSetting = localColumnSettings[columnKey];
      return {
        key: columnKey,
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
    .flatMap((column) => expandListColumnKeyToExportKeys(column.key));

  return injectObjectNameExportKey(visibleExportKeys);
};
