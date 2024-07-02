import PushNotification from '.';

import { superRender } from '@actiontech/shared/lib/testUtil/customRender';
import { cleanup, act, screen } from '@testing-library/react';

import system from '../../../testUtils/mockApi/system';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';

describe('base/setting/pushNotification', () => {
  const customRender = () => {
    return superRender(<PushNotification />);
  };
  beforeEach(() => {
    mockUseCurrentUser();
    jest.useFakeTimers();
    system.mockAllApi();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
  });

  it('render snap', async () => {
    const { baseElement } = customRender();

    await act(async () => jest.advanceTimersByTime(500));
    expect(baseElement).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(2600));
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('消息推送')).toBeInTheDocument();
  });
});
