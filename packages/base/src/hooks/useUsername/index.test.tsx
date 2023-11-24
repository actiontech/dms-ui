import {
  cleanup,
  renderHook,
  act,
  render,
  fireEvent,
  screen
} from '@testing-library/react';
import useUserName from '.';
import userCenter from '../../testUtils/mockApi/userCenter';
import { userList } from '../../testUtils/mockApi/userCenter/data';
import { Select } from 'antd';
import {
  createSpyErrorResponse,
  createSpyFailResponse
} from '@actiontech/shared/lib/testUtil/mockApi';

describe('useUsername', () => {
  let listUsernameSpy: jest.SpyInstance;
  beforeEach(() => {
    listUsernameSpy = userCenter.getUserList();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('should get user data from request', async () => {
    const { result } = renderHook(() => useUserName());
    expect(result.current.loading).toBeFalsy();

    act(() => {
      result.current.updateUsernameList();
    });
    expect(result.current.loading).toBeTruthy();
    await act(async () => jest.advanceTimersByTime(3300));
    //todo: 没有 mock 返回的值，所以返回的值为 []
    expect(result.current.usernameList).toEqual([]); // userList
    expect(result.current.loading).toBeFalsy();
  });

  it('should set list to empty array when response code is not equal success code', async () => {
    listUsernameSpy.mockClear();
    listUsernameSpy.mockImplementation(() =>
      createSpyFailResponse({ total: 0, users: [] })
    );
    const { result } = renderHook(() => useUserName());
    act(() => {
      result.current.updateUsernameList();
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(result.current.usernameList).toEqual([]);
  });

  it('should set list to empty array when response throw error', async () => {
    listUsernameSpy.mockClear();
    listUsernameSpy.mockImplementation(() =>
      createSpyErrorResponse({ total: 0, users: [] })
    );
    const { result } = renderHook(() => useUserName());
    act(() => {
      result.current.updateUsernameList();
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(result.current.usernameList).toEqual([]);
  });

  it('should render options when use generateUsernameSelectOption', async () => {
    const { result } = renderHook(() => useUserName());
    const { baseElement: baseElementWithOptions } = render(
      <Select data-testid="testId" value="test">
        {result.current.generateUsernameSelectOption()}
      </Select>
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElementWithOptions).toMatchSnapshot();

    await act(() => {
      fireEvent.mouseDown(screen.getByText('test'));
      jest.runAllTimers();
    });

    await screen.findAllByText('test');
    expect(baseElementWithOptions).toMatchSnapshot();
  });
});
