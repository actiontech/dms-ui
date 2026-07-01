// eslint-disable-next-line import/no-anonymous-default-export
export default {
  quickAdd: {
    title: '添加为例外',
    description: '将自动匹配当前 SQL 指纹、数据源与扫描任务，仅豁免所选规则。',
    reason: '添加备注',
    missingDbType: '缺少数据源类型，无法添加规则例外',
    success: '添加规则例外成功',
    conflict: '该规则例外已存在',
    viewExisting: '查看已有例外',
    context: {
      title: '本次例外匹配范围',
      db_type: '数据源类型',
      audit_task_type: '扫描任务类型',
      audit_task_name: '扫描任务名称',
      fingerPrint: 'SQL 指纹',
      rule_scope: '生效范围（规则）'
    }
  },
  cancel: {
    title: '取消例外',
    confirm: '确认取消该规则的例外？',
    success: '取消规则例外成功',
    disabledTip: '无法取消：未找到关联例外记录'
  },
  tag: {
    exempted: '已例外'
  },
  button: {
    add: '添加为例外'
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
    viewAudit: '查看审计'
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
    audit_task_id: '扫描任务 ID'
  },
  ruleScope: {
    all: '全部规则',
    specific: '指定 {{count}} 条规则'
  },
  detail: {
    title: '管控规则例外详情',
    ruleScope: '生效范围',
    reason: '添加备注',
    createdBy: '添加人',
    createdAt: '添加时间',
    matchedCount: '命中次数',
    lastMatchTime: '最近命中时间'
  },
  form: {
    addCondition: '添加条件',
    ruleScopeMode: '生效范围',
    ruleScopeAll: '全部规则',
    ruleScopeSpecific: '指定规则',
    selectDbType: '数据源类型',
    selectRules: '选择规则',
    triggeredRules: '已触发规则',
    otherRules: '其他规则',
    reason: '添加备注',
    matchRowErrorPrefix: '第 {{index}} 行匹配条件：',
    validation: {
      atLeastOneRow: '请至少添加一条匹配条件',
      missingPrimaryType:
        '匹配条件中至少需要一个主匹配类型（SQL/SQL 指纹/IP/网段/主机名/数据源/数据库用户）',
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
    auditTaskId: '扫描任务 ID',
    createdBy: '添加人',
    createdAt: '添加时间'
  }
};
