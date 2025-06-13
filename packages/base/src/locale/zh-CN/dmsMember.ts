// eslint-disable-next-line import/no-anonymous-default-export
export default {
  pageTitle: '成员与权限管理',
  pageDesc: '您可以在成员与权限管理中添加成员，并配置成员权限',
  memberList: {
    title: '成员列表',
    deleteConfirmTitle: '确定要移除成员:{{name}}?',
    deleteSuccessTips: '移除成员{{name}}成功',
    columns: {
      opRanges: '当前项目权限',
      opRangeTips: '格式：数据源+角色',
      isProjectAdmin: '项目管理员',
      projectManagePermissions: '项目管理权限',
      projects: '所属项目',
      projectsCount: '+{{count}}个项目',
      platformRoles: '平台角色',
      sourceFromMemberGroup: '来源于 成员组{{groupName}}',
      sourceFromDorectPermission: '来源于 直接授权',
      permissions: '权限',
      projectAdmin: '项目管理员',
      partialManagePermissions: '部分管理权限',
      noManagePermissions: '无管理权限'
    },
    allPermission: 'ALL: 拥有对所有数据源的全部操作权限',
    actions: {
      removeMember: '移除',
      manageMemberGroup: '管理成员组'
    }
  },
  addMember: {
    modalTitle: '添加成员',
    successTips: '添加成员{{name}}成功'
  },
  updateMember: {
    modalTitle: '编辑成员',
    successTips: '编辑成员{{name}}成功'
  },
  memberForm: {
    username: '用户名称',
    usernameTips: '需要先在<0>系统设置-用户中心</0>处新增用户',
    isProjectAdmin: '是否为项目管理员',
    projectAdminTips: '项目管理员默认拥有项目下所有管理权限',
    managerSetter: '管理员设置',
    projectManagementPermission: '项目管理权限',
    projectOpPermission: '项目操作权限',
    addProjectOpPermission: '添加项目操作权限'
  },

  roleSelector: {
    role: '平台角色',
    opRange: '操作范围'
  },

  memberGroupList: {
    title: '成员组列表',
    deleteSuccessTips: '删除成员组{{name}}成功',
    deleteConfirmTitle: '确定要删除成员组:{{name}}?',

    columns: {
      userGroupName: '成员组名',
      users: '用户名',
      opRanges: '当前项目权限',
      opRangeTips: '格式：数据源+角色',
      isProjectAdmin: '项目管理员'
    },
    allPermission: 'ALL: 拥有对所有数据源的全部操作权限'
  },
  memberGroupForm: {
    userGroupName: '成员组名',
    users: '用户'
  },
  addMemberGroup: {
    modalTitle: '添加成员组',
    successTips: '添加成员组{{name}}成功'
  },
  updateMemberGroup: {
    modalTitle: '更新成员组',
    successTips: '更新成员组{{name}}成功'
  },
  manageMemberGroup: {
    modalTitle: '管理成员组',
    editPermissions: '编辑权限',
    exitGroup: '退出组',
    exitGroupConfirmTitle: '确定要退出成员组"{{groupName}}"吗？',
    exitGroupSuccess: '已退出成员组: {{name}}',
    emptyGroup: '暂无成员组'
  }
};
