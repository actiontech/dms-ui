// eslint-disable-next-line import/no-anonymous-default-export
export default {
  pageTitle: 'Audit rule template',
  pageDescribe:
    'Sql audit will apply the rule template bound to the DB instance',

  ruleTemplateListTitle: 'Project rule template list',
  globalRuleTemplateListTitle: 'Public rule template list',
  ruleTemplateTitle: {
    project: 'Project rule template',
    common: 'Public rule template'
  },

  backToList: 'Back to rule template list',

  ruleTemplateList: {
    descEmpty: 'None',

    instance: 'Applied database',
    instanceEmpty: 'No DB instance bound',

    clone: 'Clone',
    export: 'Export',

    table: {
      templateName: 'Template name',
      desc: 'Description',
      dbType: 'Applicable database type',
      dataSource: 'Bound DB instance'
    }
  },

  detail: {
    project: 'Project',
    dbType: 'DB instance type',
    error: 'Error getting rule details',
    auditCapability: 'Audit capability',
    rewriteCapability: 'Rewrite capability'
  },

  deleteRuleTemplate: {
    tips: 'Confirm to delete rule template "{{name}}"?',
    deleting: 'Deleting template "{{name}}"...',
    deleteSuccessTips: 'Delete template "{{name}}" successfully'
  },

  ruleTemplateForm: {
    placeholder: {
      templateDesc: 'Click to add template description'
    },
    baseInfoTitle: 'Basic info',
    baseInfoDesc: 'Set basic information such as template name and description',

    ruleTitle: 'Rule',
    ruleDesc: 'Select rules to enable',

    result: 'Result',
    resultDesc: 'Change result',

    templateName: 'Template name',
    templateDesc: 'Template description',
    databaseType: 'Database type',

    activeRuleTitle: 'Enabled rules',
    activeRule: 'Enable this rule',
    activeAllRules: 'Enable all rules',
    disableRuleTitle: 'Disabled rules',
    disableAllRules: 'Disable all rules',
    disableRule: 'Disable this rule',
    editRule: 'Edit this rule',

    emptyRule: 'No matching rule found',
    ruleValue: 'Rule value',

    activeAnchorTitle: 'Enabled',
    disableAnchorTitle: 'Disabled'
  },

  createRuleTemplate: {
    button: 'Create rule template',
    title: 'Create audit rule template',
    successTitle: 'Create audit rule template successfully',
    createNew: 'Create another new audit rule template >', // DELETE
    reCreateNew: 'Create another new audit rule template'
  },

  importRuleTemplate: {
    button: 'Import rule template',
    title: 'Import audit rule template',
    selectFile: 'Select import file',
    selectFileTips:
      'Only supports importing existing platform rules. You can modify rule thresholds or delete unnecessary rules.',
    submitText: 'Import',
    fileRequireTips: 'No file selected',
    successTitle: 'Import audit rule template successfully',
    importNew: 'Import another new audit rule template >',
    importingFile: 'Importing file...',
    parseFileFailed:
      'The current import information has validation failures. Please modify according to the prompts in the downloaded file and re-import.',
    dbType: 'Data Source Type',
    fileType: 'File Type',
    downloadTemplate: 'Download Import Template',
    downloading: 'Downloading template file...',
    checkSuccess: 'Validation Passed'
  },

  exportRuleTemplate: {
    button: 'Export rule template',
    exporting: 'Exporting template "{{name}}"...',
    modal: {
      title: 'Export Audit Rule Template',
      submit: 'Export',
      exportFileType: 'Export File Type'
    }
  },

  updateRuleTemplate: {
    title: 'Update audit rule template',
    successTitle: 'Update audit rule template ({{name}}) successfully'
  },

  editModal: {
    title: 'Edit rule',
    ruleLevelLabel: 'Rule level',
    ruleLevelValue: 'Preset value',
    ruleLevelLabelPlace: 'Select the level corresponding to the rule',

    ruleLevelValuePlace: 'Please fill in the default value of the rule',
    ruleDescLabel: 'Rule description',
    ruleTypeLabel: 'Rule category',
    ruleNameLabel: 'Rule name',
    ruleDbType: 'Database type',
    rule: 'Rule',
    annotation: 'Description',
    ruleValueTypeOnlyNumber: 'The current rule value type can only be a number'
  },

  cloneRuleTemplate: {
    button: 'Clone rule template',
    title: 'Clone rule template',
    cloneDesc:
      'The cloned rule template will only inherit all enabled rules of the source template, as well as the changed rule level and threshold. the basic information of the new rule template cloned, such as the template name, needs to be filled in manually.',
    currentTemplateTips: 'Cloning audit rule template',
    successTips: 'Clone rule template "{{name}}" successfully'
  },

  ruleLevel: {
    normal: 'Normal',
    error: 'Error',
    warn: 'Warning',
    notice: 'Notice',
    unknown: 'Unknown'
  }
};
