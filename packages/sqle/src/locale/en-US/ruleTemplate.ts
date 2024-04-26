// eslint-disable-next-line import/no-anonymous-default-export
export default {
  pageTitle: 'Audit Rule Template',
  pageDescribe:
    'The database will apply the rules of all the rule templates bound to it for SQL audit',

  ruleTemplateListTitle: 'Template List',
  globalRuleTemplateListTitle: '公共规则模板',

  ruleTemplateTitle: {
    project: '项目规则模版',
    common: '公共规则模板'
  },

  backToList: 'Back to Template List',

  ruleTemplateList: {
    descEmpty: 'Empty',

    clone: '克隆',
    export: '导出',

    instance: 'Instances',
    instanceEmpty: 'Empty',

    table: {
      templateName: '模版名称',
      desc: '描述',
      dbType: '可应用的数据库类型',
      dataSource: '绑定的数据源'
    }
  },

  detail: {
    project: '项目',
    dbType: '数据源类型',
    error: '获取规则详细信息异常',
    auditCapability: '审核能力',
    rewriteCapability: '重写能力'
  },

  deleteRuleTemplate: {
    tips: 'Are you sure delete this template "{{name}}"?',
    deleting: 'Deleting template "{{name}}"...',
    deleteSuccessTips: 'Delete template "{{name}}" successfully'
  },

  ruleTemplateForm: {
    placeholder: {
      templateDesc: '点此添加模板描述'
    },
    baseInfoTitle: 'Base info',
    baseInfoDesc: 'Set Template name, describe and something others',

    ruleTitle: 'Rule',
    ruleDesc: 'Select the rule that need to be enable',

    result: 'Result',
    resultDesc: 'Operate Result',

    templateName: 'Template Name',
    templateDesc: 'Template Describe',

    activeRuleTitle: 'Enable Rule',
    activeRule: 'Enable',
    activeAllRules: 'Enable All Rule',
    disableRuleTitle: 'Disable Rule',
    disableAllRules: 'Disable All Rule',
    disableRule: 'Disable',

    emptyRule: 'Empty',
    ruleValue: 'Rule value'
  },

  createRuleTemplate: {
    button: 'Create audit rule template',
    title: 'Create Audit Rule Template',
    successTitle: 'Create audit rule template successfully',
    createNew: 'Create new audit rule template again >'
  },

  updateRuleTemplate: {
    title: 'Update Audit Rule Template',
    successTitle: 'Update audit rule template successfully'
  }
};
