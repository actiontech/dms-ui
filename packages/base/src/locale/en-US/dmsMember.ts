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
      isProjectAdmin: 'Project admin',
      projectManagePermissions: 'Current Project Management Permissions',
      projects: 'Projects',
      projectsCount: '+{{count}} projects',
      platformRoles: 'Platform Roles',
      sourceFromMemberGroup: 'From member group {{groupName}}',
      sourceFromDorectPermission: 'From direct authorization',
      permissions: 'Permissions',
      projectAdmin: 'Project Admin',
      partialManagePermissions: 'Partial Management Permissions',
      noManagePermissions: 'No Management Permissions'
    },
    allPermission: 'ALL: have full operation permissions on all DB instances',
    actions: {
      removeMember: 'Remove',
      manageMemberGroup: 'Manage Member Groups'
    }
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
    isProjectAdmin: 'Project management permission',
    projectAdminTips:
      'Project admins have all management permissions in the project by default',
    managerSetter: 'Admin Settings',
    projectManagementPermission: 'Project Management Permissions',
    projectOpPermission: 'Project Operation Permissions',
    addProjectOpPermission: 'Add Project Operation Permission'
  },
  roleSelector: {
    role: 'Platform role',
    opRange: 'Operation range'
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
  },
  manageMemberGroup: {
    modalTitle: 'Manage Member Groups',
    editPermissions: 'Edit Permissions',
    exitGroup: 'Leave Group',
    exitGroupConfirmTitle:
      'Are you sure you want to leave member group "{{groupName}}"?',
    exitGroupSuccess: 'Left member group: {{name}}',
    emptyGroup: 'No member groups'
  }
};
