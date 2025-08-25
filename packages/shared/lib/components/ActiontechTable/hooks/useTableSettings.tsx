import {
  ActiontechTableColumn,
  CatchTableColumnValueType,
  CatchTableColumnsType
} from '../index.type';
import { useCallback, useEffect, useState } from 'react';
import { eventEmitter } from '@actiontech/dms-kit/es/utils/EventEmitter';
import EmitterKey from '@actiontech/dms-kit/es/data/EmitterKey';
import { getColumnsLabel } from '../utils';
import { LocalStorageWrapper } from '@actiontech/dms-kit';
import { isEqual } from 'lodash';

const useTableSettings = <
  T extends Record<string, any>,
  F = Record<string, any>,
  OtherColumnKeys extends string = never
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
    } catch {
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
            const newColumnsRecord = defaultColumns.reduce(
              (acc, cur, index) => {
                if (localColumnsRecord[cur.dataIndex]) {
                  return {
                    ...acc,
                    [cur.dataIndex]: {
                      ...localColumnsRecord[cur.dataIndex],
                      title: getColumnsLabel(cur.title)
                    }
                  };
                }
                return {
                  ...acc,
                  [cur.dataIndex]: {
                    order: index + 1,
                    show: cur.show ?? true,
                    fixed: cur?.fixed,
                    title: getColumnsLabel(cur.title)
                  }
                };
              },
              {} as CatchTableColumnValueType<T, OtherColumnKeys>
            );

            if (isEqual(newColumnsRecord, localColumnsRecord)) {
              return;
            }
            const data: CatchTableColumnsType<T> = {
              ...localData,
              [username]: newColumnsRecord
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
            defaultColumns.reduce<
              CatchTableColumnValueType<T, OtherColumnKeys>
            >((acc, cur, index) => {
              return {
                ...acc,
                [cur.dataIndex]: {
                  order: index + 1,
                  show: cur.show ?? true,
                  fixed: cur?.fixed,
                  title: getColumnsLabel(cur.title)
                }
              };
            }, {} as CatchTableColumnValueType<T, OtherColumnKeys>);

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
