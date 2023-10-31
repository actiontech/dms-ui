// eslint-disable-next-line import/no-anonymous-default-export
export default {
  noData: '暂无数据',
  list: {
    title: '授权清单'
  },
  template: {
    title: '权限模板',
    searchLabel: '权限模板名称',
    columns: {
      name: '权限模板名称',
      template_details: '数据权限',
      authorization_purpose: '关联的授权清单'
    }
  },
  columns: {
    permissionUser: '使用人',
    purpose: '目的或用途',
    businesses: '数据所在业务',
    dataObjectService: '涉及数据源',
    template: ' 权限模板',
    memo: '备注',
    details: '详情',
    updateTime: '更新时间',
    status: '状态',
    effective: '生效中',
    expiring: '即将过期',
    invalid: '过期',
    permanent: '永久',
    expiration: '到期时间'
  },
  addAuth: {
    title: '授权',
    back: '返回',
    steps: {
      base: '选择数据权限',
      purpose: '授权目的',
      account: '数据库连接账号',
      result: '结果'
    },
    result: {
      success: '授权成功',
      jumpAuthList: '前往授权清单',
      continue: '继续授权',
      jumpDetailPrefix: '完成授权，',
      jumpDetailSuffix: '转发给本次授权的负责人。',
      viewString: '查看连接串'
    },
    baseForm: {
      template: '权限模板',
      effectiveTimeDay: '有效期',
      business: '业务',
      status: '状态',
      dataSourceDns: '涉及数据源',
      dataSource: '选择数据源',
      objects: '选择数据库表',
      operation: '选择操作',
      duplicateError: '已存在相同数据源、相同数据对象、相同数据操作的权限',
      emptyError: '权限不能为空',
      overview: '数据权限概览',
      selected: '已选业务：',
      reset: '清除所有权限',
      baseFormTable: {
        service: '数据源',
        objects: '数据对象',
        operation: '数据操作'
      }
    },
    purposeForm: {
      username: '使用人',
      purpose: '目的或用途',
      memo: '备注'
    },
    accountForm: {
      username: '连接账号名',
      usernameExtra: '账号名检测通过',
      hostname: '连接域',
      password: '连接密码',
      confirm_password: '确认连接密码',
      password_error: '您输入的两个密码不匹配'
    },
    templateFormTitle: '选择权限模板',
    previewModal: {
      title: '账号创建预览'
    },
    addUser: {
      placeholder: '创建新用户',
      addTips: '添加的用户需要激活后才能登录平台',
      adding: '正在创建用户 "{{name}}"...',
      addSuccessTips: '用户 "{{name}}" 创建成功'
    }
  },
  backToAuthTemplateList: '返回权限模板列表',
  updateTemplateTitle: '更换权限模板',
  updateUserTitle: '更换使用人',
  updateExpirationTitle: '授权续期',
  updateExpirationField: '续期',
  updateExpirationExtra: '说明：续期指在当前时间基础上增加有效期时间',
  updateTemplateSuccess: '更新成功',
  editTemplate: {
    extraEmptyTips: '您还没有为当前模板添加数据权限',
    addTitle: '添加权限模板',
    detailTitle: '权限模板详情',
    addSuccessTips: '模板"{{name}}"添加成功！',
    editSuccessTips: '模板"{{name}}"修改成功！',
    templateName: '数据权限模板名称',
    templateNamePlaceholder: '请输入权限模板名称',
    leaveTip: '离开该页面？系统可能不会保存您所做的更改。'
  },
  removeTemplate: {
    deleteTips: '确认要移除模板"{{name}}"?',
    deleting: '正在删除模板 "{{name}}"...',
    deleteSuccessTips: '模板 "{{name}}" 删除成功'
  },
  authDetails: {
    title: '查看权限详情',
    selectedBusiness: '已选业务:',
    purpose: '目的:',
    overview: '数据权限概览'
  },
  connectionDetails: {
    title: '查看授权信息',
    dns: '连接地址',
    business: '授权业务',
    accountInfo: '连接信息',
    explanation: '说明',
    copyString: '复制连接串',
    getConnection: '授权信息'
  },
  deleteAuth: {
    title: "确定要回收目的为'{{purpose}}'的权限?",
    button: '回收权限',
    loading: '正在回收权限...',
    success: '权限回收成功'
  },
  updateUser: {
    modifyPassword: '是否修改数据库连接密码',
    modifyPasswordTip:
      '若不变更数据库连接密码，存在原使用人继续使用当前授权的风险',
    password: '数据库连接密码',
    confirmPassword: '确认数据库连接密码'
  },
  button: {
    copy: '全文复制',
    addAuth: '授权',
    copyTemplate: '类似创建',
    updateTemplate: '更新模板',
    addList: '加入到数据权限',
    addTemplate: '添加模板',
    addDataPermission: '添加数据权限',
    addUser: '创建用户'
  }
};
