import { act, cleanup } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import useCustomDBPasswordRule from '../useCustomDBPasswordRule';
import customDBPasswordRule from '@actiontech/shared/lib/testUtil/mockApi/provision/customDBPasswordRule';
import { mockCustomDBPasswordRuleData } from '@actiontech/shared/lib/testUtil/mockApi/provision/customDBPasswordRule/data';
import {
  createSpyErrorResponse,
  createSpyFailResponse,
  createSpySuccessResponse
} from '@actiontech/shared/lib/testUtil/mockApi';

describe('useCustomDBPasswordRule', () => {
  let getCustomDBPasswordRuleSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.useFakeTimers();
    customDBPasswordRule.mockAllApi();
    getCustomDBPasswordRuleSpy =
      customDBPasswordRule.authGetCustomDBPasswordRule();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
    cleanup();
  });

  it('should get custom password rules successfully', async () => {
    const { result } = renderHook(() => useCustomDBPasswordRule());

    expect(result.current.customPasswordRule).toBeUndefined();
    expect(result.current.getCustomPasswordRuleLoading).toBeFalsy();

    act(() => {
      result.current.getCustomPasswordRule();
    });

    expect(result.current.getCustomPasswordRuleLoading).toBeTruthy();

    await act(async () => {
      jest.advanceTimersByTime(3000);
    });

    expect(getCustomDBPasswordRuleSpy).toHaveBeenCalledTimes(1);
    expect(result.current.customPasswordRule).toEqual(
      mockCustomDBPasswordRuleData
    );
    expect(result.current.getCustomPasswordRuleLoading).toBeFalsy();
  });

  it('should generate password rules based on custom rules', async () => {
    const { result } = renderHook(() => useCustomDBPasswordRule());

    act(() => {
      result.current.getCustomPasswordRule();
    });

    await act(async () => {
      jest.advanceTimersByTime(3000);
    });

    expect(result.current.passwordRules.length).toBe(5);

    expect(result.current.passwordRules[0].key).toBe('min_length');

    const validateLength = result.current.passwordRules[0].validate;
    expect(validateLength('123456789012345')).toBe(false);
    expect(validateLength('1234567890123456')).toBe(true);
  });

  it('should handle API error gracefully', async () => {
    getCustomDBPasswordRuleSpy.mockClear();
    getCustomDBPasswordRuleSpy.mockImplementation(() =>
      createSpyFailResponse({ code: 500 })
    );

    const { result } = renderHook(() => useCustomDBPasswordRule());

    act(() => {
      result.current.getCustomPasswordRule();
    });

    await act(async () => {
      jest.advanceTimersByTime(0);
    });

    expect(result.current.customPasswordRule).toBeUndefined();
  });

  it('should generate password according to rules', async () => {
    const { result } = renderHook(() => useCustomDBPasswordRule());

    act(() => {
      result.current.getCustomPasswordRule();
    });

    await act(async () => {
      jest.advanceTimersByTime(3000);
    });

    const generatedPassword = result.current.generatePasswordByRule();

    expect(generatedPassword.length).toBeGreaterThanOrEqual(16);
  });

  it('should use default values when custom password rule is not available', async () => {
    getCustomDBPasswordRuleSpy.mockClear();
    getCustomDBPasswordRuleSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: null
      })
    );

    const { result } = renderHook(() => useCustomDBPasswordRule());

    act(() => {
      result.current.getCustomPasswordRule();
    });

    await act(async () => {
      jest.advanceTimersByTime(3000);
    });

    expect(result.current.passwordRules[0].key).toBe('min_length');

    const passwordGenerated = result.current.generatePasswordByRule();

    expect(passwordGenerated.length).toBe(0);
  });
});
