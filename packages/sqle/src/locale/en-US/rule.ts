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
  form: {
    project: 'Project',
    ruleTemplate: 'Rule template',
    dbType: 'Db type',
    ruleTemplateTips:
      'When no project is selected, the current rule template is the global rule template, after selection it is the rule template under the project',
    fuzzy_text_placeholder: 'Please enter the rule keyword to search'
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
    auditAccuracy: 'Audit Accuracy',
    auditPurpose: 'Audit Purpose',
    operand: 'Operand',
    sql: 'SQL Category',
    performanceCost: 'Performance Cost',
    performanceLevelTips:
      'High-cost rules generate extensive data scans or complex queries that may significantly impact database performance. Use with caution in production environments.',
    tag: {
      online: 'Online',
      offline: 'Offline',
      database: 'Database',
      tableSpace: 'Tablespace',
      table: 'Table',
      column: 'Column',
      index: 'Index',
      view: 'View',
      procedure: 'Stored Procedure',
      function: 'Function',
      trigger: 'Trigger',
      event: 'Event',
      user: 'User',
      ddl: 'DDL',
      dcl: 'DCL',
      dml: 'DML',
      integrity: 'Integrity Constraint',
      query: 'Query',
      transaction: 'Transaction Control',
      privilege: 'Data Privilege',
      management: 'Database Management',
      complete: 'Completeness Constraint',
      join: 'Join',
      table_space: 'Tablespace',
      sequence: 'Sequence',
      business: 'Business Data',
      correction: 'Correctness',
      security: 'Security',
      maintenance: 'Maintainability',
      performance: 'Performance',
      high: 'High Cost',
      medium: 'Medium Cost',
      low: 'Low Cost'
    }
  }
};
