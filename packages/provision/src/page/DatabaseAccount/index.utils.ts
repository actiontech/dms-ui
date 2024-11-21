import { DefaultOptionType } from 'antd/es/select';
import {
  IDBAccountDataPermission,
  IListDBAccount
} from '@actiontech/shared/lib/api/provision/service/common';
import { IAuthListDataOperationSetsParams } from '@actiontech/shared/lib/api/provision/service/auth/index.d';
import { PermissionsType, IDataObjects } from './index.type';
import qs from 'query-string';

export const getObjectsLabelByDataObjects = (
  dataObjects?: IDataObjects[],
  databaseOptions?: DefaultOptionType[],
  tableOptions?: DefaultOptionType[][]
) => {
  const list = dataObjects?.filter((item) => !!item.database) ?? [];
  if (!list?.length) {
    return ['*.*'];
  }
  const newTableOptions = tableOptions?.flat();
  const objects = list.map((item) => {
    const database = databaseOptions?.find(
      (option) => option.value === item.database
    )?.label;
    if (!item?.tables?.length) {
      return `${database}.*`;
    }
    return item.tables.map((table) => {
      const tableName = newTableOptions?.find(
        (option) => option.value === table
      )?.label;
      return `${database}.${tableName}`;
    });
  });
  return objects.flat();
};

export const customIdGenerator = (
  dataObjects: PermissionsType['objectsValue'],
  dataOperations: PermissionsType['operationsValue']
) => {
  const dataObjectIds = dataObjects?.reduce((prev, next) => {
    const tableIdStr = next.tables?.reduce((p, n) => `${p}${n}`, '') ?? '';
    return `${prev}${next.database ?? ''}${tableIdStr}`;
  }, '');
  const operationIds = dataOperations?.reduce(
    (prev, next) => `${prev}${next}`,
    ''
  );
  return `${dataObjectIds}${operationIds}`;
};

export const generateDataPermissionValueByDataPermission = (
  dataPermissions: IDBAccountDataPermission[],
  service: string
): PermissionsType[] => {
  return (
    dataPermissions.map((item) => {
      const objectsLabel: string[] = [];
      const objectsValue: IDataObjects[] = [];
      item.data_objects?.forEach((object) => {
        const { name, database_uid, table_uid } = object;
        if (name) {
          objectsLabel.push(name);
        }
        const value = objectsValue.find((i) => {
          return i.database === database_uid;
        });

        if (database_uid && value) {
          if (!table_uid) {
            return;
          }
          value.tables = value.tables
            ? [...value.tables, table_uid]
            : [table_uid];
        } else {
          objectsValue.push({
            database: database_uid ? database_uid : undefined,
            tables: table_uid ? [table_uid] : undefined
          });
        }
      });

      const operationsLabel: string[] = [];
      const operationsValue: string[] = [];
      item.data_operations?.forEach((operation) => {
        operationsLabel.push(operation.name ?? '');
        operationsValue.push(operation.uid ?? '');
      });
      const objectsParams =
        objectsValue
          .map((object) => {
            if (object?.tables?.length) {
              return object.tables;
            } else if (object?.database) {
              return object.database;
            }
            return service ?? '';
          })
          .flat() ?? [];
      return {
        id: customIdGenerator(objectsValue, operationsValue),
        objectsLabel,
        operationsLabel,
        objectsValue,
        operationsValue,
        objectsParams
      };
    }) ?? []
  );
};

export const accountNameRender = (account: IListDBAccount['account_info']) => {
  if (!account?.hostname) {
    return account?.user ?? '-';
  }
  return `${account?.user}@${account.hostname}`;
};

export const getOperationSetsParamsSerializer = (
  params: IAuthListDataOperationSetsParams
) => qs.stringify(params);
