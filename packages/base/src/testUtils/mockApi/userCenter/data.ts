import {
  IListUser,
  IListUserGroup,
  IListOpPermission,
  IListRole
} from '@actiontech/shared/lib/api/base/service/common';
import {
  ListUserStatEnum,
  ListUserAuthenticationTypeEnum,
  ListUserGroupStatEnum,
  ListOpPermissionRangeTypeEnum,
  ListRoleStatEnum
} from '@actiontech/shared/lib/api/base/service/common.enum';

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
    ]
  },
  {
    uid: '1647895752866795520',
    name: 'test666',
    stat: ListUserStatEnum.被禁用,
    authentication_type: ListUserAuthenticationTypeEnum.dms,
    email: '',
    phone: '',
    wxid: '',
    op_permissions: []
  },
  {
    uid: '700200',
    name: 'admin',
    stat: ListUserStatEnum.正常,
    authentication_type: ListUserAuthenticationTypeEnum.dms,
    email: '',
    phone: '',
    wxid: '',
    op_permissions: []
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
    description: '',
    range_type: ListOpPermissionRangeTypeEnum.db_service
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
    op_permissions: []
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
