/**
 * @test_version ce
 */

import RuleList from '../RuleList';
import { act, cleanup } from '@testing-library/react';
import { renderWithTheme } from '../../../testUtils/customRender';
import { RuleListProps, RuleStatusEnum } from '../index.type';
import { ruleListMockData } from '../../../testUtils/mockApi/rule_template/data';

describe('sqle/components/RuleList CE', () => {
  const onActionHandleSpy = jest.fn();
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  const customRender = (props: RuleListProps) => {
    return renderWithTheme(
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
});
