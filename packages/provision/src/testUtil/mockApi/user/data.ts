import { IGetUserOpPermissionReply } from '@actiontech/shared/lib/api/base/service/common';
import {
  OpPermissionItemRangeTypeEnum,
  OpPermissionItemOpPermissionTypeEnum
} from '@actiontech/shared/lib/api/base/service/common.enum';

export const userOperationPermissionMockData: IGetUserOpPermissionReply['data'] =
  {
    is_admin: true,
    op_permission_list: [
      {
        range_uids: ['700300'],
        range_type: OpPermissionItemRangeTypeEnum.project,
        op_permission_type: OpPermissionItemOpPermissionTypeEnum.project_admin
      }
    ]
  };
