import { IRuleResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import {
  RuleResV1LevelEnum,
  RuleParamResV1TypeEnum,
  CustomRuleResV1LevelEnum
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
    type: '使用建议',
    has_audit_power: false,
    has_rewrite_power: false
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
    type: '使用建议',
    has_audit_power: true,
    has_rewrite_power: true
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

export const projectRuleTemplate = [
  {
    rule_template_name: 'mysql',
    desc: '',
    db_type: 'MySQL'
  },
  {
    rule_template_name: 'mysql-aa',
    desc: 'aa',
    db_type: 'MySQL'
  }
];

export const getRuleTemplate = [
  {
    rule_template_name: 'default_MySQL',
    desc: '默认规则模板',
    db_type: 'MySQL'
  }
];

export const projectRuleTemplateListMockData = [
  {
    rule_template_name: 'test1',
    desc: 'test desc',
    db_type: 'MySQL'
  },
  {
    rule_template_name: 't1',
    desc: '',
    db_type: 'MySQL'
  },
  {
    rule_template_name: '',
    desc: '',
    db_type: ''
  }
];

export const publicRuleTemplateListMockData = [
  {
    rule_template_name: 'default_template',
    desc: 'test desc',
    db_type: 'MySQL'
  },
  {
    rule_template_name: 'global_test',
    desc: '',
    db_type: 'MySQL'
  },
  {
    rule_template_name: '',
    desc: '',
    db_type: ''
  }
];

export const customRuleMockData = [
  {
    rule_id: 'rule_id_123456',
    desc: 'test-custom-rule1',
    annotation: '',
    db_type: 'MySQL',
    level: 'notice',
    type: '命名规范'
  },
  {
    rule_id: 'rule_id_234567',
    desc: 'test-custom-rule2',
    annotation: '',
    db_type: 'MySQL',
    level: 'notice',
    type: '命名规范'
  }
];

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
    type: '使用建议',
    has_audit_power: true,
    has_rewrite_power: true
  },
  {
    annotation: 'test rule2',
    db_type: ruleType,
    desc: 'test desc2',
    is_custom_rule: true,
    level: RuleResV1LevelEnum.normal,
    rule_name: 'testName2',
    type: 'DDL规范',
    has_audit_power: true,
    has_rewrite_power: false
  },
  {
    annotation: 'test rule3',
    db_type: ruleType,
    desc: 'test desc3',
    is_custom_rule: true,
    level: RuleResV1LevelEnum.notice,
    rule_name: 'testName3',
    type: '命名规范',
    has_audit_power: false,
    has_rewrite_power: true
  },
  {
    annotation: 'test rule4',
    db_type: ruleType,
    desc: 'test desc4',
    is_custom_rule: true,
    level: RuleResV1LevelEnum.warn,
    rule_name: 'testName4',
    type: '索引规范',
    has_audit_power: false,
    has_rewrite_power: false
  }
];

export const ruleTypeByDbMockData = [
  {
    rule_type: '规范1',
    rule_count: 0,
    is_custom_rule_type: false
  },
  {
    rule_type: '规范2',
    rule_count: 0,
    is_custom_rule_type: false
  }
];

export const customRuleDetailMockData = {
  rule_id: 'rule_id_123',
  desc: 'test_custom_rule',
  annotation: 'anno',
  db_type: 'mysql',
  level: CustomRuleResV1LevelEnum.error,
  type: '规范1',
  rule_script: 'SELECT 1;'
};

export const importRuleTemplateMockData = {
  name: 'default_MySQL',
  desc: '',
  db_type: 'MySQL',
  rule_list: [ruleListData[0]]
};
