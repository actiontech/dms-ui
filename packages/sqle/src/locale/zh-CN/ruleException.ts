// eslint-disable-next-line import/no-anonymous-default-export
export default {
  quickAdd: {
    conflict: '该规则例外已存在'
  },
  tag: {
    exempted: '已例外',
    sqlExemption: '审核SQL例外'
  },
  report: {
    fullSqlExempted: '整 SQL 已例外'
  },
  button: {
    add: '添加到审核 SQL 例外'
  },
  skippedSection: {
    title: '已例外规则',
    rule: '规则',
    level: '级别',
    createdBy: '添加人',
    createdAt: '添加时间',
    reason: '备注',
    action: '操作',
    viewDetail: '查看例外详情',
    viewAudit: '查看审计',
    fullSqlRule: '整 SQL 例外'
  },
  matchConditionsSummary: {
    empty: '-',
    item: '{{type}}：{{content}}'
  },
  matchType: {
    sql: '字符串',
    fingerPrint: 'SQL指纹',
    ip: 'IP',
    cidr: '网段',
    host: '主机名',
    instance: '数据源',
    db_user: '数据库用户',
    db_type: '数据源类型',
    audit_task_type: '扫描任务类型',
    audit_task_id: '扫描任务',
    sql_source: '来源',
    sqlSource: {
      sql_audit_record: '快捷审核',
      audit_plan: '扫描任务'
    }
  },
  ruleScope: {
    all: '全部规则',
    specific: '指定 {{count}} 条规则'
  },
  detail: {
    title: '管控规则例外详情',
    ruleScope: '生效范围',
    reason: '备注',
    createdBy: '添加人',
    createdAt: '添加时间',
    matchedCount: '命中次数',
    lastMatchTime: '最近命中时间'
  },
  form: {
    addCondition: '添加条件',
    matchModeTips:
      '本项目中，同时满足以下条件的SQL将会根据生效范围跳过部分或所有规则的审核',
    ruleScopeModeTips:
      '本项目中，同时满足上述匹配方式的SQL将会根据生效范围跳过部分或所有规则的审核',
    ruleScopeMode: '生效范围',
    ruleScopeAll: '全部规则',
    ruleScopeSpecific: '指定规则',
    selectDbType: '数据源类型',
    selectRules: '选择规则',
    selectDbTypeFirst: '请先选择数据源类型',
    ruleScopeSearchPlaceholder: '搜索规则名称或描述',
    ruleScopeLoadFailed: '规则列表加载失败',
    triggeredRules: '已触发规则',
    otherRules: '其他规则',
    reason: '添加备注',
    matchRowErrorPrefix: '第 {{index}} 行匹配条件：',
    validation: {
      atLeastOneRow: '请至少添加一条匹配方式',
      duplicateRow: '存在重复的匹配类型与内容',
      incompleteRow: '请完整填写每条匹配条件的类型与内容',
      summaryTitle: '请检查以下问题后重新提交'
    }
  },
  table: {
    matchMode: '匹配方式',
    ruleScope: '生效范围',
    reason: '备注',
    createdBy: '添加人',
    createdAt: '添加时间'
  },
  filter: {
    matchType: '匹配类型',
    ruleScopeMode: '生效范围',
    ruleName: '规则名',
    auditTaskType: '扫描任务类型',
    auditTask: '扫描任务',
    auditTaskId: '扫描任务',
    sqlSource: '来源',
    createdBy: '添加人',
    createdAt: '添加时间'
  }
};
