// eslint-disable-next-line import/no-anonymous-default-export
export default {
  result: '审核结果',
  passRage: '审核通过率',
  source: '审核结果评分',
  duplicate: '是否去重',
  downloadSql: '下载SQL语句',
  downloadReport: '下载审核报告',
  table: {
    number: '序号',
    auditLevel: '规则等级',
    auditStatus: '审核状态',
    auditResult: '审核结果',
    execSql: '执行语句',
    execStatus: '执行状态',
    execResult: '执行结果',
    rollback: '回滚语句',
    rollbackTips: '仅提示，不支持执行回滚',
    describe: '说明',
    analyze: '分析',
    addDescribe: '添加说明'
  },

  filterForm: {
    highestAuditLevel: '最高审核告警等级'
  },

  sqlFileSource: {
    tips: '当前仅支持查看SQL/ZIP文件中的SQL来源',
    source: '所在文件',
    fileLine: '所在行'
  },

  execStatus: {
    initialized: '准备执行',
    doing: '正在执行',
    succeeded: '执行成功',
    failed: '执行失败',
    manually_executed: '人工执行',
    terminate_fail: '中止失败',
    terminate_succ: '中止成功',
    terminating: '正在中止',
    allStatus: '全部状态',
    rollback: '执行回滚'
  },

  auditStatus: {
    initialized: '准备审核',
    doing: '正在审核',
    finished: '审核完毕'
  },
  copyExecSql: '复制执行语句',
  auditSuccess: '审核通过',

  fileModeExecute: {
    headerTitle: '文件信息概览',
    sqlsTips: '当前仅展示前5条数据，<0>查看更多<0>'
  },
  fileModeSqls: {
    backToDetail: '返回工单详情',
    title: '文件信息详情',

    statistics: {
      audit: '审核结果信息',
      execute: '执行结果信息'
    }
  }
};
