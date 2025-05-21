import { Form } from 'antd';
import RuleBaseInfo, { typeRuleBaseInfo } from '../RuleBaseInfo';
import { sqleSuperRender } from '../../../../testUtils/superRender';
import { RuleResV1LevelEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { mockUsePermission } from '@actiontech/shared/lib/testUtil/mockHook/mockUsePermission';
import { cleanup } from '@testing-library/react';

describe('sqle/components/RuleList/RuleBaseInfo', () => {
  beforeEach(() => {
    mockUsePermission(
      {
        moduleFeatureSupport: { sqlOptimization: true, knowledge: false }
      },
      {
        useSpyOnMockHooks: true
      }
    );
  });

  afterEach(() => {
    cleanup();
  });

  const customRender = (params: typeRuleBaseInfo) => {
    return sqleSuperRender(
      <Form>
        <RuleBaseInfo {...params} />
      </Form>
    );
  };

  it('render snap when dataSource is undefined', () => {
    const { baseElement } = customRender({
      dataSource: undefined
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when show knowledge', () => {
    const { baseElement } = customRender({
      showKnowledge: true,
      dataSource: {
        annotation: 'annotation text',
        db_type: 'mysql',
        desc: 'desc cont',
        is_custom_rule: true,
        level: RuleResV1LevelEnum.error,
        rule_name: 'rule_name_a',
        type: 'a',
        has_audit_power: false,
        has_rewrite_power: false
      },
      children: <span>child note a</span>
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when has_audit_power and has_rewrite_power is true', () => {
    const { baseElement } = customRender({
      showKnowledge: true,
      dataSource: {
        annotation: 'annotation text',
        db_type: 'mysql',
        desc: 'desc cont',
        is_custom_rule: true,
        level: RuleResV1LevelEnum.error,
        rule_name: 'rule_name_a',
        type: 'a',
        has_audit_power: true,
        has_rewrite_power: true
      },
      children: <span>child note a</span>
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when current rule has categories', () => {
    const { baseElement } = customRender({
      showKnowledge: true,
      dataSource: {
        annotation: 'annotation text',
        db_type: 'mysql',
        desc: 'desc cont',
        is_custom_rule: true,
        level: RuleResV1LevelEnum.error,
        rule_name: 'rule_name_a',
        type: 'a',
        has_audit_power: true,
        has_rewrite_power: true,
        categories: {
          audit_accuracy: ['offline'],
          sql: ['dcl'],
          operand: ['database', 'table_space'],
          audit_purpose: ['correction'],
          performance_cost: ['high']
        }
      },
      children: <span>child note a</span>
    });
    expect(baseElement).toMatchSnapshot();
  });
});
