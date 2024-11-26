import { useRequest } from 'ahooks';
import AuthService from '@actiontech/shared/lib/api/provision/service/auth';
import { AuthListOperationsDbTypeEnum } from '@actiontech/shared/lib/api/provision/service/auth/index.enum';
import { useCallback, useEffect, useRef, useState } from 'react';
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

const useOperationPermissionTips = (
  dbServiceID: string,
  selectedPermissions?: string[][]
) => {
  const { sharedTheme } = useThemeStyleData();
  const [operationPermissionOptions, setOperationPermissionOptions] = useState<
    CustomCascaderOptions[]
  >([]);
  const [tableLoading, setTableLoading] = useState(false);

  // 用于存储已加载的数据库选项
  const databaseOptionsRef = useRef<CustomCascaderOptions[]>([]);
  // 用于存储表选项的映射，key 为 databaseId
  const tableOptionsMapRef = useRef<Record<string, CustomCascaderOptions[]>>(
    {}
  );
  // 用于存储操作权限选项的原始数据
  const operationOptionsRef = useRef<CustomCascaderOptions[]>([]);

  // 获取操作权限列表
  const {
    data: operationPermissionList,
    run: updateOperationPermission,
    loading: operationLoading
  } = useRequest(
    (dbType: AuthListOperationsDbTypeEnum) =>
      AuthService.AuthListOperations({
        db_type: dbType,
        ...REQUEST_DEFAULT_PARAMS
      }).then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          const options =
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
            })) ?? [];
          operationOptionsRef.current = options;
          setOperationPermissionOptions(options);
          return res.data.data;
        }
      }),
    {
      manual: true
    }
  );

  // 获取数据库选项
  const { runAsync: getDatabaseOptions, loading: databaseLoading } = useRequest(
    () =>
      AuthService.AuthListDatabase({
        service_uid: dbServiceID,
        ...REQUEST_DEFAULT_PARAMS
      }).then((res) => {
        const options =
          res.data.data?.map((item) => ({
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
            isDatabase: true,
            isLeaf: false
          })) ?? [];
        databaseOptionsRef.current = options;
        return options;
      }),
    {
      manual: true
    }
  );

  // 获取表选项
  const getTableOptions = useCallback(
    async (databaseID: string) => {
      if (tableOptionsMapRef.current[databaseID]) {
        return Promise.resolve(tableOptionsMapRef.current[databaseID]);
      }
      setTableLoading(true);

      try {
        const res = await AuthService.AuthListTable({
          database_uid: databaseID,
          ...REQUEST_DEFAULT_PARAMS
        });

        const options =
          res.data.data?.map((item) => ({
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
          })) ?? [];

        tableOptionsMapRef.current[databaseID] = options;
        return options;
      } finally {
        setTableLoading(false);
      }
    },
    [sharedTheme.uiToken.colorPrimary]
  );

  const getOperationPermissionLevel = useCallback(
    (
      permissionId: string,
      level: 'system' | 'database' | 'table',
      dataSource?: IOperation[]
    ) => {
      const scope = (dataSource ?? operationPermissionList)?.find(
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

  // 预加载选中项的数据
  useEffect(() => {
    if (!selectedPermissions?.length || !dbServiceID) return;
    let isEffectActive = true; // 添加标志以防止组件卸载后的更新

    const generateOptionsTree = (
      operations: CustomCascaderOptions[],
      databases: CustomCascaderOptions[],
      tablesMap: Record<string, CustomCascaderOptions[]>
    ) => {
      return operations.map((option) => {
        if (option.isLeaf) return option;

        return {
          ...option,
          children: databases.map((database) => ({
            ...database,
            children: tablesMap[database.value?.toString() ?? ''] ?? []
          }))
        };
      });
    };

    const loadSelectedData = async () => {
      if (!isEffectActive) return;

      // 1. 加载数据库选项
      await getDatabaseOptions();

      // 2. 收集需要加载表数据的数据库ID
      const databaseIds = new Set(
        selectedPermissions.map((path) => path[1]).filter(Boolean)
      );
      // 3. 并行加载所有需要的表数据
      await Promise.all(
        Array.from(databaseIds).map((databaseId) => {
          return getTableOptions(databaseId);
        })
      );

      if (!isEffectActive) return;

      // 4. 使用当前最新的引用更新选项树
      const newOptions = generateOptionsTree(
        operationOptionsRef.current,
        databaseOptionsRef.current,
        tableOptionsMapRef.current
      );
      setOperationPermissionOptions(newOptions);
    };

    loadSelectedData();

    return () => {
      isEffectActive = false;
    };
  }, [selectedPermissions, dbServiceID, getDatabaseOptions, getTableOptions]);

  const loadDataBaseOnPermissionLevel: CascaderProps<CustomCascaderOptions>['loadData'] =
    useCallback(
      async (selectedOptions: CustomCascaderOptions[]) => {
        const targetOption = selectedOptions[selectedOptions.length - 1];
        if (!targetOption.value) return;

        if (targetOption.isDatabase) {
          const tableOptions = await getTableOptions(
            targetOption.value.toString()
          );
          targetOption.children = tableOptions;
        } else {
          const databaseOptions = await getDatabaseOptions();
          targetOption.children = databaseOptions.map((v) => ({
            ...v,
            isLeaf: getOperationPermissionLevel(
              targetOption.value!.toString(),
              'table'
            )
          }));
        }

        setOperationPermissionOptions([...operationPermissionOptions]);
      },
      [
        getDatabaseOptions,
        getOperationPermissionLevel,
        getTableOptions,
        operationPermissionOptions
      ]
    );

  return {
    updateOperationPermission,
    loading: operationLoading || databaseLoading || tableLoading,
    operationPermissionList,
    operationPermissionOptions,
    getOperationPermissionLevel,
    loadDataBaseOnPermissionLevel,
    permissionsDisplayRender
  };
};
export default useOperationPermissionTips;
