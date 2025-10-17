/**
 * @test_version ce
 */

import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { mockUsePermission } from '@actiontech/shared/lib/testUtil/mockHook/mockUsePermission';
import { baseSuperRender } from '../../../../testUtils/superRender';
import { mockSystemConfig } from '../../../../testUtils/mockHooks/mockSystemConfig';
import CESideMenu from '../index.ce';
import { act } from '@testing-library/react';
import system from '@actiontech/shared/lib/testUtil/mockApi/base/system';
import { mockUseUserInfo } from '@actiontech/shared/lib/testUtil/mockHook/mockUseUserInfo';

describe('test base/Nav/SideMenu/index.ce', () => {
  let getSystemModuleRedDotsSpy: jest.SpyInstance;
  beforeEach(() => {
    mockSystemConfig();
    mockUseCurrentUser();
    mockUseUserInfo();
    mockUsePermission(undefined, {
      useSpyOnMockHooks: true
    });
    jest.useFakeTimers();
    getSystemModuleRedDotsSpy = system.getSystemModuleRedDots();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });
  it('should match snapshot', async () => {
    const { container } = baseSuperRender(<CESideMenu />);
    await act(async () => jest.advanceTimersByTime(0));
    expect(container).toMatchSnapshot();
    expect(getSystemModuleRedDotsSpy).toHaveBeenCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(container).toMatchSnapshot();
  });
});
