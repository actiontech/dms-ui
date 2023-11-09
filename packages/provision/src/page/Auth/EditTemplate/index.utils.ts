import { DefaultOptionType } from 'antd/es/select';
import {
  IDataObjects,
  IDataPermissionsTable
} from './Modal/AddDataPermission/index.d';
import { IGetDataPermissionsInDataPermissionTemplate } from '@actiontech/shared/lib/api/provision/service/common';

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

export const generateDataPermissionValueByDataPermission = (
  dataPermissions: IGetDataPermissionsInDataPermissionTemplate[]
): IDataPermissionsTable[] => {
  return (
    dataPermissions.map((item, permissionIndex) => {
      const objectsLabel: string[] = [];
      const objectsValue: IDataObjects[] = [];
      item.data_objects?.forEach((object) => {
        const { name, database_uid, table_uid } = object;
        if (name) {
          objectsLabel.push(name);
        }
        const value = objectsValue.find(
          (item) => item.database === database_uid
        );

        if (database_uid && value) {
          if (!table_uid) return;
          value.tables = value.tables
            ? [...value.tables, table_uid]
            : [table_uid];
        } else {
          objectsValue.push({
            database: database_uid,
            tables: table_uid ? [table_uid] : undefined
          });
        }
      });

      const operationsLabel: string[] = [];
      const operationsValue: string[] = [];
      item.data_operation_sets?.forEach((operation) => {
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
            return item.service_uid ?? '';
          })
          .flat() ?? [];
      return {
        index: permissionIndex,
        business: item.business ?? '',
        serviceLabel: item.service_name ?? '',
        objectsLabel,
        operationsLabel,

        serviceValue: item.service_uid ?? '',
        objectsValue,
        operationsValue,
        objectsParams
      };
    }) ?? []
  );
};
