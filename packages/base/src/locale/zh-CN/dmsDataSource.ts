// eslint-disable-next-line import/no-anonymous-default-export
export default {
  pageTitle: '数据源',
  pageDesc:
    '你可以在这里注册需要进行SQL审核的数据源, 并选择是否为该数据源开通各项功能。',

  databaseListTitle: '数据源列表',

  databaseList: {
    instanceName: '数据源名',
    address: '地址',
    describe: '描述',
    lastTestConnectionStatus: '上一次连接状态',
    lastTestConnectionTime: '测试连通性时间',
    lastTestConnectionErrorMessage: '测试失败原因',
    connectSucceed: '连通性测试成功',
    connectFailed: '连通性测试失败',
    testConnectionStatusFilterLabel: '数据源连接状态',
    role: '角色',
    type: '数据源类型',
    enabledScanTypes: '启用的扫描类型',
    ruleTemplate: '模板',
    workflow: '工作流',
    maintenanceTime: '运维时间',
    source: '来源',
    business: '所属业务',
    environmentAttribute: '环境属性',
    dataMask: '数据查询脱敏',
    backup: 'SQL备份'
  },

  backDesc: '返回数据源列表',
  addDatabase: '添加数据源',
  addDatabaseSuccess: '添加数据源成功',
  addDatabaseSuccessGuide: '到数据源列表查看刚刚添加的数据源',
  batchTestDataSourceConnection: '批量测试数据源连通性',

  updateDatabase: {
    title: '编辑数据源',
    getDatabaseInfoError: '获取数据源信息失败了',
    updateDatabase: '更新数据源',
    updateDatabaseSuccess: '数据源"{{name}}"更新成功'
  },

  dataSourceForm: {
    baseConfig: '基础配置',
    sqlConfig: 'SQL审核配置',
    sqlConfigTips:
      '管理不同业务场景下SQL执行所需遵循的审核规则，实现精细化管控',
    name: '数据源名称',
    describe: '数据源描述',
    type: '数据源类型',
    ip: '数据源地址',
    ipTips: '数据源IP或域名',
    port: '数据源端口',
    user: '连接用户',
    password: '密码',
    role: '可访问的角色',
    project: '所属项目',
    environmentAttribute: '环境属性',
    addEnvironmentAttribute: '添加环境属性',
    deleteEnvironmentAttributeConfirm: '确认要删除此环境属性吗?',
    updateEnvironmentAttributeSuccess: '环境属性更新成功',
    deleteEnvironmentAttributeSuccess: '环境属性删除成功',
    addEnvironmentAttributeSuccess: '环境属性添加成功',
    deleteEnvironmentAttributeError: '当前环境已绑定：{{name}}，暂无法删除',
    ruleTemplate: 'SQL上线审核规则模板',
    ruleTemplateTips: '此功能强制开启审核，请为上线流程选择规则模板',
    workflow: '应用的工作流',
    maxPreQueryRows: 'SQL查询返回条数',
    queryTimeoutSecond: 'SQL超时限制(s)',
    maintenanceTime: '运维时间',
    maintenanceTimeTips: '设置运维时间后，仅能在此运维时间段内上线工单',
    needAuditSqlService: '是否开启SQL审核业务',
    needAuditSqlServiceTips: '关闭后将禁用所用场景的SQL审核',
    closeAuditSqlServiceTips:
      '如果不启用SQL审核业务，则在SQL审核相关业务中无法使用该数据源，是否确认关闭？',
    needAuditForSqlQuery: '工作台查询审核',
    needAuditForSqlQueryTips: '用于SQL工作台实时查询，可按需启用',
    workbenchAuditRuleTemplate: '工作台查询审核规则模板',
    allowQueryWhenLessThanAuditLevel: '自动放行的最高审核等级',
    allowQueryWhenLessThanAuditLevelTips:
      '低于或等于此等级的审核结果将自动放行',
    allowExecuteNonDqlInWorkflow: '通过工单上线执行工作台非DQL类型SQL',
    allowExecuteNonDqlInWorkflowTips:
      '开启后，允许通过工单上线执行工作台非DQL类型的SQL语句',
    dataExportAuditRuleTemplate: '数据导出审核规则模板',
    dataExportAuditRuleTemplateTips:
      '此功能强制开启审核，请为数据导出选择规则模板',
    passwordTips:
      '这里不会显示您已经配置的当前数据源密码，提交时如果您没有填写密码，那么将不会对数据源密码进行变更。',
    needUpdatePassword: '是否更新密码',
    updatePassword: '更新连接密码',
    dataMaskConfig: '数据脱敏配置',
    dataMaskConfigLabel: 'SQL工作台是否开启脱敏配置',
    dataMaskConfigTips: '开启后，将对SQL工作台的查询结果进行脱敏',
    checkDataMaskButton: '查看脱敏规则',
    sqlBackupConfiguration: 'SQL备份配置',
    enableDataSourceBackup: '是否开启数据源上的SQL备份能力',
    enableDataSourceBackupTips: '开启后，数据源上创建的工单将默认开启备份能力',
    lineNumberLimit: '回滚行数限制',
    lineNumberLimitTips: '当预计影响行数超过指定值则不回滚',
    dataSourceConnectError: '数据源连通性测试失败',
    returnModify: '返回修改',
    continueSubmit: '继续提交'
  },

  testConnectModal: {
    errorTitle: '数据源{{instanceName}}连通性测试失败'
  },

  batchTestConnection: {
    notFoundData: '当前列表无数据！',
    connectFailed: '连接失败',
    connectSucceed: '连接成功',
    batchTestConnectionSuccessTips: '执行批量测试数据源连通性成功！'
  },

  deleteDatabase: {
    confirmMessage: '确认删除数据源 "{{name}}"?',
    deletingDatabase: '正在删除数据源 "{{name}}"...',
    deleteSuccessTips: '删除数据源"{{name}}"成功'
  },

  enabledAuditPlan: {
    text: '为数据源开启扫描任务'
  },

  batchImportDataSource: {
    buttonText: '批量导入数据源',
    title: '批量导入数据源',
    importFile: '导入',
    successTitle: '批量导入数据源成功',
    requestAuditErrorMessage:
      '当前导入信息存在校验失败，请结合下载文件中的提示进行修改，并重新导入'
  }
};
