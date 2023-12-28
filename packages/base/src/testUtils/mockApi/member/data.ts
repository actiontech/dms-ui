import { IListMemberGroup } from '@actiontech/shared/lib/api/base/service/common';
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
  },
  {
    is_project_admin: false,
    role_with_op_ranges: [
      {
        op_range_type: ListMemberRoleWithOpRangeOpRangeTypeEnum.db_service,
        range_uids: [{ uid: '123123', name: 'mysql-1' }],
        role_uid: { uid: '1001', name: 'test role 1' }
      }
    ],
    uid: '10029389',
    user: {
      uid: '11132422',
      name: 'test'
    }
  }
];

export const memberGroupList: IListMemberGroup[] = [
  {
    is_project_admin: true,
    name: 'member-group1',
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
    users: [
      {
        uid: '100283',
        name: 'test1'
      },
      {
        uid: '102393',
        name: 'test2'
      }
    ]
  },
  {
    is_project_admin: false,
    name: 'member-group2',

    role_with_op_ranges: [
      {
        op_range_type: ListMemberRoleWithOpRangeOpRangeTypeEnum.db_service,
        range_uids: [
          { uid: '701', name: 'Range1' },
          { uid: '702', name: 'Range2' }
        ],
        role_uid: { uid: '5002', name: 'Role2' }
      }
    ],
    uid: '10039482',
    users: [
      { uid: '138291', name: 'test3' },
      { uid: '138214', name: 'test4' }
    ]
  },
  {
    is_project_admin: false,
    name: 'member-group3',

    role_with_op_ranges: [
      {
        op_range_type: ListMemberRoleWithOpRangeOpRangeTypeEnum.db_service,
        range_uids: [{ uid: '123123', name: 'mysql-1' }],
        role_uid: { uid: '1001', name: 'test role 1' }
      }
    ],
    uid: '10039483',
    users: [
      {
        uid: '11132422',
        name: 'test'
      },
      { uid: '1647895752866795520', name: 'test666' }
    ]
  }
];
