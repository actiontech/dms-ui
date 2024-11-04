import { useRequest } from 'ahooks';
import { useState } from 'react';
import systemService from '@actiontech/shared/lib/api/sqle/service/system';
import { getSystemModuleStatusModuleNameEnum } from '@actiontech/shared/lib/api/sqle/service/system/index.enum';
import UserService from '@actiontech/shared/lib/api/base/service/User';

const useFetchPermissionData = () => {
  const [isFeatureSupportFetched, setIsFeatureSupportFetched] = useState(false);
  const [isUserPermissionsFetched, setIsUserPermissionsFetched] =
    useState(false);

  const { loading: isUserPermissionsLoading, runAsync: fetchUserPermissions } =
    useRequest(
      (projectId: string, userId: string) =>
        UserService.GetUserOpPermission({
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
      () => {
        // TODO: Adjust the interface to get support status for all modules.
        return systemService.getSystemModuleStatus({
          module_name: getSystemModuleStatusModuleNameEnum.sql_optimization
        });
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
