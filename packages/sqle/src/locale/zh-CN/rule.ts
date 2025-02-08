// eslint-disable-next-line import/no-anonymous-default-export
export default {
  pageTitle: '查看规则',
  pageDesc:
    '你可以在这里查看所有的审核规则，或者查看某一个规则模板启用的所有审核规则',
  notProjectRuleTemplate: '当前项目暂无规则模板',
  createRuleTemplateTips1: '请前往',
  createRuleTemplate: '创建规则模板',
  createRuleTemplateTips2: '页面添加数据',
  allRules: '全部规则',
  templateRuleList: '模板规则列表',
  activeRules: '模板{{name}}启用的规则',
  disableRules: '模板{{name}}禁用的规则',
  globalRuleTemplate: '全局规则模板',
  projectRuleTemplate: '项目规则模板',
  form: {
    project: '项目',
    ruleTemplate: '规则模板',
    dbType: '数据库类型',
    ruleTemplateTips:
      '当未选择项目时, 当前规则模板为全局规则模板, 选择后为项目下的规则模板',
    fuzzy_text_placeholder: '请输入规则关键词搜索',
    ruleVersion: '规则版本'
  },
  ruleLevelIcon: {
    normal: '普通',
    notice: '提示',
    warn: '告警',
    error: '错误',
    toolTipsTitle: '告警等级: {{ruleLevel}}({{text}})'
  },
  ruleDetail: {
    title: '查看规则',
    knowledge: '规则知识库'
  },
  category: {
    auditAccuracy: '审核精度',
    auditPurpose: '审核目的',
    operand: '操作对象',
    sql: 'SQL分类',
    performanceCost: '性能消耗',
    performanceLevelTips:
      '高消耗规则会产生大量数据扫描或复杂查询，可能对数据库性能造成显著影响，建议在生产环境谨慎使用。',
    tag: {
      online: '在线',
      offline: '离线',
      database: '数据库',
      tableSpace: '表空间',
      table: '表',
      column: '字段',
      index: '索引',
      view: '视图',
      procedure: '存储过程',
      function: '函数',
      trigger: '触发器',
      event: '事件',
      user: '用户',
      ddl: 'DDL',
      dcl: 'DCL',
      dml: 'DML',
      integrity: '完整性约束',
      query: '查询',
      transaction: '事务控制',
      privilege: '数据权限',
      management: '数据库管理',
      complete: '完全性约束',
      join: '连接',
      table_space: '表空间',
      sequence: '序列',
      business: '业务数据',
      correction: '正确性',
      security: '安全性',
      maintenance: '可维护性',
      performance: '性能问题',
      high: '高消耗',
      medium: '中消耗',
      low: '低消耗'
    }
  }
};
