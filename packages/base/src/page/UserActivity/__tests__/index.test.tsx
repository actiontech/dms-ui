import { baseSuperRender } from '../../../testUtils/superRender';
import UserActivity from '../index';
import userActivity from '@actiontech/shared/lib/testUtil/mockApi/base/userActivity';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { act, cleanup } from '@testing-library/react';

describe('base/page/UserActivity', () => {
  beforeEach(() => {
    userActivity.mockAllApi();
    jest.useFakeTimers();
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
