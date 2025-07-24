/**
 * @test_version ce
 */
import GlobalSetting from '.';
import system from '@actiontech/shared/lib/testUtil/mockApi/base/system';
import { cleanup, act } from '@testing-library/react';
import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';

describe('base/System/GlobalSetting ce', () => {
  let requestGetSystemVariables: jest.SpyInstance;

  beforeEach(() => {
    mockUseCurrentUser();
    jest.useFakeTimers();
    requestGetSystemVariables = system.getSystemVariables();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
  });

  it('render snap', async () => {
    const { baseElement } = superRender(<GlobalSetting />);
    await act(async () => jest.advanceTimersByTime(500));
    expect(baseElement).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(2600));
    expect(requestGetSystemVariables).toHaveBeenCalled();
    expect(baseElement).toMatchSnapshot();
  });
});
