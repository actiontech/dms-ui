import ProcessConnection from '.';

import system from '../../../testUtils/mockApi/system';
import { cleanup, act } from '@testing-library/react';
import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';

describe('base/System/ProcessConnection', () => {
  const customRender = () => {
    return superRender(<ProcessConnection />);
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
  });
});
