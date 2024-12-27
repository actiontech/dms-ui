import useRuleList from '../useRuleList';
import { act, cleanup } from '@testing-library/react';
import { renderHooksWithTheme } from '../../../testUtils/customRender';
import { RuleStatusEnum } from '../index.type';
import { ruleListMockData } from '../../../testUtils/mockApi/rule_template/data';
import { IRuleResV1 } from '@actiontech/shared/lib/api/sqle/service/common';

describe('sqle/components/RuleList/useRuleList', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  const customRender = () => {
    return renderHooksWithTheme(useRuleList);
  };

  it('test rule status', async () => {
    const { result } = customRender();
    expect(result.current.ruleStatus).toEqual(RuleStatusEnum.enabled);
    await act(async () => {
      result.current.setRuleStatus(RuleStatusEnum.disabled);
      await jest.advanceTimersByTime(100);
    });
    expect(result.current.ruleStatus).toEqual(RuleStatusEnum.disabled);
  });

  it('test getCurrentStatusRules', async () => {
    const { result } = customRender();
    const activeRules = [ruleListMockData[0]];
    let rules: IRuleResV1[] = [];
    await act(async () => {
      rules = result.current.getCurrentStatusRules(
        ruleListMockData,
        activeRules
      );
      await jest.advanceTimersByTime(100);
    });
    expect(rules).toEqual(ruleListMockData);

    await act(async () => {
      rules = result.current.getCurrentStatusRules([], undefined, 'test');
      await jest.advanceTimersByTime(100);
    });
    expect(rules).toEqual([]);

    await act(async () => {
      rules = result.current.getCurrentStatusRules(
        undefined,
        undefined,
        'test'
      );
      await jest.advanceTimersByTime(100);
    });
    expect(rules).toEqual([]);

    await act(async () => {
      rules = result.current.getCurrentStatusRules(undefined, [], 'test');
      await jest.advanceTimersByTime(100);
    });
    expect(rules).toEqual([]);

    await act(async () => {
      rules = result.current.getCurrentStatusRules([], activeRules, 'test');
      await jest.advanceTimersByTime(100);
    });
    expect(rules).toEqual(activeRules);
    await act(async () => {
      result.current.setRuleStatus(RuleStatusEnum.disabled);
      await jest.advanceTimersByTime(100);
    });
    await act(async () => {
      rules = result.current.getCurrentStatusRules(
        ruleListMockData,
        activeRules,
        'test'
      );
      await jest.advanceTimersByTime(100);
    });
    expect(rules).toEqual(ruleListMockData.slice(1));
  });
});
