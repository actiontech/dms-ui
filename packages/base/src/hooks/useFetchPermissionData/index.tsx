import { useRequest } from 'ahooks';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  updateModuleFeatureSupport,
  updateUserOperationPermissions
} from '../../store/permission';
import systemService from '@actiontech/shared/lib/api/sqle/service/system';
import { getSystemModuleStatusModuleNameEnum } from '@actiontech/shared/lib/api/sqle/service/system/index.enum';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import UserService from '@actiontech/shared/lib/api/base/service/User';

const useFetchPermissionData = () => {
  const dispatch = useDispatch();
  const [isFeatureSupportFetched, setIsFeatureSupportFetched] = useState(false);
  const [isUserPermissionsFetched, setIsUserPermissionsFetched] =
    useState(false);

  const { loading: isUserPermissionsLoading, run: fetchUserPermissions } =
    useRequest(
      (projectId: string, userId: string) =>
        UserService.GetUserOpPermission({
          user_uid: userId,
          project_uid: projectId
        }).then((response) => {
          if (response.data.code === ResponseCode.SUCCESS) {
            dispatch(updateUserOperationPermissions(response.data.data));
          }
        }),
      {
        manual: true,
        onFinally: () => {
          setIsUserPermissionsFetched(true);
        }
      }
    );

  const { loading: isModuleStatusLoading, run: fetchModuleSupportStatus } =
    useRequest(
      () => {
        // TODO: Adjust the interface to get support status for all modules.
        return systemService.getSystemModuleStatus({
          module_name: getSystemModuleStatusModuleNameEnum.sql_optimization
        });
      },
      {
        onSuccess: (response) => {
          if (response.data.code === ResponseCode.SUCCESS) {
            dispatch(
              updateModuleFeatureSupport({
                sqlOptimization: !!response.data.data?.is_supported
              })
            );
          }
        },
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
