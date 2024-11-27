import { DefaultOptionType } from 'antd/es/select';
import { IDataObjects, ObjectPrivilegeValues } from './index.type';
import {
  IDataPermissionForRole,
  IDBAccountDataPermission
} from '@actiontech/shared/lib/api/provision/service/common';

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
  dataObjects: ObjectPrivilegeValues['objectsValue'],
  dataOperations: ObjectPrivilegeValues['operationsValue']
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

export const generatePrivilegesFormValuesByBackendData = (
  dataPermissions: IDBAccountDataPermission[],
  service: string
): ObjectPrivilegeValues[] => {
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
            database: database_uid ?? '',
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

export const generatePrivilegesSubmitDataByFormValues = (
  systemPrivileges: string[],
  objectPrivileges: ObjectPrivilegeValues[]
): IDataPermissionForRole[] => {
  const dataPrivileges: IDataPermissionForRole[] = [];

  systemPrivileges?.forEach((uid) => {
    dataPrivileges.push({
      data_operation_uids: [uid],
      data_object_uids: []
    });
  });

  objectPrivileges?.forEach((item) => {
    dataPrivileges.push({
      data_operation_uids: item.operationsValue,
      data_object_uids:
        item.objectsValue?.flatMap((object) => {
          if (object.tables && object.tables.length > 0) {
            return object.tables ?? [];
          }

          return [object.database];
        }) ?? []
    });
  });

  return dataPrivileges;
};
