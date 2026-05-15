import UserMenu from '.';
import { cleanup } from '@testing-library/react';
import { SupportTheme } from 'sqle/src/theme';
import { SupportLanguage } from '@actiontech/dms-kit';
import { mockUsePermission } from '@actiontech/shared/lib/testUtil/mockHook/mockUsePermission';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { mockUseChangeTheme } from '@actiontech/shared/lib/testUtil/mockHook/mockUseChangeTheme';

describe('base/Nav/SideMenu/UserMenu', () => {
  beforeEach(() => {
    mockUsePermission(undefined, { useSpyOnMockHooks: true });
    mockUseChangeTheme();
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
