/**
 * @test_version ce
 */

import { Form } from 'antd';
import RuleBaseInfo, { typeRuleBaseInfo } from '../RuleBaseInfo';

import { renderWithTheme } from '../../../../testUtils/customRender';
import { RuleResV1LevelEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';

describe('sqle/components/RuleList/RuleBaseInfo', () => {
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

  it('render snap when show data', () => {
    const { baseElement } = customRender({
      dataSource: {
        annotation: 'annotation text',
        db_type: 'mysql',
        desc: 'desc cont',
        is_custom_rule: true,
        level: RuleResV1LevelEnum.error,
        rule_name: 'rule_name_a',
        type: 'a'
      },
      children: <span>child note a</span>
    });
    expect(baseElement).toMatchSnapshot();
  });
});
