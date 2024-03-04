import RuleTypes, { ALL_RULE_TYPE_CONSTANT } from '../RuleTypes';
import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { renderWithTheme } from '../../../testUtils/customRender';
import { ruleListMockData } from '../../../testUtils/mockApi/rule_template/data';
import { IRuleResV1 } from '@actiontech/shared/lib/api/sqle/service/common';

describe('sqle/components/RueTypes', () => {
  const ruleTypeChangeSpy = jest.fn();
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('should match snap shot', async () => {
    const { baseElement } = renderWithTheme(
      <RuleTypes
        allRulesData={ruleListMockData}
        rules={[ruleListMockData[0], ruleListMockData[1]]}
      />
    );
    await act(async () => jest.advanceTimersByTime(3300));
    expect(baseElement).toMatchSnapshot();
  });

  it('should match snap shot when has currentRuleType', async () => {
    const { baseElement } = renderWithTheme(
      <RuleTypes
        allRulesData={ruleListMockData}
        rules={[ruleListMockData[0], ruleListMockData[1]]}
        currentRuleType="使用建议"
      />
    );
    await act(async () => jest.advanceTimersByTime(3300));
    expect(baseElement).toMatchSnapshot();
  });

  it('should match snap shot when has ruleTypeChange', async () => {
    const { baseElement } = renderWithTheme(
      <RuleTypes
        allRulesData={ruleListMockData}
        rules={[ruleListMockData[0], ruleListMockData[1]]}
        currentRuleType="使用建议"
        ruleTypeChange={ruleTypeChangeSpy}
      />
    );
    await act(async () => jest.advanceTimersByTime(3300));
    expect(baseElement).toMatchSnapshot();
    fireEvent.click(screen.getByText('使用建议'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(ruleTypeChangeSpy).toHaveBeenCalled();
    expect(baseElement).toMatchSnapshot();
    fireEvent.click(screen.getByText(ALL_RULE_TYPE_CONSTANT));
    await act(async () => jest.advanceTimersByTime(300));
    expect(ruleTypeChangeSpy).toHaveBeenCalled();
  });
});
