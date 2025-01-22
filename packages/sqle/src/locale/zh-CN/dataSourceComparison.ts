// eslint-disable-next-line import/no-anonymous-default-export
export default {
  pageTitle: '结构对比',
  ceTips: '当您需要快速发现两个环境之间的差异时， 可以使用结构对比功能。',
  entry: {
    baselineEnvironment: '基准环境',
    baselineEnvironmentDescription:
      '请选择您认为是“标准”的数据源环境，\n这个环境将作为比较的基准点。',
    comparisonEnvironment: '比对环境',
    comparisonEnvironmentDescription:
      '请选择您想要检查或更新的数据库环境，\n这个环境将与基准环境进行比较，以找出差异。',
    selectorValidatorSchemaMessage:
      '基准环境已选择到Schema级别，请在对比数据源中也选择Schema',
    selectorValidatorDataSourceMessage:
      '基准环境选择的是数据源级别，请在对比数据源中也选择数据源',
    executeComparison: '执行对比',
    showDifferencesOnly: '只看差异',
    modifyMappings: '修改映射',
    generateSQL: '生成变更SQL',
    generateSQLErrorTips:
      '当前选中的节点中包含对比结果一致的对象，请修改选择对象后重试！',
    generateSQLDisabledTips: '请先选择数据对象',
    comparisonDetail: {
      title: '查看对比详情',
      generateSQL: '生成变更SQL',
      generateSQLDisabledTips: '当前对比结果不存在偏差',
      ddlDiff: '建表语句差异',
      modifySqlInfo: '{{schema}}变更SQL详情',
      auditFailed: '审核失败',
      auditResult: '审核结果',
      exception: '审核异常',
      exceptionTips: '请结合错误信息到sqled.log日志中检索相关信息',
      baselineDDLAuditResultTitle: '基准环境建表语句审核结果',
      comparisonDDLAuditResultTitle: '比对环境建表语句审核结果',
      modifiedSqlAuditResultTitle: '变更SQL语句审核结果',
      actions: {
        createChangeWorkflow: '生成变更工单',
        copyChangeSQL: '复制变更SQL语句',
        downloadChangeSQL: '下载变更SQL语句'
      }
    },
    modifiedSqlDrawer: {
      title: '变更SQL语句信息'
    },
    modifiedSqlAuditResult: {
      cardTitle: '变更语句'
    }
  }
};
