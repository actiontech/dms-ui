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
    fuzzy_text_placeholder: '请输入规则关键词搜索'
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
  }
};
