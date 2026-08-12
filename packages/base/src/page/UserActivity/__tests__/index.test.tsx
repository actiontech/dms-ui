import { baseSuperRender } from '../../../testUtils/superRender';
import UserActivity from '../index';
import userActivity from '@actiontech/shared/lib/testUtil/mockApi/base/userActivity';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { act, cleanup } from '@testing-library/react';

describe('base/page/UserActivity', () => {
  beforeEach(() => {
    userActivity.mockAllApi();
    // 页面默认统计日期取当天，固定系统时间避免快照随运行日期漂移
    jest.useFakeTimers().setSystemTime(new Date(2026, 5, 24, 10, 0, 0));
    mockUseCurrentUser();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('render init snap', async () => {
    const { container } = baseSuperRender(<UserActivity />);
    await act(async () => {
      jest.advanceTimersByTime(3000);
    });
    expect(container).toMatchSnapshot();
  });
});
