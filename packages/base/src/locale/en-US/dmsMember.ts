// eslint-disable-next-line import/no-anonymous-default-export
export default {
  pageTitle: 'Members',
  pageDesc: 'You can add members and configure member permissions in members',
  memberList: {
    title: 'Member list',
    deleteConfirmTitle: 'Confirm to delete member: {{name}}?',
    deleteSuccessTips: 'Delete member {{name}} successfully',
    columns: {
      opRanges: 'Platform operation permissions',
      opRangeTips: 'Format role: [operation range 11, operation range 2 ...]',
      isProjectAdmin: 'Project admin'
    },
    allPermission: 'ALL: have full operation permissions on all DB instances'
  },
  addMember: {
    modalTitle: 'Add member',
    successTips: 'Add member {{name}} successfully'
  },
  updateMember: {
    modalTitle: 'Edit member',
    successTips: 'Edit member {{name}} successfully'
  },
  memberForm: {
    username: 'Username',
    usernameTips:
      'Need to add users in <0>system settings-user center</0> first',
    isProjectAdmin: 'Project management permission'
  },

  roleSelector: {
    role: 'Platform role',
    opRange: 'Operation range',
    addRoleAndOpRange: 'Add platform role and operation range'
  },

  memberGroupList: {
    title: 'Member group list',
    deleteSuccessTips: 'Delete member group {{name}} successfully',
    deleteConfirmTitle: 'Confirm to delete member group: {{name}}?',

    columns: {
      userGroupName: 'Member group name',
      users: 'Username',
      opRanges: 'Platform operation permissions',
      opRangeTips: 'Format role: [operation range 11, operation range 2 ...]',
      isProjectAdmin: 'Project admin'
    },
    allPermission: 'ALL: have full operation permissions on all DB instances'
  },
  memberGroupForm: {
    userGroupName: 'Member group name',
    users: 'Users'
  },
  addMemberGroup: {
    modalTitle: 'Add member group',
    successTips: 'Add member group {{name}} successfully'
  },
  updateMemberGroup: {
    modalTitle: 'Update member group',
    successTips: 'Update member group {{name}} successfully'
  }
};
