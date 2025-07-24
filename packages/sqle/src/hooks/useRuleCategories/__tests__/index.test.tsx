import { act, renderHook } from '@testing-library/react-hooks';
import { render, screen } from '@testing-library/react';
import { Select } from 'antd';
import useRuleCategories from '../index';
import ruleTemplate from '@actiontech/shared/lib/testUtil/mockApi/sqle/rule_template';
import { mockRuleCategoriesData } from '@actiontech/shared/lib/testUtil/mockApi/sqle/rule_template/data';

describe('sqle/useRuleCategories', () => {
  let getCategoryStatisticsSpy: jest.SpyInstance;
  beforeEach(() => {
    jest.useFakeTimers();
    getCategoryStatisticsSpy = ruleTemplate.getCategoryStatistics();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('render rule category options when showOptionCount is false', async () => {
    const { result } = renderHook(() => useRuleCategories());
    expect(result.current.getRuleCategoriesLoading).toEqual(true);
    expect(result.current.ruleCategories).toBe(undefined);
    expect(result.current.auditAccuracyOptions).toBe(undefined);
    expect(result.current.operandOptions).toBe(undefined);
    expect(result.current.sqlOptions).toBe(undefined);
    expect(result.current.auditPurposeOptions).toBe(undefined);
    expect(result.current.performanceLevelOptions).toBe(undefined);

    await act(async () => jest.advanceTimersByTime(3000));
    expect(getCategoryStatisticsSpy).toHaveBeenCalledTimes(1);
    expect(result.current.getRuleCategoriesLoading).toEqual(false);
    expect(result.current.ruleCategories).toBe(mockRuleCategoriesData);

    const { baseElement } = render(
      <>
        <Select options={result.current.auditAccuracyOptions} open />
        <Select options={result.current.auditPurposeOptions} open />
        <Select options={result.current.operandOptions} open />
        <Select options={result.current.sqlOptions} open />
        <Select options={result.current.performanceLevelOptions} open />
      </>
    );
    expect(baseElement).toMatchSnapshot();
  });

  it('render rule category options when showOptionCount is true', async () => {
    const { result } = renderHook(() => useRuleCategories(true));
    expect(result.current.getRuleCategoriesLoading).toEqual(true);
    expect(result.current.ruleCategories).toBe(undefined);
    expect(result.current.auditAccuracyOptions).toBe(undefined);
    expect(result.current.operandOptions).toBe(undefined);
    expect(result.current.sqlOptions).toBe(undefined);
    expect(result.current.auditPurposeOptions).toBe(undefined);
    expect(result.current.performanceLevelOptions).toBe(undefined);

    await act(async () => jest.advanceTimersByTime(3000));
    expect(getCategoryStatisticsSpy).toHaveBeenCalledTimes(1);
    expect(result.current.getRuleCategoriesLoading).toEqual(false);
    expect(result.current.ruleCategories).toBe(mockRuleCategoriesData);

    const { baseElement } = render(
      <>
        <Select options={result.current.auditAccuracyOptions} open />
        <Select options={result.current.auditPurposeOptions} open />
        <Select options={result.current.operandOptions} open />
        <Select options={result.current.sqlOptions} open />
        <Select options={result.current.performanceLevelOptions} open />
      </>
    );
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('82')).toBeInTheDocument();
    expect(screen.getByText('305')).toBeInTheDocument();
  });
});
