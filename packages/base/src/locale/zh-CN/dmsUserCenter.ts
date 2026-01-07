// eslint-disable-next-line import/no-anonymous-default-export
export default {
  pageTitle: '用户中心',
  pageDesc: '您可以在用户中心管理平台用户、用户组，并配置平台角色权限。',
  tabTitleUser: '用户管理',
  tabTitleRole: '角色管理',

  user: {
    userList: {
      title: '用户列表',
      addUserButton: '添加用户',
      columns: {
        status: '状态',
        authenticationType: '用户认证类型',
        platformRoles: '平台角色',
        projects: '所属项目',
        projectsCount: '+{{count}}个项目'
      },
      normal: '正常',
      disabled: '被禁用',
      searchPlaceholder: '输入ID/用户名/邮箱/手机号关键字搜索'
    },
    userForm: {
      username: '用户名',
      needUpdatePassWord: '是否需要更新密码',
      passwordConfirm: '确认密码',
      passwordConfirmPlaceholder: '请保持两次密码输入一致',
      email: '邮箱',
      phone: '手机',
      wxid: '微信ID',
      userGroups: '所属用户组',
      opPermissions: '平台角色',
      isDisabled: '是否禁用',
      disabledTips: '当用户被禁用，该用户将无法登录'
    },
    createUser: {
      createSuccessTips: '添加用户 "{{name}}" 成功'
    },
    updateUser: {
      title: '编辑用户',
      updateSuccessTips: '编辑用户 "{{name}}" 成功'
    },
    deleteUser: {
      confirmTitle:
        '当前用户 "{{username}}" 存在于项目「{{projects}}」中，是否确认删除？',
      deleting: '正在删除用户: "{{username}}..."',
      deleteSuccess: '删除用户 "{{username}}" 成功'
    },
    userGroupList: {
      title: '用户组列表',
      addUserGroupButton: '添加用户组'
    },
    userGroupForm: {
      name: '用户组名称',
      desc: '描述',
      bindUsers: '绑定用户',
      isDisabled: '是否禁用',
      isDisabledTips:
        '当用户组被禁用，组内用户不会被禁用，但会失去该用户组所关联的数据源及对应角色权限'
    },
    createUserGroup: {
      title: '添加用户组',
      successTips: '添加用户组 "{{name}}" 成功'
    },
    updateUserGroup: {
      title: '编辑用户组',
      successTips: '编辑用户组 "{{name}}" 成功'
    },
    deleteUserGroup: {
      confirm: '确认要删除用户组: "{{name}}"？',
      deleting: '正在删除用户组: "{{name}}"...',
      deleteSuccess: '删除用户组: "{{name}}"成功'
    }
  },
  role: {
    roleList: {
      title: '角色列表',
      columns: {
        opPermissions: '平台操作权限'
      }
    },
    roleForm: {
      name: '角色名',
      desc: '描述',
      opPermissions: '操作权限',
      isDisabled: '是否禁用'
    },
    createRole: {
      button: '添加角色',
      modalTitle: '添加角色',
      createSuccessTips: '添加角色 "{{name}}" 成功'
    },

    updateRole: {
      modalTitle: '编辑角色',
      updateSuccessTips: '编辑角色 "{{name}}" 成功'
    },

    deleteRole: {
      deleteTips: '确认要删除角色 "{{name}}"?',
      deleting: '正在删除角色 "{{name}}"...',
      deleteSuccessTips: '删除角色 "{{name}}" 成功'
    },
    opPermissionList: {
      title: '操作权限列表',
      columns: {
        name: '操作权限名称',
        range: '操作范围粒度',
        desc: '描述'
      },
      rangeTypeDictionary: {
        global: '全局',
        project: '项目',
        dbService: '数据源'
      }
    }
  }
};
