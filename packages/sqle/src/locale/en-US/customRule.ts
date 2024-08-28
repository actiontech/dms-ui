/* eslint-disable import/no-anonymous-default-export */
export default {
  title: 'Custom rule',
  ceTips:
    'When users need to create audit rules based on business needs, they can use the platform’s custom rule function, which can be quickly developed through the platform to reduce the user’s rule development threshold',
  backToList: 'Back to custom rule list',

  filterForm: {
    databaseType: 'DB instance type',
    ruleName: 'Rule name',
    add: 'Create'
  },

  editRule: 'Edit this rule',
  deleteRule: 'Delete this rule',
  deleteSuccessTips: 'Rule {{desc}} deleted successfully',
  deleteConfirm: 'Are you sure you want to delete this rule?',

  addCustomRule: {
    title: 'Create custom audit rule',
    successTitle: 'Submission successful',
    backToList: 'View created custom rules',
    successTips:
      'If you need to apply the created custom rules, please enable the corresponding rules in the rule template in time'
  },

  editCustomRule: {
    title: 'Edit custom audit rule',
    successTitle: 'Submission successful',
    backToList: 'View created custom rules'
  },

  customRuleForm: {
    baseInfoTitle: 'Basic information',
    baseInfoDesc: 'Fill in the basic rule information',

    editRuleTitle: 'Write rule',
    editRuleDesc: 'Fill in the rule script',

    submit: 'Submit',
    submitCustomRule: 'Submit custom rule'
  },

  baseInfoForm: {
    ruleID: 'Rule id',
    ruleName: 'Rule name',
    ruleDesc: 'Rule description',
    dbType: 'Applicable DB instance type',
    ruleType: 'Rule classification',
    level: 'Default alert level',
    addExtraRuleType: 'Add rule classification',
    addExtraRuleTypePlaceholder:
      'Please enter the name of the rule classification you need to add'
  },

  editScriptForm: {
    inputRuleScript: 'Rule script',
    placeholder: 'Please enter the regular expression here'
  }
};
