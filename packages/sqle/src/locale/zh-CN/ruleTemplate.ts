// eslint-disable-next-line import/no-anonymous-default-export
export default {
  pageTitle: '审核规则模版',
  pageDescribe: 'SQL审核会应用数据源绑定的规则模板',

  ruleTemplateListTitle: '项目规则模版列表',
  globalRuleTemplateListTitle: '公共规则模板列表',
  ruleTemplateTitle: {
    project: '项目规则模版',
    common: '公共规则模板'
  },

  backToList: '返回规则模版列表',

  ruleTemplateList: {
    descEmpty: '无',

    instance: '应用的数据库',
    instanceEmpty: '未绑定任何数据库',

    clone: '克隆',
    export: '导出',

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
    tips: '确认要删除规则模版"{{name}}"么?',
    deleting: '正在删除模版 "{{name}}"...',
    deleteSuccessTips: '删除模版"{{name}}"成功'
  },

  ruleTemplateForm: {
    placeholder: {
      templateDesc: '点此添加模板描述'
    },
    baseInfoTitle: '基本信息',
    baseInfoDesc: '设定模版的名称、描述等基本信息',

    ruleTitle: '规则',
    ruleDesc: '选择要启用的规则',

    result: '结果',
    resultDesc: '变更结果',

    templateName: '模版名称',
    templateDesc: '模版描述',
    databaseType: '数据库类型',

    activeRuleTitle: '已启用规则',
    activeRule: '启用该规则',
    activeAllRules: '启用所有规则',
    disableRuleTitle: '已禁用规则',
    disableAllRules: '禁用全部规则',
    disableRule: '禁用该规则',
    editRule: '编辑该规则',

    emptyRule: '没有找到对应规则',
    ruleValue: '规则值',

    activeAnchorTitle: '已启用',
    disableAnchorTitle: '已禁用'
  },

  createRuleTemplate: {
    button: '创建规则模版',
    title: '创建审核规则模版',
    successTitle: '创建审核规则模版成功',
    createNew: '再创建一个新的审核规则模版 >', // DELETE
    reCreateNew: '再创建一个新的审核规则模版'
  },

  importRuleTemplate: {
    button: '导入规则模板',
    title: '导入审核规则模板',
    selectFile: '请选择导入文件',
    selectFileTips:
      '仅支持导入平台已有规则，您可以修改规则阈值，或删除不需要的规则',
    submitText: '导入',
    fileRequireTips: '当前未选择任何文件',
    successTitle: '导入审核规则模版成功',
    importNew: '再导入一个新的审核规则模版 >',
    importingFile: '正在导入文件...',
    parseFileFailed:
      '当前导入信息存在校验失败，请结合下载文件中的提示进行修改，并重新导入',
    dbType: '数据源类型',
    fileType: '文件类型',
    downloadTemplate: '下载导入模板',
    downloading: '正在下载模板文件...',
    checkSuccess: '校验通过'
  },

  exportRuleTemplate: {
    button: '导出规则模板',
    exporting: '正在导出模版 "{{name}}"...',
    modal: {
      title: '导出规则模板',
      submit: '导出',
      exportFileType: '导出文件类型'
    }
  },

  updateRuleTemplate: {
    title: '更新审核规则模版',
    successTitle: '更新审核规则模版 ({{name}}) 成功'
  },

  editModal: {
    title: '编辑规则',
    ruleLevelLabel: '规则等级',
    ruleLevelValue: '预设值',
    ruleLevelLabelPlace: '请选择规则对应的等级',

    ruleLevelValuePlace: '请填写规则的默认值',
    ruleDescLabel: '规则描述',
    ruleTypeLabel: '规则分类',
    ruleNameLabel: '规则名称',
    ruleDbType: '数据库类型',
    rule: '规则',
    annotation: '说明',
    ruleValueTypeOnlyNumber: '当前规则值类型只能为数字'
  },

  cloneRuleTemplate: {
    button: '克隆规则模版',
    title: '克隆规则模版',
    cloneDesc:
      '克隆的规则模版只会继承源模版所有启用的规则、以及变更过的规则等级和阈值。克隆出的新规则模版的模版名称等基本信息需要手动填写。',
    currentTemplateTips: '正在克隆审核规则模版',
    successTips: '克隆规则模版 "{{name}}" 成功'
  },

  ruleLevel: {
    normal: '普通',
    error: '错误',
    warn: '告警',
    notice: '提示',
    unknown: '未知'
  }
};
