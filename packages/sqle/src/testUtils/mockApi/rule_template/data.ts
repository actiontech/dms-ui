import { IRuleResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import {
  RuleResV1LevelEnum,
  RuleParamResV1TypeEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';

export const ruleTemplateList = [
  {
    rule_template_id: '9',
    rule_template_name: 'custom_template',
    db_type: 'MySQL'
  },
  {
    rule_template_id: '2',
    rule_template_name: 'custom_template_b',
    db_type: 'mysql'
  }
];

export const projectRuleTemplateList = [
  {
    rule_template_id: '1',
    rule_template_name: 'default_MySQL',
    db_type: 'MySQL'
  },
  {
    rule_template_id: '3',
    rule_template_name: 'default_MySQL1',
    db_type: 'mysql'
  }
];

export const ruleType = 'MySQL';

export const ruleNameFirst = 'all_check_prepare_statement_placeholders';

export const ruleNameSecond = 'test_name';

export const ruleListData = [
  {
    annotation:
      '因为过度使用绑定变量会增加查询的复杂度，从而降低查询性能。过度使用绑定变量还会增加维护成本。默认阈值:100',
    db_type: ruleType,
    desc: '绑定的变量个数不建议超过阈值',
    is_custom_rule: false,
    level: 'error',
    params: [
      { key: 'first_key', value: '100', desc: '最大绑定变量数量', type: 'int' }
    ],
    rule_name: ruleNameFirst,
    type: '使用建议'
  },
  {
    annotation:
      '因为过度使用绑定变量会增加查询的复杂度，从而降低查询性能。过度使用绑定变量还会增加维护成本。默认阈值:100',
    db_type: ruleType,
    desc: '绑定的变量个数不建议超过阈值',
    is_custom_rule: true,
    level: 'error',
    params: [
      { key: 'first_key', value: '100', desc: '最大绑定变量数量', type: 'int' }
    ],
    rule_name: ruleNameSecond,
    type: '使用建议'
  }
];

export const ruleKnowledgeData = {
  knowledge_content: '123',
  rule: {
    desc: '绑定的变量个数不建议超过阈值',
    annotation:
      '因为过度使用绑定变量会增加查询的复杂度，从而降低查询性能。过度使用绑定变量还会增加维护成本。默认阈值:100'
  }
};

export const projectRulesMockData = {
  rule_template_name: 'default_MySQL',
  desc: '',
  db_type: 'MySQL',
  rule_list: [ruleListData[0]]
};

export const ruleListMockData: IRuleResV1[] = [
  {
    annotation:
      '因为过度使用绑定变量会增加查询的复杂度，从而降低查询性能。过度使用绑定变量还会增加维护成本。默认阈值:100',
    db_type: ruleType,
    desc: '绑定的变量个数不建议超过阈值',
    is_custom_rule: false,
    level: RuleResV1LevelEnum.error,
    params: [
      {
        key: 'first_key',
        value: '100',
        desc: '最大绑定变量数量',
        type: RuleParamResV1TypeEnum.int
      }
    ],
    rule_name: 'testName1',
    type: '使用建议'
  },
  {
    annotation: 'test rule2',
    db_type: ruleType,
    desc: 'test desc2',
    is_custom_rule: true,
    level: RuleResV1LevelEnum.normal,
    rule_name: 'testName2',
    type: 'DDL规范'
  },
  {
    annotation: 'test rule3',
    db_type: ruleType,
    desc: 'test desc3',
    is_custom_rule: true,
    level: RuleResV1LevelEnum.notice,
    rule_name: 'testName3',
    type: '命名规范'
  },
  {
    annotation: 'test rule4',
    db_type: ruleType,
    desc: 'test desc4',
    is_custom_rule: true,
    level: RuleResV1LevelEnum.warn,
    rule_name: 'testName4',
    type: '索引规范'
  }
];
