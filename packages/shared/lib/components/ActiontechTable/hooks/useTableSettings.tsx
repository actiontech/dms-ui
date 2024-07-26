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
    const data = LocalStorageWrapper.getOrDefault(
      LocalStorageWrapper.getKeyStartWith(tableName) ?? tableName,
      '{}'
    );
    try {
      return JSON.parse(data)[username];
    } catch (error) {
      return {};
    }
  });

  useEffect(() => {
    const localStr = LocalStorageWrapper.get(tableName);
    const localData = localStr ? JSON.parse(localStr) : undefined;
    if (localData?.[username]) {
      setLocalColumns(localData?.[username]);
    }
  }, [tableName, username]);

  const catchDefaultColumnsInfo = useCallback(
    (
      defaultColumns: ActiontechTableColumn<T, F, OtherColumnKeys>,
      tableNamePrefix: string,
      _tableName: string
    ) => {
      if (username) {
        try {
          const localStr = LocalStorageWrapper.get(_tableName);
          const localData = localStr ? JSON.parse(localStr) : undefined;
          if (localData?.[username]) {
            setLocalColumns(localData?.[username]);
            return;
          }
          LocalStorageWrapper.removeStartWith(tableNamePrefix);
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

          LocalStorageWrapper.set(_tableName, JSON.stringify(data));
          eventEmitter.emit(
            EmitterKey.UPDATE_LOCAL_COLUMNS,
            data[username],
            _tableName,
            username
          );
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(error);
        }
      }
    },
    [username]
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
          const columnsInfo = { ...localColumns, ...value };
          setLocalColumns(columnsInfo);

          const data: CatchTableColumnsType<T> = localData
            ? { ...localData, [username]: columnsInfo }
            : { [username]: columnsInfo };

          LocalStorageWrapper.set(tableName, JSON.stringify(data));
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    },
    [localColumns, tableName, username]
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
