// eslint-disable-next-line import/no-anonymous-default-export
export default {
  list: {
    title: '用户列表'
  },

  user: {
    name: '用户名',
    password: '密码',
    passwordConfirm: '确认密码',
    canLogin: '状态',
    createTime: '创建时间',
    lastLoginTime: '上次登录时间',
    desc: '描述',

    canLoginLabel: {
      enable: '可用',
      disable: '不可用'
    }
  },

  addUser: {
    title: '添加用户',

    successTips: '用户"{{name}}"添加成功！'
  },
  activateUser: {
    title: '激活用户',
    successTips: '用户"{{name}}"激活成功！'
  },

  removeUser: {
    deleteTips: '确认要移除用户"{{name}}"?',
    deleting: '正在删除用户 "{{name}}"...',
    deleteSuccessTips: '用户 "{{name}}" 删除成功'
  },

  updatePermission: {
    title: '动作权限',
    successTips: '用户"{{name}}"的动作权限更新成功！',
    addButton: '添加动作权限与数据源的绑定',
    rule: '动作权限',
    errorByService: '请选择数据源',
    errorByRule: '请选择动作权限',
    ruleList: {
      auth: '授权',
      audit: '审核/驳回工单'
    }
  },

  neverLoggedIn: '从未登录'
};
