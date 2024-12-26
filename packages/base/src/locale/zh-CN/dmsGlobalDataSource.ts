// eslint-disable-next-line import/no-anonymous-default-export
export default {
  pageTitle: '全局数据源',
  ceTips:
    '当您需要跨项目对数据源进行便捷管理时，可以使用全局数据源概览功能，高效了解实例在项目上的分布及配置情况。',

  list: {
    instanceName: '数据源名',
    projectName: '项目名称',
    address: '地址',
    lastTestConnectionStatus: '上一次连接状态',
    testConnectionStatusFilterLabel: '数据源连接状态',
    describe: '描述',
    role: '角色',
    type: '数据源类型',
    ruleTemplate: '模板',
    workflow: '工作流',
    maintenanceTime: '运维时间',
    source: '来源',
    business: '所属业务',
    dataMask: '数据查询脱敏',
    unfinishedWorkflowNum: '未完成工单数量',
    workbenchQueryAudit: '工作台查询审核'
  },
  testConnectModal: {
    errorTitle: '数据源{{instanceName}}连通性测试失败'
  },
  deleteDatabase: {
    confirmMessage: '确认删除数据源 "{{name}}"?',
    deletingDatabase: '正在删除数据源 "{{name}}"...',
    deleteSuccessTips: '删除数据源"{{name}}"成功'
  },

  batchTestConnection: {
    notFoundData: '当前列表无数据！',
    connectFailed: '连接失败',
    connectSucceed: '连接成功',
    batchTestConnectionSuccessTips: '执行批量测试数据源连通性成功！'
  },

  addDatabase: '添加数据源',
  batchTestDataSourceConnection: '批量测试数据源连通性',
  backToList: '返回全局数据源列表',
  batchImportDataSource: {
    buttonText: '批量导入数据源',
    title: '批量导入数据源',
    importFile: '导入',
    successTitle: '批量导入数据源成功',
    requestAuditErrorMessage:
      '当前导入信息存在校验失败，请结合下载文件中的提示进行修改，并重新导入',
    submitButton: '导入'
  }
};
