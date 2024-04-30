import { useDispatch } from 'react-redux';
import useFeaturePermission from '.';
import { act, cleanup } from '@testing-library/react';
import system from '../../api/sqle/service/system';
import { renderHooksWithRedux } from '../../testUtil/customRender';
import { createSpySuccessResponse } from '../../testUtil/mockApi';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useDispatch: jest.fn()
  };
});

describe('hooks/useFeaturePermission', () => {
  const mockDispatch = jest.fn();
  let getSystemModuleStatusSpy: jest.SpyInstance;
  beforeEach(() => {
    getSystemModuleStatusSpy = jest.spyOn(system, 'getSystemModuleStatus');
    getSystemModuleStatusSpy.mockImplementation(() =>
      createSpySuccessResponse({ data: { is_supported: false } })
    );
    (useDispatch as jest.Mock).mockImplementation(() => mockDispatch);
    jest.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
    jest.useFakeTimers();
  });

  it('should no request', async () => {
    const { result } = renderHooksWithRedux(useFeaturePermission, {});
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getSystemModuleStatusSpy).not.toHaveBeenCalled();
    expect(result.current.loading).toEqual(false);
  });

  it('should request when updateFeaturePermission called', async () => {
    getSystemModuleStatusSpy.mockClear();
    getSystemModuleStatusSpy.mockImplementation(() =>
      createSpySuccessResponse({ data: { is_supported: true } })
    );
    const { result } = renderHooksWithRedux(useFeaturePermission, {});
    await act(async () => {
      result.current.updateFeaturePermission();
      await jest.advanceTimersByTime(3000);
    });
    expect(getSystemModuleStatusSpy).toHaveBeenCalledTimes(1);
    expect(result.current.loading).toEqual(false);
    expect(mockDispatch).toHaveBeenCalledWith({
      payload: { isSupported: true },
      type: 'permission/updateSqlOptimizationIsSupported'
    });
  });
});
