import {
  render,
  fireEvent,
  screen,
  act,
  renderHook,
  cleanup
} from '@testing-library/react';
import { Select } from 'antd';
import useRole from '.';
import userCenter from '../../testUtils/mockApi/userCenter';
import { roleList } from '../../testUtils/mockApi/userCenter/data';
import {
  createSpyErrorResponse,
  createSpyFailResponse
} from '@actiontech/shared/lib/testUtil/mockApi';

describe('useRole', () => {
  let listRoleSpy: jest.SpyInstance;
  beforeEach(() => {
    listRoleSpy = userCenter.getRoleList();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('should get role data from request', async () => {
    const { result } = renderHook(() => useRole());
    expect(result.current.loading).toBe(false);
    expect(result.current.roleList).toEqual([]);

    act(() => {
      result.current.updateRoleList();
    });

    expect(result.current.loading).toBeTruthy();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(result.current.roleList).toEqual(roleList);
    expect(result.current.loading).toBeFalsy();
  });

  it('should set list to empty array when response code is not equal success code', async () => {
    listRoleSpy.mockClear();
    listRoleSpy.mockImplementation(() =>
      createSpyFailResponse({ total: 0, users: [] })
    );
    const { result } = renderHook(() => useRole());
    act(() => {
      result.current.updateRoleList();
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(result.current.roleList).toEqual([]);
  });

  it('should set list to empty array when response throw error', async () => {
    listRoleSpy.mockClear();
    listRoleSpy.mockImplementation(() =>
      createSpyErrorResponse({ total: 0, users: [] })
    );
    const { result } = renderHook(() => useRole());
    act(() => {
      result.current.updateRoleList();
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(result.current.roleList).toEqual([]);
  });

  it('should render options when use generateRoleSelectOption', async () => {
    const { result } = renderHook(() => useRole());
    const { baseElement: baseElementWithOptions } = render(
      <Select data-testid="testId" value="test role 1">
        {result.current.generateRoleSelectOption()}
      </Select>
    );

    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElementWithOptions).toMatchSnapshot();

    await act(() => {
      fireEvent.mouseDown(screen.getByText('test role 1'));
      jest.runAllTimers();
    });

    await screen.findAllByText('test role 1');
    expect(baseElementWithOptions).toMatchSnapshot();
  });
});
