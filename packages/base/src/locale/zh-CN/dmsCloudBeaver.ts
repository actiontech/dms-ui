// eslint-disable-next-line import/no-anonymous-default-export
export default {
  pageTitle: 'SQL工作台',
  pageDescribe: '你可以对你有操作权限的数据源进行受审核管控的SQL操作',
  eeErrorTips: '该环境未配置SQL查询，请设置后再使用',
  eeErrorTips2: '配置方式及使用说明请查看使用文档',
  jumpToCloudBeaver: '打开SQL工作台',
  ceTips:
    '当您需要对SQL工作台产生的数据操作进行细粒度的审计和记录时，可以使用SQL工作台审计功能，确保数据操作的可追溯性和责任明晰。',
  statistic: {
    total: '执行SQL总量',
    succeedTotal: '执行成功率',
    interceptedTotal: '审核拦截的异常SQL',
    failedTotal: '执行不成功的SQL'
  },
  sqlAuditResult: 'SQL审核结果',
  operationList: {
    exportButton: '导出',
    exportTips: '正在导出SQL操作记录',
    column: {
      operationUser: '操作人',
      operationTime: '操作时间',
      service: '数据源',
      operationDetail: '操作详情',
      sessionId: '会话ID',
      operationIP: '操作IP',
      auditResult: '审核结果',
      execResult: '执行结果',
      execTime: '执行时间（毫秒）',
      rowCount: '结果集返回行数'
    }
  }
};
