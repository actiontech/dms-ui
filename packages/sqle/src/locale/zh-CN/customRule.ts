/* eslint-disable import/no-anonymous-default-export */
export default {
  title: '自定义规则',
  ceTips:
    '当用户基于业务需求，需要新建审核规则时，可以使用平台的自定义规则功能，通过平台快速开发，降低用户规则开发门槛',
  backToList: '返回自定义规则列表',

  filterForm: {
    databaseType: '数据源类型',
    ruleName: '规则名称',
    add: '新建'
  },

  editRule: '编辑该规则',
  deleteRule: '删除该规则',
  deleteSuccessTips: '规则 {{desc}} 删除成功',
  deleteConfirm: '是否确认删除该规则？',

  addCustomRule: {
    title: '创建自定义审核规则',
    successTitle: '提交成功',
    backToList: '查看创建的自定义规则',
    successTips:
      '如果您需要应用创建的自定义规则，请及时在规则模板中开启相应的规则'
  },

  editCustomRule: {
    title: '编辑自定义审核规则',
    successTitle: '提交成功',
    backToList: '查看创建的自定义规则'
  },

  customRuleForm: {
    baseInfoTitle: '基本信息',
    baseInfoDesc: '填写规则基本信息',

    editRuleTitle: '编写规则',
    editRuleDesc: '填写规则脚本',

    submit: '提交',
    submitCustomRule: '提交自定义规则'
  },

  baseInfoForm: {
    ruleID: '规则ID',
    ruleName: '规则名称',
    ruleDesc: '规则说明',
    dbType: '适用数据源类型',
    ruleType: '规则分类',
    level: '默认告警等级',
    addExtraRuleType: '新增规则分类',
    addExtraRuleTypePlaceholder: '请输入需要新增的规则分类名称',
    category: {
      auditAccuracy: '审核精度',
      auditPurpose: '审核目的',
      operand: '操作对象',
      sql: 'SQL分类',
      performanceCost: '性能消耗',
      performanceLevelTips:
        '高消耗规则会产生大量数据扫描或复杂查询，可能对数据库性能造成显著影响，建议在生产环境谨慎使用。'
    }
  },

  editScriptForm: {
    inputRuleScript: '规则脚本',
    placeholder: '请在此处输入正则表达式'
  }
};
