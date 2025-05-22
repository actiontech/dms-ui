import {
  IListUser,
  IListUserGroup,
  IListOpPermission,
  IListRole,
  IListMemberTipsItem,
  IGetUserOpPermissionReply
} from '../../../../api/base/service/common';
import {
  ListUserStatEnum,
  ListUserAuthenticationTypeEnum,
  ListUserGroupStatEnum,
  ListOpPermissionRangeTypeEnum,
  ListRoleStatEnum,
  OpPermissionItemOpPermissionTypeEnum,
  OpPermissionItemRangeTypeEnum
} from '../../../../api/base/service/common.enum';

export const userList: IListUser[] = [
  {
    uid: '11132422',
    name: 'test',
    stat: ListUserStatEnum.正常,
    authentication_type: ListUserAuthenticationTypeEnum.dms,
    email: '',
    phone: '',
    wxid: '',
    op_permissions: [
      {
        name: '创建项目',
        uid: '700001'
      }
    ],
    projects: ['default']
  },
  {
    uid: '1647895752866795520',
    name: 'test666',
    stat: ListUserStatEnum.被禁用,
    authentication_type: ListUserAuthenticationTypeEnum.dms,
    email: '',
    phone: '',
    wxid: '',
    op_permissions: [],
    projects: []
  },
  {
    uid: '700200',
    name: 'admin',
    stat: ListUserStatEnum.正常,
    authentication_type: ListUserAuthenticationTypeEnum.dms,
    email: '',
    phone: '',
    wxid: '',
    projects: ['test-project', 'default', 'test-project-2']
  },
  {
    uid: '7002001',
    name: 'global-view',
    stat: ListUserStatEnum.正常,
    authentication_type: ListUserAuthenticationTypeEnum.dms,
    email: '',
    phone: '',
    wxid: '',
    op_permissions: [{ uid: '700016', name: '全局浏览' }]
  },
  {
    uid: '7002002',
    name: 'global-management',
    stat: ListUserStatEnum.正常,
    authentication_type: ListUserAuthenticationTypeEnum.dms,
    email: '',
    phone: '',
    wxid: '',
    op_permissions: [{ uid: '700017', name: '全局管理' }]
  }
];

export const userGroupList: IListUserGroup[] = [
  {
    desc: 'group1 desc',
    name: 'group1',
    uid: '1453',
    stat: ListUserGroupStatEnum.正常,
    users: [{ name: 'test user1', uid: '1111' }]
  },
  {
    desc: 'group2 desc',
    name: 'group2',
    uid: '222',
    stat: ListUserGroupStatEnum.正常,
    users: []
  }
];

export const opPermissionList: IListOpPermission[] = [
  {
    op_permission: { name: '创建项目', uid: '700001' },
    description: '',
    range_type: ListOpPermissionRangeTypeEnum.db_service
  },
  {
    op_permission: { name: '创建项目', uid: '20100' },
    description: ''
  },
  {
    op_permission: { name: '修改项目', uid: '20150' },
    description: '',
    range_type: ListOpPermissionRangeTypeEnum.db_service
  }
];

export const roleList: IListRole[] = [
  {
    name: 'test role 1',
    desc: 'Test role 1',
    uid: '1001',
    stat: ListRoleStatEnum.正常,
    op_permissions: [
      {
        name: 'test1',
        uid: '1234'
      }
    ]
  },
  {
    name: 'test role 2',
    desc: 'Test role 2',
    uid: '1002',
    stat: ListRoleStatEnum.被禁用,
    op_permissions: []
  },
  {
    name: 'default role',
    desc: 'Test default role',
    uid: '7001',
    stat: ListRoleStatEnum.正常
  }
];

export const memberTips: IListMemberTipsItem[] = [
  {
    user_id: '1',
    user_name: 'a1'
  },
  {
    user_id: '2',
    user_name: 'a2'
  }
];

export const userOpPermissionMockData: IGetUserOpPermissionReply['data'] = {
  is_admin: true,
  op_permission_list: [
    {
      op_permission_type: OpPermissionItemOpPermissionTypeEnum.audit_workflow,
      range_type: OpPermissionItemRangeTypeEnum.db_service,
      range_uids: ['1234']
    }
  ]
};
