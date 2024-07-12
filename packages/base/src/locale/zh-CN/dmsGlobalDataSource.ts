// eslint-disable-next-line import/no-anonymous-default-export
export default {
  pageTitle: '全局数据源',
  ceTips:
    '当您需要跨项目对数据源进行便捷管理时，可以使用全局数据源概览功能，高效了解实例在项目上的分布及配置情况。',

  list: {
    instanceName: '数据源名',
    projectName: '项目名称',
    address: '地址',
    describe: '描述',
    role: '角色',
    type: '数据源类型',
    ruleTemplate: '模版',
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
  }
};
