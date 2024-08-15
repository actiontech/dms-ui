import User from '@actiontech/shared/lib/api/base/service/User';
import {
  OpPermissionItemRangeTypeEnum,
  OpPermissionItemOpPermissionTypeEnum
} from '@actiontech/shared/lib/api/base/service/common.enum';
import {
  useCurrentUser,
  useCurrentProject
} from '@actiontech/shared/lib/global';
import { useRequest } from 'ahooks';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { useCallback } from 'react';

const useUserOperationPermission = () => {
  const { uid } = useCurrentUser();

  const { projectID } = useCurrentProject();

  const {
    data: userOperationPermission,
    loading,
    run: updateUserOperationPermission
  } = useRequest(
    () =>
      User.GetUserOpPermission({ user_uid: uid, project_uid: projectID }).then(
        (res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            return res.data.data;
          }
        }
      ),
    {
      manual: true
    }
  );

  const isHaveServicePermission = useCallback(
    (serviceID?: string) => {
      if (userOperationPermission) {
        const { is_admin, op_permission_list } = userOperationPermission;
        const haveProjectPermission = op_permission_list?.some((permission) => {
          if (
            permission.range_type === OpPermissionItemRangeTypeEnum.project &&
            permission.range_uids?.includes(projectID) &&
            permission.op_permission_type ===
              OpPermissionItemOpPermissionTypeEnum.project_admin
          ) {
            return true;
          }
          return false;
        });

        const haveServicePermission = op_permission_list?.some((permission) => {
          if (
            permission.range_type ===
              OpPermissionItemRangeTypeEnum.db_service &&
            (serviceID
              ? permission.range_uids?.includes(serviceID)
              : !!permission.range_uids?.length) &&
            permission.op_permission_type ===
              OpPermissionItemOpPermissionTypeEnum.auth_db_service_data
          ) {
            return true;
          }
          return false;
        });

        if (is_admin || haveProjectPermission || haveServicePermission) {
          return true;
        }

        return false;
      }
      return false;
    },
    [userOperationPermission, projectID]
  );

  return {
    userOperationPermission,
    loading,
    updateUserOperationPermission,
    isHaveServicePermission
  };
};

export default useUserOperationPermission;
