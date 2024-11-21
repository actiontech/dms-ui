import { useRequest } from 'ahooks';
import AuthService from '@actiontech/shared/lib/api/provision/service/auth';
import { AuthListOperationsDbTypeEnum } from '@actiontech/shared/lib/api/provision/service/auth/index.enum';
import { ReactNode, useCallback, useEffect, useState } from 'react';
import { DefaultOptionType } from 'antd/es/select';
import { isEqual } from 'lodash';
import { CascaderProps } from 'antd';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { IOperation } from '@actiontech/shared/lib/api/provision/service/common';
import { DatabaseFilled, DatabaseSchemaFilled } from '@actiontech/icons';
import useThemeStyleData from '../useThemeStyleData';
import { DatabaseSchemaLabelStyleWrapper } from './style';
import { extractTextFromReactNode } from '@actiontech/shared/lib/components/ActiontechTable/utils';

const TABLE_LEVEL_PERMISSION_SCOPE = ['Table'];
const DATABASE_LEVEL_PERMISSION_SCOPE = ['Database', 'Table'];
const SYSTEM_LEVEL_PERMISSION_SCOPE = ['Service', 'Instance'];

const REQUEST_DEFAULT_PARAMS = {
  page_index: 1,
  page_size: 9999
};

interface CustomCascaderOptions extends DefaultOptionType {
  isDatabase?: boolean;
  isTable?: boolean;
  isLeaf: boolean;
  disableCheckbox?: boolean;
}

const useOperationPermissionTips = (dbServiceID: string) => {
  const { sharedTheme } = useThemeStyleData();
  const [operationPermissionOptions, setOperationPermissionOptions] = useState<
    CustomCascaderOptions[]
  >([]);

  const [selectedPermissionLabels, setSelectedPermissionLabels] = useState<
    string[]
  >([]);

  const {
    data: operationPermissionList,
    run: updateOperationPermission,
    loading
  } = useRequest(
    (dbType: AuthListOperationsDbTypeEnum) =>
      AuthService.AuthListOperations({
        db_type: dbType,
        ...REQUEST_DEFAULT_PARAMS
      }).then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          setOperationPermissionOptions(
            res.data.data?.map((item) => ({
              label: item.name,
              value: item.uid,
              disableCheckbox: !getOperationPermissionLevel(
                item.uid!,
                'system',
                res.data.data
              ),
              isLeaf: getOperationPermissionLevel(
                item.uid!,
                'system',
                res.data.data
              )
            })) ?? []
          );
          return res.data.data;
        }
      }),
    {
      manual: true
    }
  );

  const { runAsync: getDatabaseOptionsByDBServiceID } = useRequest(
    () =>
      AuthService.AuthListDatabase({
        service_uid: dbServiceID,
        ...REQUEST_DEFAULT_PARAMS
      }).then((res) => {
        return res.data.data?.map((item) => ({
          value: item.uid ?? '',
          label: (
            <DatabaseSchemaLabelStyleWrapper>
              <DatabaseSchemaFilled
                width={18}
                height={18}
                color={sharedTheme.uiToken.colorPrimary}
              />
              <span className="content">{item.name}</span>
            </DatabaseSchemaLabelStyleWrapper>
          ),
          isDatabase: true
        }));
      }),
    {
      manual: true,
      ready: !!dbServiceID
    }
  );

  const { runAsync: getTableOptionsByDatabaseID } = useRequest(
    (databaseID: string) =>
      AuthService.AuthListTable({
        database_uid: databaseID,
        ...REQUEST_DEFAULT_PARAMS
      }).then((res) => {
        return res.data.data?.map((item) => ({
          value: item.uid ?? '',
          label: (
            <DatabaseSchemaLabelStyleWrapper>
              <DatabaseFilled
                width={18}
                height={18}
                color={sharedTheme.uiToken.colorPrimary}
              />
              <span className="content">{item.name}</span>
            </DatabaseSchemaLabelStyleWrapper>
          ),
          isLeaf: true,
          isTable: true
        }));
      }),
    {
      manual: true
    }
  );

  const getOperationPermissionLevel = useCallback(
    (
      permissionId: string,
      level: 'system' | 'database' | 'table',
      dataSource?: IOperation[]
    ) => {
      const scope = (operationPermissionList ?? dataSource)?.find(
        (v) => v.uid === permissionId
      )?.scope;
      if (!scope) {
        return false;
      }
      if (level === 'system') {
        return isEqual(scope, SYSTEM_LEVEL_PERMISSION_SCOPE);
      }

      if (level === 'database') {
        return isEqual(scope, DATABASE_LEVEL_PERMISSION_SCOPE);
      }

      if (level === 'table') {
        return isEqual(scope, TABLE_LEVEL_PERMISSION_SCOPE);
      }

      return false;
    },
    [operationPermissionList]
  );

  const permissionsDisplayRender: CascaderProps<CustomCascaderOptions>['displayRender'] =
    (labels) => {
      if (labels.length === 1) {
        return labels;
      }

      if (labels.length === 2) {
        return (
          <span>{`${labels[0]} ON ${extractTextFromReactNode(
            labels[1]
          )}.*`}</span>
        );
      }

      if (labels.length === 3) {
        return (
          <span>{`${labels[0]} ON ${extractTextFromReactNode(
            labels[1]
          )}.${extractTextFromReactNode(labels[2])}`}</span>
        );
      }
    };

  const loadDataBaseOnPermissionLevel: CascaderProps<CustomCascaderOptions>['loadData'] =
    useCallback(
      (selectedOptions: CustomCascaderOptions[]) => {
        const targetOption = selectedOptions[selectedOptions.length - 1];

        if (targetOption.value) {
          if (targetOption.isDatabase && !targetOption.isLeaf) {
            getTableOptionsByDatabaseID(targetOption.value.toString()).then(
              (res) => {
                targetOption.children = res;
                setOperationPermissionOptions([...operationPermissionOptions]);
              }
            );
          } else {
            getDatabaseOptionsByDBServiceID().then((res) => {
              targetOption.children =
                res?.map((v) => ({
                  ...v,
                  isLeaf: getOperationPermissionLevel(
                    targetOption.value!.toString(),
                    'table'
                  )
                })) ?? [];
              setOperationPermissionOptions([...operationPermissionOptions]);
            });
          }
        }
      },
      [
        getDatabaseOptionsByDBServiceID,
        getOperationPermissionLevel,
        getTableOptionsByDatabaseID,
        operationPermissionOptions
      ]
    );

  return {
    updateOperationPermission,
    loading,
    operationPermissionList,
    operationPermissionOptions,
    getOperationPermissionLevel,
    loadDataBaseOnPermissionLevel,
    permissionsDisplayRender,
    selectedPermissionLabels,
    setSelectedPermissionLabels
  };
};

export default useOperationPermissionTips;
