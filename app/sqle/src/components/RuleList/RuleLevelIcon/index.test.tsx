import { RuleResV1LevelEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import RuleLevelIcon, { typeRuleLevelIcon } from '.';

import { sqleSuperRender } from '../../../testUtils/superRender';

describe('sqle/components/RuleList/RuleLevelIcon', () => {
  const customRender = (params: typeRuleLevelIcon) => {
    return sqleSuperRender(<RuleLevelIcon {...params} />);
  };

  it('render snap when data is empty', () => {
    const { baseElement } = customRender({});
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when level is normal', () => {
    const { baseElement } = customRender({
      ruleLevel: RuleResV1LevelEnum.notice
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when level is warn', () => {
    const { baseElement } = customRender({
      ruleLevel: RuleResV1LevelEnum.warn
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when level is error', () => {
    const { baseElement } = customRender({
      ruleLevel: RuleResV1LevelEnum.error
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when only icon', () => {
    const { baseElement } = customRender({
      onlyShowIcon: true,
      iconFontSize: 40,
      ruleLevel: RuleResV1LevelEnum.error
    });
    expect(baseElement).toMatchSnapshot();
  });
});
