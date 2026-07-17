import {
  ActiontechTableColumn,
  CatchTableColumnValueType,
  CatchTableColumnsType
} from '../index.type';
import { useCallback, useEffect, useState } from 'react';
import { eventEmitter } from '../../../utils/EventEmitter';
import EmitterKey from '../../../data/EmitterKey';
import { getColumnsLabel } from '../utils';
import LocalStorageWrapper from '../../../utils/LocalStorageWrapper';
import { isEqual } from 'lodash';
import { ACTIONTECH_TABLE_OPERATOR_COLUMN_DATA_INDEX } from './useTableAction';

/**
 * 仅用于「首次写入」默认列配置：保证操作列 order 在最后。
 * 用户已有缓存时不要调用，以免覆盖用户调整过的操作列位置。
 */
const ensureOperatorColumnLast = <
  T extends Record<string, any>,
  OtherColumnKeys extends string = ''
>(
  columnsRecord: CatchTableColumnValueType<T, OtherColumnKeys>
): CatchTableColumnValueType<T, OtherColumnKeys> => {
  const operatorColumn =
    columnsRecord[
      ACTIONTECH_TABLE_OPERATOR_COLUMN_DATA_INDEX as keyof typeof columnsRecord
    ];
  if (!operatorColumn) {
    return columnsRecord;
  }

  const maxOtherOrder = Object.entries(columnsRecord).reduce(
    (max, [key, value]) => {
      if (key === ACTIONTECH_TABLE_OPERATOR_COLUMN_DATA_INDEX) {
        return max;
      }
      return Math.max(max, value?.order ?? 0);
    },
    0
  );

  if ((operatorColumn.order ?? 0) > maxOtherOrder) {
    return columnsRecord;
  }

  return {
    ...columnsRecord,
    [ACTIONTECH_TABLE_OPERATOR_COLUMN_DATA_INDEX]: {
      ...operatorColumn,
      order: maxOtherOrder + 1
    }
  };
};

/**
 * 动态新增列首次写入时：插在当前操作列之前（或数据列末尾）。
 * 会平移操作列及之后列的 order，但不会把操作列强行拽到全局最后
 *（若用户已把操作列挪到中间，相对位置保持）。
 */
const assignOrdersForNewColumns = <
  T extends Record<string, any>,
  OtherColumnKeys extends string = ''
>(
  columnsRecord: CatchTableColumnValueType<T, OtherColumnKeys>,
  newDataIndexes: string[]
): CatchTableColumnValueType<T, OtherColumnKeys> => {
  const newNonOperatorIndexes = newDataIndexes.filter(
    (key) => key !== ACTIONTECH_TABLE_OPERATOR_COLUMN_DATA_INDEX
  );
  if (newNonOperatorIndexes.length === 0) {
    return columnsRecord;
  }

  const operatorColumn =
    columnsRecord[
      ACTIONTECH_TABLE_OPERATOR_COLUMN_DATA_INDEX as keyof typeof columnsRecord
    ];
  const newDataIndexSet = new Set(newNonOperatorIndexes);
  const shiftCount = newNonOperatorIndexes.length;

  let insertAt: number;
  if (typeof operatorColumn?.order === 'number') {
    insertAt = operatorColumn.order;
  } else {
    const maxExistingOrder = Object.entries(columnsRecord).reduce(
      (max, [key, value]) => {
        if (newDataIndexSet.has(key)) {
          return max;
        }
        return Math.max(max, value?.order ?? 0);
      },
      0
    );
    insertAt = maxExistingOrder + 1;
  }

  const nextRecord = { ...columnsRecord };

  if (typeof operatorColumn?.order === 'number') {
    Object.keys(nextRecord).forEach((key) => {
      if (newDataIndexSet.has(key)) {
        return;
      }
      const col = nextRecord[key as keyof typeof nextRecord];
      if (col && (col.order ?? 0) >= insertAt) {
        nextRecord[key as keyof typeof nextRecord] = {
          ...col,
          order: (col.order ?? 0) + shiftCount
        };
      }
    });
  }

  newNonOperatorIndexes.forEach((dataIndex, i) => {
    const col = nextRecord[dataIndex as keyof typeof nextRecord];
    if (col) {
      nextRecord[dataIndex as keyof typeof nextRecord] = {
        ...col,
        order: insertAt + i
      };
    }
  });

  return nextRecord;
};

/** settingMarked 仅在 true 时持久化；缺失与 false 视为等价，避免 localStorage 反复重写 */
const omitFalseSettingMarked = <
  T extends Record<string, unknown>,
  OtherColumnKeys extends string = ''
>(
  columnsRecord: CatchTableColumnValueType<T, OtherColumnKeys>
): CatchTableColumnValueType<T, OtherColumnKeys> => {
  const nextRecord = { ...columnsRecord };

  Object.keys(nextRecord).forEach((key) => {
    const col = nextRecord[key as keyof typeof nextRecord];
    if (!col?.settingMarked) {
      const { settingMarked: _removed, ...rest } = col ?? {};
      nextRecord[key as keyof typeof nextRecord] = rest as typeof col;
    }
  });

  return nextRecord;
};

const buildColumnCacheEntry = <
  T extends Record<string, unknown>,
  OtherColumnKeys extends string = ''
