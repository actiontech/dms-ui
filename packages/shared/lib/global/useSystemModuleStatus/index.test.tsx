import { useDispatch, useSelector } from 'react-redux';
import useSystemModuleStatus from '.';
import { act, cleanup } from '@testing-library/react';
import system from '../../api/sqle/service/system';
import { renderHooksWithRedux } from '../../testUtil/customRender';
import { createSpySuccessResponse } from '../../testUtil/mockApi';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
    useDispatch: jest.fn()
  };
});

describe('hooks/useSystemModuleStatus', () => {
  const mockDispatch = jest.fn();
  let getSystemModuleStatusSpy: jest.SpyInstance;
  beforeEach(() => {
    getSystemModuleStatusSpy = jest.spyOn(system, 'getSystemModuleStatus');
    getSystemModuleStatusSpy.mockImplementation(() =>
      createSpySuccessResponse({ data: { is_supported: false } })
    );
    (useDispatch as jest.Mock).mockImplementation(() => mockDispatch);
    (useSelector as jest.Mock).mockImplementation((selector) => {
      return selector({
        system: { sqlOptimizationIsSupported: false }
      });
    });
    jest.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
    jest.useFakeTimers();
  });

  it('should request when manual is false', async () => {
    const { result } = renderHooksWithRedux(useSystemModuleStatus, {});
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getSystemModuleStatusSpy).toHaveBeenCalledTimes(1);
    expect(result.current.sqlOptimizationIsSupported).toEqual(false);
    expect(result.current.loading).toEqual(false);
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith({
      payload: { isSupported: false },
      type: 'system/updateSqlOptimizationIsSupported'
    });
  });

  it('should request when manual is true', async () => {
    getSystemModuleStatusSpy.mockClear();
    getSystemModuleStatusSpy.mockImplementation(() =>
      createSpySuccessResponse({ data: { is_supported: true } })
    );
    const { result } = renderHooksWithRedux(
      () => useSystemModuleStatus(true),
      {}
    );
    await act(async () => {
      result.current.updateSystemModalStatus();
      await jest.advanceTimersByTime(3000);
    });
    expect(getSystemModuleStatusSpy).toHaveBeenCalledTimes(1);
    expect(result.current.sqlOptimizationIsSupported).toEqual(false);
    expect(result.current.loading).toEqual(false);
    expect(mockDispatch).toHaveBeenCalledWith({
      payload: { isSupported: true },
      type: 'system/updateSqlOptimizationIsSupported'
    });
  });
});
