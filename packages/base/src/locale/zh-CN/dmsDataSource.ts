// eslint-disable-next-line import/no-anonymous-default-export
export default {
  pageTitle: '数据源',
  pageDesc:
    '你可以在这里注册需要进行SQL审核的数据库, 并选择是否为该数据源开通各项功能。',

  databaseListTitle: '数据源列表',

  databaseList: {
    instanceName: '数据源名',
    address: '地址',
    describe: '描述',
    role: '角色',
    type: '数据库类型',
    ruleTemplate: '模版',
    workflow: '工作流',
    maintenanceTime: '运维时间',
    source: '来源',
    business: '所属业务'
  },

  backDesc: '返回数据源列表',
  addDatabase: '添加数据源',
  addDatabaseSuccess: '添加数据源成功',
  addDatabaseSuccessGuide: '到数据源列表查看刚刚添加的数据源',

  updateDatabase: {
    title: '编辑数据源',
    getDatabaseInfoError: '获取数据源信息失败了',
    updateDatabase: '更新数据源',
    updateDatabaseSuccess: '数据源"{{name}}"更新成功',
    dictionaryInfo: '字典信息'
  },

  dictionaryForm: {
    lastSyncDataResult: '最后一次同步字典结果',
    lastSyncDataTime: '最后一次同步字典时间',
    syncDictionary: '立即触发同步字典',
    syncDictionarySuccess: '同步字典数据成功!'
  },

  dataSourceForm: {
    baseConfig: '基础配置',
    sqlConfig: 'SQL审核配置',
    name: '数据源名称',
    describe: '数据源描述',
    type: '数据库类型',
    ip: '数据库地址',
    ipTips: '数据库IP或域名',
    port: '数据库端口',
    user: '连接用户',
    password: '密码',
    role: '可访问的角色',
    business: '所属业务',
    ruleTemplate: '审核规则模板',
    workflow: '应用的工作流',
    maxPreQueryRows: 'SQL查询返回条数',
    queryTimeoutSecond: 'SQL超时限制(s)',
    maintenanceTime: '运维时间',
    maintenanceTimeTips: '设置运维时间后，仅能在此运维时间段内上线工单',
    needAuditForSqlQuery: 'SQL查询是否需要审核',
    allowQueryWhenLessThanAuditLevel: '运行查询的最高审核等级',
    passwordTips:
      '这里不会显示您已经配置的当前数据库密码，提交时如果您没有填写密码，那么将不会对数据库密码进行变更。',
    needUpdatePassword: '是否更新密码',
    updatePassword: '更新连接密码'
  },

  testConnectModal: {
    errorTitle: '数据库{{instanceName}}连通性测试失败'
  },

  deleteDatabase: {
    confirmMessage: '确认删除数据源 "{{name}}"?',
    deletingDatabase: '正在删除数据源 "{{name}}"...',
    deleteSuccessTips: '删除数据源"{{name}}"成功'
  }
};
