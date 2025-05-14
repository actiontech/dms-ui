/**
 * @test_version ce
 */

import RuleList, { pageRemainingHeight } from '../RuleList';
import { act, cleanup } from '@testing-library/react';
import { sqleSuperRender } from '../../../testUtils/superRender';
import { RuleListProps, RuleStatusEnum } from '../index.type';
import { ruleListMockData } from '../../../testUtils/mockApi/rule_template/data';
import { mockUsePermission } from '@actiontech/shared/lib/testUtil/mockHook/mockUsePermission';

describe('sqle/components/RuleList CE', () => {
  const onActionHandleSpy = jest.fn();
  beforeEach(() => {
    mockUsePermission(
      {
        moduleFeatureSupport: { sqlOptimization: true, knowledge: false }
      },
      {
        useSpyOnMockHooks: true
      }
    );
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  const customRender = (props: RuleListProps) => {
    return sqleSuperRender(
      <RuleList {...props} onActionHandle={onActionHandleSpy} />
    );
  };

  it('should match snap', async () => {
    const { baseElement } = customRender({
      pageHeaderHeight: 120,
      rules: ruleListMockData,
      isAction: true,
      actionType: RuleStatusEnum.disabled,
      enableCheckDetail: true
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
  });

  it('page remaining height should increase 184', () => {
    expect(pageRemainingHeight(100)).toBe(284);
  });
});
