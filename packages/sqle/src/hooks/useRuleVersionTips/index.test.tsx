import { act, renderHook } from '@testing-library/react';
import useRuleVersionTips from '.';
import rule_template from '../../testUtils/mockApi/rule_template';
import {
  createSpyErrorResponse,
  createSpyFailResponse
} from '@actiontech/shared/lib/testUtil/mockApi';
import { GetDriverRuleVersionTipsMockData } from '../../testUtils/mockApi/rule_template/data';

describe('useRuleVersionTips', () => {
  let requestSpy: jest.SpyInstance;
  beforeEach(() => {
    requestSpy = rule_template.mockGetDriverRuleVersionTips();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('should get rule version tips when call updateRuleVersionTips', async () => {
    const requestSpy = rule_template.mockGetDriverRuleVersionTips();
    const { result } = renderHook(() => useRuleVersionTips());
    expect(result.current.ruleVersionTips).toEqual([]);
    expect(result.current.loading).toBeFalsy();

    act(() => {
      result.current.updateRuleVersionTips();
    });
    expect(result.current.loading).toBeTruthy();
    expect(requestSpy).toHaveBeenCalledTimes(1);

    await act(async () => jest.advanceTimersByTime(3000));
    expect(result.current.loading).toBeFalsy();
    expect(result.current.ruleVersionTips).toEqual(
      GetDriverRuleVersionTipsMockData
    );
  });

  it('should set empty array when request failed', async () => {
    requestSpy.mockImplementation(() => createSpyFailResponse({}));

    const { result } = renderHook(() => useRuleVersionTips());
    expect(result.current.ruleVersionTips).toEqual([]);

    act(() => {
      result.current.updateRuleVersionTips();
    });
    expect(requestSpy).toHaveBeenCalledTimes(1);
    expect(result.current.loading).toBeTruthy();

    await act(async () => jest.advanceTimersByTime(3000));
    expect(result.current.ruleVersionTips).toEqual([]);
    expect(result.current.loading).toBeFalsy();
  });

  it('should set empty array when request throw error', async () => {
    requestSpy.mockImplementation(() => createSpyErrorResponse({}));

    const { result } = renderHook(() => useRuleVersionTips());
    expect(result.current.ruleVersionTips).toEqual([]);

    act(() => {
      result.current.updateRuleVersionTips();
    });
    expect(result.current.loading).toBeTruthy();
    expect(requestSpy).toHaveBeenCalledTimes(1);

    await act(async () => jest.advanceTimersByTime(3000));
    expect(result.current.ruleVersionTips).toEqual([]);
    expect(result.current.loading).toBeFalsy();
  });

  it('should generate rule version options by dbType', async () => {
    const { result } = renderHook(() => useRuleVersionTips());
    expect(result.current.generateRuleVersionOptions('MySQL')).toBeUndefined();

    act(() => {
      result.current.updateRuleVersionTips();
    });
    await act(async () => jest.advanceTimersByTime(3000));

    const mysqlOptions = result.current.generateRuleVersionOptions('MySQL');
    expect(mysqlOptions).toEqual([
      { label: '1', value: 1 },
      { label: '2', value: 2 },
      { label: '3', value: 3 }
    ]);

    const pgOptions = result.current.generateRuleVersionOptions('PostgreSQL');
    expect(pgOptions).toEqual([{ label: '2', value: 2 }]);

    const unknownOptions = result.current.generateRuleVersionOptions('unknown');
    expect(unknownOptions).toBeUndefined();
  });
});
