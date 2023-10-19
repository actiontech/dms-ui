import { ListMemberRoleWithOpRangeOpRangeTypeEnum } from '@actiontech/shared/lib/api/base/service/common.enum';

export const memberList = [
  {
    is_project_admin: true,
    role_with_op_ranges: [],
    uid: '700501',
    user: {
      uid: '700001',
      name: 'admin'
    }
  },
  {
    is_project_admin: false,
    role_with_op_ranges: [
      {
        op_range_type: ListMemberRoleWithOpRangeOpRangeTypeEnum.db_service,
        range_uids: [
          { uid: '701', name: 'Range1' },
          { uid: '702', name: 'Range2' }
        ],
        role_uid: { uid: '5001', name: 'Role1' }
      }
    ],
    uid: '10029384',
    user: {
      uid: '100283',
      name: 'test1'
    }
  },
  {
    role_with_op_ranges: [],
    uid: '10129331',
    user: {
      uid: '102393',
      name: 'test2'
    }
  }
];
