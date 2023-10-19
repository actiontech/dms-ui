import { act, renderHook } from '@testing-library/react';
import useCron from '.';

describe('useCron', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('should set value to "* * * * *" by default', () => {
    const { result } = renderHook(() => useCron());
    expect(result.current.value).toBe('* * * * *');
    expect(result.current.error).toBe('');
    expect(result.current.month).toEqual([]);
    expect(result.current.day).toEqual([]);
    expect(result.current.week).toEqual([]);
    expect(result.current.minute).toEqual([]);
    expect(result.current.hour).toEqual([]);
  });

  test('should update cron and time value when cron is valid', () => {
    const { result } = renderHook(() => useCron());
    act(() => {
      result.current.updateCron('1 1 1 1 1');
    });
    expect(result.current.value).toBe('1 1 1 1 1');
    expect(result.current.error).toBe('');
    expect(result.current.month).toEqual([1]);
    expect(result.current.day).toEqual([1]);
    expect(result.current.week).toEqual([1]);
    expect(result.current.minute).toEqual([1]);
    expect(result.current.hour).toEqual([1]);
  });

  test('should only set cron and error when cron is invalid', () => {
    const { result } = renderHook(() => useCron());
    act(() => {
      result.current.updateCron('1 1 1 1');
    });
    expect(result.current.value).toBe('1 1 1 1');
    expect(result.current.error).toBe(
      'cron表达式必须只包含（分钟 小时 日期 月份 星期）5个元素'
    );
    expect(result.current.month).toEqual([]);
    expect(result.current.day).toEqual([]);
    expect(result.current.week).toEqual([]);
    expect(result.current.minute).toEqual([]);
    expect(result.current.hour).toEqual([]);
  });

  test('should update minute when user call updateMinute method', () => {
    const { result } = renderHook(() => useCron());
    act(() => {
      result.current.updateMinute([999, 888]);
    });
    expect(result.current.minute).toEqual([]);
    expect(result.current.error).toBe(
      '您的表达式中包含不合法的数值范围， minute(0-59), hour(0-23), day(1,31), month(1-12), week(0-6)'
    );

    act(() => {
      result.current.updateMinute([2, 1, 3]);
    });

    expect(result.current.minute).toEqual([1, 2, 3]);
    expect(result.current.error).toBe('');
  });

  test('should update hour when user call updateHour method', () => {
    const { result } = renderHook(() => useCron());
    act(() => {
      result.current.updateHour([999, 888]);
    });
    expect(result.current.minute).toEqual([]);
    expect(result.current.error).toBe(
      '您的表达式中包含不合法的数值范围， minute(0-59), hour(0-23), day(1,31), month(1-12), week(0-6)'
    );

    act(() => {
      result.current.updateHour([2, 1, 3]);
    });

    expect(result.current.hour).toEqual([1, 2, 3]);
    expect(result.current.error).toBe('');
  });

  test('should update day when user call updateDay method', () => {
    const { result } = renderHook(() => useCron());
    act(() => {
      result.current.updateDay([999, 888]);
    });
    expect(result.current.day).toEqual([]);
    expect(result.current.error).toBe(
      '您的表达式中包含不合法的数值范围， minute(0-59), hour(0-23), day(1,31), month(1-12), week(0-6)'
    );

    act(() => {
      result.current.updateDay([2, 1, 3]);
    });

    expect(result.current.day).toEqual([1, 2, 3]);
    expect(result.current.error).toBe('');
  });

  test('should update month when user call updateMonth method', () => {
    const { result } = renderHook(() => useCron());
    act(() => {
      result.current.updateMonth([999, 888]);
    });
    expect(result.current.month).toEqual([]);
    expect(result.current.error).toBe(
      '您的表达式中包含不合法的数值范围， minute(0-59), hour(0-23), day(1,31), month(1-12), week(0-6)'
    );

    act(() => {
      result.current.updateMonth([2, 1, 3]);
    });

    expect(result.current.month).toEqual([1, 2, 3]);
    expect(result.current.error).toBe('');
  });

  test('should update week when user call updateWeek method', () => {
    const { result } = renderHook(() => useCron());
    act(() => {
      result.current.updateWeek([999, 888]);
    });
    expect(result.current.week).toEqual([]);
    expect(result.current.error).toBe(
      '您的表达式中包含不合法的数值范围， minute(0-59), hour(0-23), day(1,31), month(1-12), week(0-6)'
    );

    act(() => {
      result.current.updateWeek([2, 1, 3]);
    });

    expect(result.current.week).toEqual([1, 2, 3]);
    expect(result.current.error).toBe('');
  });
});
