import {
  cleanup,
  act,
  renderHook,
  render,
  fireEvent,
  screen
} from '@testing-library/react';
import useOpPermission from '.';
import userCenter from '../../testUtils/mockApi/userCenter';
import { opPermissionList } from '../../testUtils/mockApi/userCenter/data';
import {
  createSpyErrorResponse,
  createSpyFailResponse
} from '@actiontech/shared/lib/testUtil/mockApi';
import { Select } from 'antd';

describe('test useManagerPermission', () => {
  let listOpPermissionSpy: jest.SpyInstance;
  beforeEach(() => {
    listOpPermissionSpy = userCenter.getOpPermissionsList();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('should get op permission list from request', async () => {
    const { result } = renderHook(() => useOpPermission());
    expect(result.current.loading).toBeFalsy();
    expect(result.current.opPermissionList).toEqual([]);

    act(() => {
      result.current.updateOpPermissionList();
    });
    expect(result.current.loading).toBeTruthy();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(result.current.opPermissionList).toEqual(opPermissionList);
    expect(result.current.loading).toBeFalsy();
  });

  it('should set list to empty array when response code is not equal success code', async () => {
    listOpPermissionSpy.mockClear();
    listOpPermissionSpy.mockImplementation(() =>
      createSpyFailResponse({ total: 0, users: [] })
    );
    const { result } = renderHook(() => useOpPermission());
    act(() => {
      result.current.updateOpPermissionList();
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(result.current.opPermissionList).toEqual([]);
  });

  it('should set list to empty array when response throw error', async () => {
    listOpPermissionSpy.mockClear();
    listOpPermissionSpy.mockImplementation(() =>
      createSpyErrorResponse({ total: 0, users: [] })
    );
    const { result } = renderHook(() => useOpPermission());
    act(() => {
      result.current.updateOpPermissionList();
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(result.current.opPermissionList).toEqual([]);
  });

  it('should render options when use generateOpPermissionSelectOptions', async () => {
    const { result } = renderHook(() => useOpPermission());
    act(() => {
      result.current.updateOpPermissionList();
    });
    expect(result.current.loading).toBeTruthy();
    await act(async () => jest.advanceTimersByTime(3000));
    const { baseElement: baseElementWithOptions } = render(
      <Select data-testid="testId" value="test opPermission 1">
        {result.current.generateOpPermissionSelectOptions()}
      </Select>
    );

    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElementWithOptions).toMatchSnapshot();

    await act(() => {
      fireEvent.mouseDown(screen.getByText('test opPermission 1'));
      jest.runAllTimers();
    });

    await screen.findAllByText('test opPermission 1');
    expect(baseElementWithOptions).toMatchSnapshot();
  });
});