>(
  column: CatchTableColumnValueType<T, OtherColumnKeys>[string] | undefined,
  defaults: Partial<CatchTableColumnValueType<T, OtherColumnKeys>[string]>,
  title: string,
  settingMarked?: boolean
): CatchTableColumnValueType<T, OtherColumnKeys>[string] => {
  const entry = {
    ...column,
    ...defaults,
    title
  } as CatchTableColumnValueType<T, OtherColumnKeys>[string];

  if (settingMarked) {
    entry.settingMarked = true;
  } else if (entry.settingMarked !== true) {
    delete entry.settingMarked;
  }

  return entry;
};

const useTableSettings = <
  T extends Record<string, any>,
  F = Record<string, any>,
  OtherColumnKeys extends string = ''
>(
  tableName: string,
  username: string
) => {
  const [localColumns, setLocalColumns] = useState<
    CatchTableColumnsType<T>[string]
  >(() => {
    const data = LocalStorageWrapper.getOrDefault(tableName, '{}');
    try {
      return JSON.parse(data)[username];
    } catch (error) {
      return {};
    }
  });

  const catchDefaultColumnsInfo = useCallback(
    (defaultColumns: ActiontechTableColumn<T, F, OtherColumnKeys>) => {
      if (tableName && username && !!defaultColumns.length) {
        try {
          const localStr = LocalStorageWrapper.get(tableName);
          const localData = localStr ? JSON.parse(localStr) : undefined;
          if (localData?.[username]) {
            const localColumnsRecord = localData?.[username];
            const newDataIndexes: string[] = [];
            const newColumnsRecord = defaultColumns.reduce(
              (acc, cur, index) => {
                if (localColumnsRecord[cur.dataIndex]) {
                  return {
                    ...acc,
                    [cur.dataIndex]: buildColumnCacheEntry(
                      localColumnsRecord[cur.dataIndex],
                      {},
                      getColumnsLabel(cur.title),
                      cur.settingMarked
                    )
                  };
                }
                newDataIndexes.push(String(cur.dataIndex));
                return {
                  ...acc,
                  [cur.dataIndex]: buildColumnCacheEntry(
                    undefined,
                    {
                      order: index + 1,
                      show: cur.show ?? true,
                      fixed: cur?.fixed
                    },
                    getColumnsLabel(cur.title),
                    cur.settingMarked
                  )
                };
              },
              {} as CatchTableColumnValueType<T, OtherColumnKeys>
            );

            let normalizedColumnsRecord = assignOrdersForNewColumns(
              newColumnsRecord,
              newDataIndexes
            );

            // 操作列本身是首次出现时，默认仍放最后
            if (
              newDataIndexes.includes(
                ACTIONTECH_TABLE_OPERATOR_COLUMN_DATA_INDEX
              )
            ) {
              normalizedColumnsRecord = ensureOperatorColumnLast(
                normalizedColumnsRecord
              );
            }

            if (
              isEqual(
                omitFalseSettingMarked(normalizedColumnsRecord),
                omitFalseSettingMarked(localColumnsRecord)
              )
            ) {
              return;
            }
            const data: CatchTableColumnsType<T> = {
              ...localData,
              [username]: normalizedColumnsRecord
            };

            eventEmitter.emit(
              EmitterKey.UPDATE_LOCAL_COLUMNS,
              data[username],
              tableName,
              username
            );
            return;
          }
          const columnsInfo: CatchTableColumnValueType<T, OtherColumnKeys> =
            ensureOperatorColumnLast(
              defaultColumns.reduce<
                CatchTableColumnValueType<T, OtherColumnKeys>
              >((acc, cur, index) => {
                return {
                  ...acc,
                  [cur.dataIndex]: buildColumnCacheEntry(
                    undefined,
                    {
                      order: index + 1,
                      show: cur.show ?? true,
                      fixed: cur?.fixed
                    },
                    getColumnsLabel(cur.title),
                    cur.settingMarked
                  )
                };
              }, {} as CatchTableColumnValueType<T, OtherColumnKeys>)
            );

          const data: CatchTableColumnsType<T> = localData
            ? { ...localData, [username]: columnsInfo }
            : { [username]: columnsInfo };

          eventEmitter.emit(
            EmitterKey.UPDATE_LOCAL_COLUMNS,
            data[username],
            tableName,
            username
          );
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(error);
        }
      }
    },
    [tableName, username]
  );

  const updateCatchColumnsInfo = useCallback(
    (
      value: CatchTableColumnValueType<T>,
      _tableName: string,
      _username: string
    ) => {
      try {
        const localStr = LocalStorageWrapper.get(tableName);
        const localData = localStr ? JSON.parse(localStr) : undefined;

        if (_tableName === tableName && _username === username) {
          setLocalColumns(value);

          const data: CatchTableColumnsType<T> = localData
            ? { ...localData, [username]: value }
            : { [username]: value };

          LocalStorageWrapper.set(tableName, JSON.stringify(data));
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    },
    [tableName, username]
  );

  useEffect(() => {
    eventEmitter.subscribe(
      EmitterKey.UPDATE_LOCAL_COLUMNS,
      updateCatchColumnsInfo
    );

    return () => {
      eventEmitter.unsubscribe(
        EmitterKey.UPDATE_LOCAL_COLUMNS,
        updateCatchColumnsInfo
      );
    };
  }, [updateCatchColumnsInfo]);

  return {
    localColumns,
    catchDefaultColumnsInfo
  };
};
export default useTableSettings;
