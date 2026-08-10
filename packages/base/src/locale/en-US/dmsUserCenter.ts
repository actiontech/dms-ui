// eslint-disable-next-line import/no-anonymous-default-export
export default {
  pageTitle: 'User center',
  pageDesc:
    'You can manage platform users, user groups in user center, and configure platform role permissions.',
  tabTitleUser: 'User management',
  tabTitleRole: 'Role management',
  user: {
    userList: {
      title: 'User list',
      addUserButton: 'Add user',
      columns: {
        status: 'Status',
        authenticationType: 'User authentication type',
        platformRoles: 'Platform Roles',
        projects: 'Projects',
        projectsCount: '+{{count}} projects'
      },
      normal: 'Active',
      disabled: 'Disabled',
      searchPlaceholder: 'Search by ID, username, email, or phone number'
    },
    userForm: {
      username: 'Username',
      usernameNoSpaces: 'Username cannot have leading or trailing spaces',
      needUpdatePassWord: 'Need update password',
      passwordConfirm: 'Confirm password',
      passwordConfirmPlaceholder:
        'Please keep the two password inputs consistent',
      email: 'Email',
      phone: 'Phone',
      wxid: 'Wechat id',
      userGroups: 'User group',
      opPermissions: 'Platform management permissions',
      isDisabled: 'Disabled',
      disabledTips:
        'When the user is disabled, the user will not be able to log in',
      businessWritePermission: 'Business write permission',
      businessWritePermissionDesc:
        'When disabled, this account retains only resource configuration and read-only access, and will no longer participate in business writes or notifications.'
    },
    createUser: {
      createSuccessTips: 'Add user "{{name}}" successfully'
    },
    updateUser: {
      title: 'Edit user',
      updateSuccessTips: 'Edit user "{{name}}" successfully'
    },
    deleteUser: {
      confirmTitle:
        'User "{{username}}" exists in project(s) "{{projects}}". Confirm delete?',
      deleting: 'Deleting user: "{{username}}..."',
      deleteSuccess: 'Delete user "{{username}}" successfully'
    },
    userGroupList: {
      title: 'User group list',
      addUserGroupButton: 'Add user group'
    },
    userGroupForm: {
      name: 'User group name',
      desc: 'Description',
      bindUsers: 'Bind users',
      isDisabled: 'Disabled',
      isDisabledTips:
        'When the user group is disabled, users in the group will not be disabled, but will lose the data source and corresponding role permissions associated with the user group'
    },
    createUserGroup: {
      title: 'Add user group',
      successTips: 'Add user group "{{name}}" successfully'
    },
    updateUserGroup: {
      title: 'Edit user group',
      successTips: 'Edit user group "{{name}}" successfully'
    },
    deleteUserGroup: {
      confirm: 'Confirm to delete user group: "{{name}}"?',
      deleting: 'Deleting user group: "{{name}}"...',
      deleteSuccess: 'Delete user group: "{{name}}" successfully'
    }
  },
  role: {
    roleList: {
      title: 'Role list',
      columns: {
        opPermissions: 'Platform operation permissions'
      },
      normal: 'Active',
      disabled: 'Disabled',
      searchPlaceholder: 'Search by operation permission keyword'
    },
    roleForm: {
      name: 'Role name',
      nameAlert: 'Cloning from role "{{name}}". Please change the role name.',
      desc: 'Description',
      opPermissions: 'Operation permissions',
      isDisabled: 'Disabled',
      viewAll: 'View All'
    },
    createRole: {
      button: 'Add role',
      modalTitle: 'Add role',
      createSuccessTips: 'Add role "{{name}}" successfully'
    },
    updateRole: {
      modalTitle: 'Edit role',
      updateSuccessTips: 'Edit role "{{name}}" successfully'
    },
    deleteRole: {
      deleteTips: 'Confirm to delete role "{{name}}"?',
      deleting: 'Deleting role "{{name}}"...',
      deleteSuccessTips: 'Delete role "{{name}}" successfully'
    },
    cloneRole: {
      button: 'Clone',
      modalTitle: 'Clone Role',
      createSuccessTips: 'Role "{{name}}" cloned successfully'
    },
    opPermissionList: {
      title: 'Operation permission list',
      columns: {
        name: 'Operation permission name',
        range: 'Operation scope granularity',
        desc: 'Description',
        module: 'Module'
      },
      rangeTypeDictionary: {
        global: 'Global',
        project: 'Project',
        dbService: 'DB instance'
      }
    }
  }
};
