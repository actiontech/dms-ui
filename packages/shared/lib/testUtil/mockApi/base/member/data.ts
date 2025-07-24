import {
  IListMemberGroup,
  IListMember,
  IListOpPermission
} from '../../../../api/base/service/common';
import {
  ListMemberRoleWithOpRangeOpRangeTypeEnum,
  ListOpPermissionRangeTypeEnum
} from '../../../../api/base/service/common.enum';

export const memberList: IListMember[] = [
  {
    is_project_admin: true,
    role_with_op_ranges: [],
    uid: '700501',
    user: {
      uid: '700001',
      name: 'admin'
    },
    is_group_member: false,
    current_project_admin: {
      is_admin: true,
      member_groups: []
    }
  },
  {
    uid: '700502',
    user: {
      uid: '11132422',
      name: 'test'
    },
    is_project_admin: false,
    is_group_member: true,
    current_project_admin: {
      is_admin: true,
      member_groups: ['group1', 'group2']
    },
    current_project_op_permissions: [
      {
        data_source: 'oracle-test',
        roles: [
          {
            uid: '700403',
            name: '开发工程师',
            op_permissions: [
              {
                uid: '700003',
                name: '创建/编辑工单'
              },
              {
                uid: '700010',
                name: 'SQL工作台查询'
              },
              {
                uid: '700015',
                name: '配置流水线'
              }
            ],
            member_group: {
              name: 'test',
              uid: '1930507995565789184',
              users: [
                {
                  uid: '20250604112007136',
                  name: 'test'
                },
                {
                  uid: '20250604132036026',
                  name: 'test-1'
                }
              ],
              op_permissions: [
                {
                  uid: '700003',
                  name: '创建/编辑工单'
                },
                {
                  uid: '700010',
                  name: 'SQL工作台查询'
                },
                {
                  uid: '700015',
                  name: '配置流水线'
                }
              ]
            }
          },
          {
            uid: '700405',
            name: '运维工程师',
            op_permissions: [
              {
                uid: '700005',
                name: '授权数据源数据权限'
              },
              {
                uid: '700006',
                name: '上线工单'
              },
              {
                uid: '700007',
                name: '查看他人创建的工单'
              },
              {
                uid: '700008',
                name: '查看他人创建的扫描任务'
              },
              {
                uid: '700009',
                name: '创建/编辑扫描任务'
              },
              {
                uid: '700012',
                name: '创建数据导出任务'
              }
            ]
          }
        ]
      },
      {
        data_source: 'mysql-test',
        roles: [
          {
            uid: '700403',
            name: '开发工程师',
            op_permissions: [
              {
                uid: '700003',
                name: '创建/编辑工单'
              },
              {
                uid: '700010',
                name: 'SQL工作台查询'
              },
              {
                uid: '700015',
                name: '配置流水线'
              }
            ]
          }
        ]
      }
    ],
    current_project_manage_permissions: [
      {
        uid: '700003',
        name: '数据源管理',
        member_group: 'group1'
      },
      {
        uid: '700010',
        name: '成员管理'
      },
      {
        uid: '700015',
        name: '审批流程管理'
      }
    ],
    platform_roles: [
      {
        uid: '700018',
        name: '普通用户'
      }
    ],
    projects: ['default']
  },
  {
    uid: '700503',
    user: {
      uid: '20250604112007137',
      name: 'test-2'
    },
    is_project_admin: false,
    is_group_member: false,
    current_project_op_permissions: [
      {
        data_source: 'mysql-test',
        roles: [
          {
            uid: '700403',
            name: '开发工程师',
            op_permissions: [
              {
                uid: '700003',
                name: '创建/编辑工单'
              },
              {
                uid: '700010',
                name: 'SQL工作台查询'
              },
              {
                uid: '700015',
                name: '配置流水线'
              }
            ]
          }
        ]
      }
    ],
    platform_roles: [
      {
        uid: '700018',
        name: '普通用户'
      }
    ],
    projects: ['default']
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
    ],
    current_project_op_permissions: [
      {
        data_source: 'oracle-test',
        roles: [
          {
            uid: '700403',
            name: '开发工程师',
            op_permissions: [
              {
                uid: '700003',
                name: '创建/编辑工单'
              },
              {
                uid: '700010',
                name: 'SQL工作台查询'
              },
              {
                uid: '700015',
                name: '配置流水线'
              }
            ]
          },
          {
            uid: '700405',
            name: '运维工程师',
            op_permissions: [
              {
                uid: '700005',
                name: '授权数据源数据权限'
              },
              {
                uid: '700006',
                name: '上线工单'
              },
              {
                uid: '700007',
                name: '查看他人创建的工单'
              },
              {
                uid: '700008',
                name: '查看他人创建的扫描任务'
              }
            ]
          }
        ]
      },
      {
        data_source: 'mysql-test',
        roles: [
          {
            uid: '700403',
            name: '开发工程师',
            op_permissions: [
              {
                uid: '700003',
                name: '创建/编辑工单'
              }
            ]
          }
        ]
      }
    ],
    current_project_manage_permissions: [
      {
        uid: '700003',
        name: '数据源管理'
      },
      {
        uid: '700010',
        name: '成员管理'
      }
    ]
  },
  {
    name: 'member-group9',
    role_with_op_ranges: [
      {
        op_range_type: ListMemberRoleWithOpRangeOpRangeTypeEnum.db_service,
        range_uids: [
          { uid: '70121', name: 'Range14' },
          { uid: '70211', name: 'Range25' }
        ],
        role_uid: { uid: '5005', name: 'Role12' }
      }
    ],
    uid: '10029385'
  }
];

export const memberProjectPermissions: IListOpPermission[] = [
  {
    op_permission: { name: '创建项目', uid: '700001' },
    description: '创建项目权限',
    range_type: ListOpPermissionRangeTypeEnum.project,
    module: '项目管理'
  },
  {
    op_permission: { name: '数据源管理', uid: '700003' },
    description: '数据源管理权限',
    range_type: ListOpPermissionRangeTypeEnum.project,
    module: '项目管理'
  },
  {
    op_permission: { name: '成员管理', uid: '700010' },
    description: '成员管理权限',
    range_type: ListOpPermissionRangeTypeEnum.project,
    module: '项目管理'
  },
  {
    op_permission: { name: '审批流程管理', uid: '700015' },
    description: '审批流程管理权限',
    range_type: ListOpPermissionRangeTypeEnum.project,
    module: '项目管理'
  },
  {
    op_permission: { name: '修改项目', uid: '20100' },
    description: '修改项目权限',
    range_type: ListOpPermissionRangeTypeEnum.project,
    module: '项目管理'
  },
  {
    op_permission: { name: '删除项目', uid: '20150' },
    description: '删除项目权限',
    range_type: ListOpPermissionRangeTypeEnum.project,
    module: '项目管理'
  }
];
