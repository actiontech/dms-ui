import { cleanup, act } from '@testing-library/react';
import MenuList from '.';
import { baseSuperRender } from '../../../../testUtils/superRender';
import { useNavigate } from 'react-router-dom';
import {
  ignoreConsoleErrors,
  UtilsConsoleErrorStringsEnum
} from '@actiontech/shared/lib/testUtil/common';
import { mockUsePermission } from '@actiontech/shared/lib/testUtil/mockHook/mockUsePermission';

const projectID = '700300';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn()
}));

/**
 * EE/DMS 模式（dms=true）：DMS_ALL_MENUS 和 DMS_MENU_STRUCT 均为空数组（由 dms-ui-ee 维护），
 * 因此菜单在此仓库中渲染为空。验证组件在 DMS 模式下不崩溃并渲染空菜单。
 */
describe('base/page/Nav/SideMenu/MenuList - dms mode', () => {
  const navigateSpy = jest.fn();

  ignoreConsoleErrors([UtilsConsoleErrorStringsEnum.INVALID_CUSTOM_ATTRIBUTE]);

  beforeEach(() => {
    jest.useFakeTimers();
    (useNavigate as jest.Mock).mockImplementation(() => navigateSpy);
    mockUsePermission(undefined, { useSpyOnMockHooks: true });
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('renders empty menu in dms mode - snapshot', async () => {
    const { baseElement } = baseSuperRender(<MenuList projectID={projectID} />);
    await act(async () => jest.advanceTimersByTime(500));
    expect(baseElement).toMatchSnapshot();
  });

  it('renders empty menu with location path in dms mode - snapshot', async () => {
    const { baseElement } = baseSuperRender(
      <MenuList projectID={projectID} />,
      undefined,
      {
        routerProps: {
          initialEntries: [`/project/${projectID}/member`]
        }
      }
    );
    await act(async () => jest.advanceTimersByTime(500));
    expect(baseElement).toMatchSnapshot();
  });
});
