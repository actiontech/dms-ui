import { useRequest } from 'ahooks';
import { useState } from 'react';
import { getSystemModuleStatusModuleNameEnum } from '@actiontech/shared/lib/api/sqle/service/system/index.enum';
import { DmsApi, SqleApi } from '@actiontech/shared/lib/api';

const REQUIRED_MODULES = [
  getSystemModuleStatusModuleNameEnum.sql_optimization,
  getSystemModuleStatusModuleNameEnum.knowledge_base
] as const;

const useFetchPermissionData = () => {
  const [isFeatureSupportFetched, setIsFeatureSupportFetched] = useState(false);
  const [isUserPermissionsFetched, setIsUserPermissionsFetched] =
    useState(false);

  const { loading: isUserPermissionsLoading, runAsync: fetchUserPermissions } =
    useRequest(
      (projectId: string, userId: string) =>
        DmsApi.UserService.GetUserOpPermission({
          user_uid: userId,
          project_uid: projectId
        }),
      {
        manual: true,
        onFinally: () => {
          setIsUserPermissionsFetched(true);
        }
      }
    );

  const { loading: isModuleStatusLoading, runAsync: fetchModuleSupportStatus } =
    useRequest(
      async () => {
        // todo 临时处理方案，等待后续后端接口调整
        const requests = REQUIRED_MODULES.map((moduleName) =>
          SqleApi.SystemService.getSystemModuleStatus({
            module_name: moduleName
          })
        );

        const results = await Promise.all(requests);
        return results.reduce((acc, curr, index) => {
          acc[REQUIRED_MODULES[index]] = curr.data?.data?.is_supported ?? false;
          return acc;
        }, {} as Record<getSystemModuleStatusModuleNameEnum, boolean>);
      },
      {
        onFinally: () => {
          setIsFeatureSupportFetched(true);
        },
        manual: true
      }
    );
  return {
    isModuleStatusLoading,
    fetchModuleSupportStatus,
    isFeatureSupportFetched,
    isUserPermissionsLoading,
    isUserPermissionsFetched,
    fetchUserPermissions
  };
};

export default useFetchPermissionData;
