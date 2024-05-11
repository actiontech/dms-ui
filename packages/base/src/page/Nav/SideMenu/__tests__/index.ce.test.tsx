/**
 * @test_version ce
 */

import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { superRender } from '../../../../testUtils/customRender';
import { mockSystemConfig } from '../../../../testUtils/mockHooks/mockSystemConfig';
import CESideMenu from '../index.ce';
import { act } from '@testing-library/react';
import { mockUseCurrentPermission } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentPermission';

describe('test base/Nav/SideMenu/index.ce', () => {
  beforeEach(() => {
    mockSystemConfig();
    mockUseCurrentUser();
    mockUseCurrentPermission();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });
  it('should match snapshot', async () => {
    const { container } = superRender(<CESideMenu />);
    await act(async () => jest.advanceTimersByTime(0));
    expect(container).toMatchSnapshot();
  });
});
