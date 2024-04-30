import { Form } from 'antd';
import RuleBaseInfo, { typeRuleBaseInfo } from '../RuleBaseInfo';
import { renderWithTheme } from '../../../../testUtils/customRender';
import { RuleResV1LevelEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { mockUseCurrentPermission } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentPermission';
import { cleanup } from '@testing-library/react';

describe('sqle/components/RuleList/RuleBaseInfo', () => {
  beforeEach(() => {
    mockUseCurrentPermission();
  });

  afterEach(() => {
    cleanup();
  });
  
  const customRender = (params: typeRuleBaseInfo) => {
    return renderWithTheme(
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
});
