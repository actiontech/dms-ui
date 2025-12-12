import { act, cleanup } from '@testing-library/react';
import { superRenderHook } from '@actiontech/shared/lib/testUtil/superRender';
import { useDispatch, useSelector } from 'react-redux';
import {
  baseMockApi,
  createSpySuccessResponse
} from '@actiontech/shared/lib/testUtil/mockApi';
import useNavigateToWorkbench from '.';
import { mockUseRecentlySelectedZone } from '../../testUtils/mockHooks/mockUseRecentlySelectedZone';
import { mockGatewayTipsData } from '@actiontech/shared/lib/testUtil/mockApi/base/gateway/data';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
  useSelector: jest.fn()
}));

describe('useNavigateToWorkbench', () => {
  const dispatchSpy = jest.fn();
  let getGatewayTipsSpy: jest.SpyInstance;
  let getSQLQueryConfigurationSpy: jest.SpyInstance;

  beforeEach(() => {
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
    (useSelector as jest.Mock).mockImplementation((selector) => {
      return selector({
        availabilityZone: {
          availabilityZoneTips: mockGatewayTipsData
        }
      });
    });
    mockUseRecentlySelectedZone();
    getGatewayTipsSpy = baseMockApi.gateway.getGatewayTips();
    getSQLQueryConfigurationSpy = baseMockApi.cloudBeaver.getSqlQueryUrl();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
  });

  it('should initialize with correct default values', () => {
    const { result } = superRenderHook(() => useNavigateToWorkbench());

    expect(result.current.navigateToWorkbenchLoading).toBeFalsy();
    expect(result.current.getAvailabilityZoneTipsLoading).toBeFalsy();
    expect(typeof result.current.navigateToWorkbenchAsync).toBe('function');
    expect(typeof result.current.getAvailabilityZoneTipsAsync).toBe('function');
  });

  it('should fetch availability zone tips successfully', async () => {
    const { result } = superRenderHook(() => useNavigateToWorkbench());
    expect(result.current.getAvailabilityZoneTipsLoading).toBeFalsy();

    act(() => {
      result.current.getAvailabilityZoneTipsAsync();
    });
    expect(result.current.getAvailabilityZoneTipsLoading).toBeTruthy();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(result.current.getAvailabilityZoneTipsLoading).toBeFalsy();

    expect(getGatewayTipsSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'availabilityZone/updateAvailabilityZoneTips',
      payload: { availabilityZoneTips: mockGatewayTipsData }
    });
  });

  it('should fetch SQL query configuration successfully', async () => {
    const mockUpdateRecentlySelectedZone = jest.fn();
    getSQLQueryConfigurationSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: {
          enable_sql_query: true,
          sql_query_root_uri: '/cloudbeaver'
        }
      })
    );
    mockUseRecentlySelectedZone({
      availabilityZone: undefined,
      updateRecentlySelectedZone: mockUpdateRecentlySelectedZone
    });
    const { result } = superRenderHook(() => useNavigateToWorkbench());
    expect(result.current.navigateToWorkbenchLoading).toBeFalsy();

    act(() => {
      result.current.navigateToWorkbenchAsync();
    });
    expect(result.current.navigateToWorkbenchLoading).toBeTruthy();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(result.current.navigateToWorkbenchLoading).toBeFalsy();

    expect(getSQLQueryConfigurationSpy).toHaveBeenCalledTimes(1);
    expect(mockUpdateRecentlySelectedZone).toHaveBeenCalledWith(
      mockGatewayTipsData[0]
    );
  });
});
