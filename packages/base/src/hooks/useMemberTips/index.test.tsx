import {
  cleanup,
  renderHook,
  act,
  render,
  fireEvent,
  screen
} from '@testing-library/react';
import useMemberTips from '.';
import userCenter from '@actiontech/shared/lib/testUtil/mockApi/base/userCenter';
import { memberTips } from '@actiontech/shared/lib/testUtil/mockApi/base/userCenter/data';
import { Select } from 'antd';
import {
  createSpyErrorResponse,
  createSpyFailResponse
} from '@actiontech/shared/lib/testUtil/mockApi';

describe('useUsername', () => {
  let listMemberTipsSpy: jest.SpyInstance;
  const projectID = '3000';
  beforeEach(() => {
    listMemberTipsSpy = userCenter.getMemberTips();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('should get user data from request', async () => {
    const { result } = renderHook(() => useMemberTips());
    expect(result.current.loading).toBeFalsy();

    act(() => {
      result.current.updateMemberTips({ project_uid: projectID });
    });
    expect(result.current.loading).toBeTruthy();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(result.current.memberTips).toEqual(memberTips);
    expect(result.current.loading).toBeFalsy();
  });

  it('should set list to empty array when response code is not equal success code', async () => {
    listMemberTipsSpy.mockClear();
    listMemberTipsSpy.mockImplementation(() =>
      createSpyFailResponse({ data: memberTips })
    );
    const { result } = renderHook(() => useMemberTips());
    act(() => {
      result.current.updateMemberTips({ project_uid: projectID });
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(result.current.memberTips).toEqual([]);
  });

  it('should set list to empty array when response throw error', async () => {
    listMemberTipsSpy.mockClear();
    listMemberTipsSpy.mockImplementation(() =>
      createSpyErrorResponse({ data: memberTips })
    );
    const { result } = renderHook(() => useMemberTips());
    act(() => {
      result.current.updateMemberTips({ project_uid: projectID });
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(result.current.memberTips).toEqual([]);
  });

  it('should render options when use generateUsernameSelectOption', async () => {
    const { result } = renderHook(() => useMemberTips());
    act(() => {
      result.current.updateMemberTips({ project_uid: projectID });
    });
    expect(result.current.loading).toBeTruthy();
    await act(async () => jest.advanceTimersByTime(3000));
    const { baseElement: baseElementWithOptions } = render(
      <Select data-testid="testId" value="test">
        {result.current.generateMemberSelectOptions()}
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
