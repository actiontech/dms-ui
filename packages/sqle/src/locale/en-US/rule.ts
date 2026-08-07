// eslint-disable-next-line import/no-anonymous-default-export
export default {
  pageTitle: 'View rule',
  pageDesc:
    'You can view all audit rules here, or view all audit rules enabled for a specific rule template',
  notProjectRuleTemplate: 'No rule template for the current project',
  createRuleTemplateTips1: 'Please go to',
  createRuleTemplate: 'Create rule template',
  createRuleTemplateTips2: 'Page to add data',
  allRules: 'All rules',
  templateRuleList: 'Template rule list',
  activeRules: 'Rules enabled for template {{name}}',
  disableRules: 'Rules disabled for template {{name}}',
  globalRuleTemplate: 'Global rule template',
  projectRuleTemplate: 'Project rule template',
  noDbType: 'No database type',
  ruleCount: '{{count}} rules',
  form: {
    project: 'Project',
    ruleTemplate: 'Rule template',
    dbType: 'Db type',
    ruleTemplateTips:
      'When no project is selected, the current rule template is the global rule template, after selection it is the rule template under the project',
    fuzzy_text_placeholder: 'Please enter the rule keyword to search',
    ruleVersion: 'Rule version'
  },
  filter: {
    pleaseSelect: 'Please select',
    reset: 'Reset',
    search: 'Search',
    filterCondition: 'Filter conditions'
  },
  ruleLevelIcon: {
    normal: 'Normal',
    notice: 'Notice',
    warn: 'Warn',
    error: 'Error',
    toolTipsTitle: 'Warning level: {{ruleLevel}}({{text}})'
  },
  ruleDetail: {
    title: 'View rule',
    knowledge: 'Rule knowledge base'
  },
  category: {
    auditAccuracy: 'Audit accuracy',
    auditPurpose: 'Audit purpose',
    operand: 'Operand',
    sql: 'SQL category',
    performanceCost: 'Performance cost',
    performanceLevelTips:
      'High-cost rules may trigger extensive data scans or complex queries, which can significantly impact database performance. Use with caution in production environments.',
    tag: {
      online: 'Online',
      offline: 'Offline',
      database: 'Database',
      tableSpace: 'Tablespace',
      table: 'Table',
      column: 'Column',
      index: 'Index',
      view: 'View',
      procedure: 'Stored procedure',
      function: 'Function',
      trigger: 'Trigger',
      event: 'Event',
      user: 'User',
      ddl: 'DDL',
      dcl: 'DCL',
      dml: 'DML',
      integrity: 'Integrity constraint',
      query: 'Query',
      transaction: 'Transaction control',
      privilege: 'Data privilege',
      management: 'Database management',
      complete: 'Completeness constraint',
      join: 'Join',
      table_space: 'Tablespace',
      sequence: 'Sequence',
      business: 'Business data',
      correction: 'Correctness',
      security: 'Security',
      maintenance: 'Maintainability',
      performance: 'Performance issue',
      high: 'High cost',
      medium: 'Medium cost',
      low: 'Low cost'
    }
  }
};
