// eslint-disable-next-line import/no-anonymous-default-export
export default {
  pageTitle: '审核SQL例外',
  pageDesc:
    '您可以在这里添加一些SQL语句，这些SQL语句在进行审核的时候不会触发任何审核规则。',

  ceTips:
    '如果用户开启了某条规则，但在实际使用中又想临时规避某些规则的触发，可以启用平台的审核SQL例外功能。\n目前支持按字符串匹配或按照SQL指纹匹配，添加在SQL审核审核SQL例外中的语句，在提交工单申请时，将不受审核规则的约束。',
  allWhitelist: '所有审核SQL例外语句',
  view: {
    sql: '整条 SQL 例外',
    rule: '单规则例外'
  },
  table: {
    sql: '内容',
    desc: '描述',
    matchType: '匹配类型',
    matchCount: '匹配次数',
    lastMatchedTime: '最后一次匹配时间'
  },

  matchType: {
    exact: '字符串匹配',
    fingerPrint: 'SQL指纹匹配'
  },

  operate: {
    addWhitelist: '添加审核SQL例外',

    deleting: '正在删除审核SQL例外语句...',
    deleteSuccess: '删除审核SQL例外语句成功',
    confirmDelete: '确认删除这条审核SQL例外么？'
  },

  modal: {
    add: {
      title: '添加审核SQL例外',
      success: '添加审核SQL例外成功'
    },
    update: {
      title: '更新审核SQL例外',
      success: '更新审核SQL例外成功',
      tips: '当修改匹配类型或匹配内容后，该条记录的匹配次数和最后匹配时间将被重置。'
    },
    sql: 'SQL语句'
  },
  ruleException: {
    addAction: '添加为单规则例外',
    drawerTitle: '添加单规则例外',
    addSuccess: '添加单规则例外成功',
    duplicateTips: '该规则例外已存在，无需重复添加',
    cancelAction: '取消例外',
    deleting: '正在取消单规则例外...',
    deleteSuccess: '取消单规则例外成功',
    confirmCancel:
      '确认取消这条单规则例外么？取消后同四元组复审将重新触发该规则。',
    project: '项目',
    instance: '数据源',
    sqlFingerprint: 'SQL指纹',
    ruleName: '规则名',
    ruleDesc: '规则描述',
    ruleLevel: '规则原级别',
    reason: '添加原因',
    createdBy: '添加例外的人',
    createdAt: '添加时间',
    matchInfo: '命中信息',
    matchInfoWithTime: '命中 {{count}} 次，最近命中 {{time}}',
    audit: '操作',
    viewAudit: '查看审计',
    missingSqlFingerprint: '当前审核结果未返回 SQL 指纹，暂不能添加单规则例外',
    skippedModule: {
      title: '已设例外的规则',
      empty: '暂无已设例外的规则'
    }
  }
};
