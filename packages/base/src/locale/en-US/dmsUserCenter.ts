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
        authenticationType: 'User authentication type'
      }
    },
    userForm: {
      username: 'Username',
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
        'When the user is disabled, the user will not be able to log in'
    },
    createUser: {
      createSuccessTips: 'Add user "{{name}}" successfully'
    },
    updateUser: {
      title: 'Edit user',
      updateSuccessTips: 'Edit user "{{name}}" successfully'
    },
    deleteUser: {
      confirmTitle: 'Confirm to delete user: "{{username}}"?',
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
      }
    },
    roleForm: {
      name: 'Role name',
      desc: 'Description',
      opPermissions: 'Operation permissions',
      isDisabled: 'Disabled'
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
    opPermissionList: {
      title: 'Operation permission list',
      columns: {
        name: 'Operation permission name',
        range: 'Operation scope granularity',
        desc: 'Description'
      },
      rangeTypeDictionary: {
        global: 'Global',
        project: 'Project',
        dbService: 'DB instance'
      }
    }
  }
};
