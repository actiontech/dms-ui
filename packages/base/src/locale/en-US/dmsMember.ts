// eslint-disable-next-line import/no-anonymous-default-export
export default {
  pageTitle: '成员与权限管理',
  pageDesc: '您可以在成员与权限管理中添加成员，并配置成员权限',
  memberList: {
    title: '成员列表',
    deleteConfirmTitle: '确定要删除成员:{{name}}?',
    deleteSuccessTips: '删除成员{{name}}成功',
    columns: {
      opRanges: '平台操作权限',
      opRangeTips: '格式 角色: [操作范围11,操作范围2 ...]',
      isProjectAdmin: '项目管理员'
    },
    allPermission: 'ALL: 拥有对所有数据源的全部操作权限'
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
    isProjectAdmin: '项目管理权限'
  },

  roleSelector: {
    role: '平台角色',
    opRange: '操作范围',
    addRoleAndOpRange: '添加平台角色与操作范围'
  },

  memberGroupList: {
    title: '成员组列表',
    deleteSuccessTips: '删除成员组{{name}}成功',
    deleteConfirmTitle: '确定要删除成员组:{{name}}?',

    columns: {
      userGroupName: '成员组名',
      users: '用户名',
      opRanges: '平台操作权限',
      opRangeTips: '格式 角色: [操作范围11,操作范围2 ...]',
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
  }
};
