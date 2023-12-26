export const userScopeData = [
  {
    group: '用户',
    scope_desc: '更新任何用户的密码',
    scope_name: 'auth.UpdatePassword'
  },
  {
    group: '权限',
    scope_desc: '访问操作权限列表',
    scope_name: 'auth.ListScopes'
  },
  {
    group: '服务器',
    scope_desc: '添加服务器',
    scope_name: 'server.AddServer'
  }
];

export const userListData = [
  {
    role_id: '10000',
    role_name: 'admin',
    user_id: '1735126052121870336',
    username: 'admin'
  },
  {
    role_id: '10000',
    role_name: 'admin',
    user_id: '1735126216567947264',
    username: 'test'
  }
];

export const roleListData = [
  {
    id: '10000',
    role_desc: 'administrator role has unlimited privileges',
    role_name: 'admin',
    scopes: [
      {
        scope_desc: '更新任何用户的密码',
        scope_name: 'auth.UpdatePassword'
      },
      {
        scope_desc: '访问操作权限列表',
        scope_name: 'auth.ListScopes'
      },
      {
        scope_desc: '添加服务器',
        scope_name: 'server.AddServer'
      },
      {
        scope_desc: '删除服务器',
        scope_name: 'server.DeleteServer'
      }
    ]
  },
  {
    id: '1735188490427039744',
    role_desc: 'test role',
    role_name: 'test',
    scopes: [
      {
        scope_desc: '更新任何用户的密码',
        scope_name: 'auth.UpdatePassword'
      },
      {
        scope_desc: '访问操作权限列表',
        scope_name: 'auth.ListScopes'
      }
    ]
  }
];
