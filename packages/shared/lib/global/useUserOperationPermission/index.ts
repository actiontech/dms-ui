import { useRequest } from 'ahooks';
import { useCallback } from 'react';
import useCurrentUser from '../useCurrentUser';
import useCurrentProject from '../useCurrentProject';
import User from '../../api/base/service/User';
import { ResponseCode } from '../../enum';
import {
  OpPermissionItemOpPermissionTypeEnum,
  OpPermissionItemRangeTypeEnum
} from '../../api/base/service/common.enum';

// todo 后续需要整合下获取权限相关数据的 hooks，统一移动至 App.tsx， 存放在 redux 中。
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
      manual: true,
      ready: !!projectID
    }
  );

  const isHaveServicePermission = useCallback(
    (
      opPermissionType: OpPermissionItemOpPermissionTypeEnum,
      serviceID?: string
    ) => {
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
            permission.op_permission_type === opPermissionType
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
