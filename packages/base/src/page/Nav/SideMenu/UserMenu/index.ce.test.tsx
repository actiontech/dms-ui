/**
 * @test_version ce
 */

import UserMenu from '.';
import { cleanup } from '@testing-library/react';
import { SupportTheme } from 'sqle/src/theme';
import { SupportLanguage } from '@actiontech/dms-kit';
import { mockUsePermission } from '@actiontech/shared/lib/testUtil/mockHook/mockUsePermission';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';

describe('base/Nav/SideMenu/UserMenu', () => {
  beforeEach(() => {
    mockUsePermission(undefined, { useSpyOnMockHooks: true });
    mockUseCurrentUser();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('should match snapshot', () => {
    expect(
      toJson(
        shallow(
          <UserMenu
            language={SupportLanguage.zhCN}
            username="Admin"
            theme={SupportTheme.LIGHT}
            updateTheme={jest.fn()}
          />
        )
      )
    ).toMatchSnapshot();
  });
});
