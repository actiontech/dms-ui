import UserMenu from '.';
import { cleanup } from '@testing-library/react';
import { SupportTheme } from 'sqle/src/theme';
import { SupportLanguage } from '@actiontech/shared/lib/enum';
import { mockUsePermission } from '@actiontech/shared/lib/testUtil/mockHook/mockUsePermission';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

describe('base/Nav/SideMenu/UserMenu', () => {
  const customRender = (
    isAdmin: boolean = true,
    isCertainProjectManager = true,
    hasGlobalViewingPermission = true
  ) => {
    return superRender(
      <UserMenu
        hasGlobalViewingPermission={hasGlobalViewingPermission}
        language={SupportLanguage.zhCN}
        isAdmin={isAdmin}
        username="Admin"
        theme={SupportTheme.LIGHT}
        updateTheme={jest.fn()}
        isCertainProjectManager={isCertainProjectManager}
      />
    );
  };

  beforeEach(() => {
    mockUsePermission(undefined, { useSpyOnMockHooks: true });
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

  it('render snap when current is not admin or certain project manager and has not global view permission', () => {
    const { baseElement } = customRender(false, false, false);
    expect(baseElement).toMatchSnapshot();
  });
});
