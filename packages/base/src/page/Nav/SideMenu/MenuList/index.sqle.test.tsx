import { cleanup, act } from '@testing-library/react';
import MenuList from '.';
import { baseSuperRender } from '../../../../testUtils/superRender';
import { useNavigate } from 'react-router-dom';
import {
  ignoreConsoleErrors,
  UtilsConsoleErrorStringsEnum
} from '@actiontech/shared/lib/testUtil/common';
import { mockUsePermission } from '@actiontech/shared/lib/testUtil/mockHook/mockUsePermission';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';

const projectID = '700300';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn()
}));

/**
 * SQLE 模式（sqle=true, dms=false）：使用 SQLE_ALL_MENUS + SQLE_MENU_STRUCT，
 * 菜单包含项目概览、SQL 开发、SQL 执行、SQL 管理、项目配置等分组。
 */
describe('base/Nav/SideMenu/MenuList - sqle mode', () => {
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

  describe('基础渲染', () => {
    it('renders SQLE menu structure - snapshot', async () => {
      const { baseElement } = baseSuperRender(
        <MenuList projectID={projectID} />
      );
      await act(async () => jest.advanceTimersByTime(500));
      expect(baseElement).toMatchSnapshot();
    });

    it('renders non-empty menu in SQLE mode', async () => {
      const { baseElement } = baseSuperRender(
        <MenuList projectID={projectID} />
      );
      await act(async () => jest.advanceTimersByTime(500));
      const menuItems = baseElement.querySelectorAll('.ant-menu-item');
      expect(menuItems.length).toBeGreaterThan(0);
    });

    it('renders project-overview menu item', async () => {
      const { getByText } = baseSuperRender(<MenuList projectID={projectID} />);
      await act(async () => jest.advanceTimersByTime(500));
      // i18n 翻译后的文本
      expect(getByText('项目概览')).toBeInTheDocument();
    });
  });

  describe('路由激活菜单', () => {
    it('selects project-overview when at sqle overview route', async () => {
      const { baseElement } = baseSuperRender(
        <MenuList projectID={projectID} />,
        undefined,
        {
          routerProps: {
            initialEntries: [`/sqle/project/${projectID}/overview`]
          }
        }
      );
      await act(async () => jest.advanceTimersByTime(500));
      expect(baseElement).toMatchSnapshot();
      const selectedItem = baseElement.querySelector('.ant-menu-item-selected');
      expect(selectedItem).toBeInTheDocument();
    });

    it('selects member when at member route', async () => {
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
      const selectedItem = baseElement.querySelector('.ant-menu-item-selected');
      expect(selectedItem).toBeInTheDocument();
    });

    it('selects exec-workflow when at exec-workflow route', async () => {
      const { baseElement } = baseSuperRender(
        <MenuList projectID={projectID} />,
        undefined,
        {
          routerProps: {
            initialEntries: [`/sqle/project/${projectID}/exec-workflow`]
          }
        }
      );
      await act(async () => jest.advanceTimersByTime(500));
      const selectedItem = baseElement.querySelector('.ant-menu-item-selected');
      expect(selectedItem).toBeInTheDocument();
    });

    it('selects rule-template by walking up nested sub-path', async () => {
      // selectMenuWrapper 会从深层路径逐级往上找，直到命中菜单 key
      const { baseElement } = baseSuperRender(
        <MenuList projectID={projectID} />,
        undefined,
        {
          routerProps: {
            initialEntries: [
              `/sqle/project/${projectID}/rule/template/detail/123`
            ]
          }
        }
      );
      await act(async () => jest.advanceTimersByTime(500));
      expect(baseElement).toMatchSnapshot();
      const selectedItem = baseElement.querySelector('.ant-menu-item-selected');
      expect(selectedItem).toBeInTheDocument();
    });

    it('selects sql-management when at sql-management route', async () => {
      const { baseElement } = baseSuperRender(
        <MenuList projectID={projectID} />,
        undefined,
        {
          routerProps: {
            initialEntries: [`/sqle/project/${projectID}/sql-management`]
          }
        }
      );
      await act(async () => jest.advanceTimersByTime(500));
      const selectedItem = baseElement.querySelector('.ant-menu-item-selected');
      expect(selectedItem).toBeInTheDocument();
    });
  });

  describe('权限过滤', () => {
    it('shows all items when userOperationPermissions is null (default) - snapshot', async () => {
      // userOperationPermissions 为 null 时跳过权限检查，所有菜单项均显示
      const { baseElement } = baseSuperRender(
        <MenuList projectID={projectID} />
      );
      await act(async () => jest.advanceTimersByTime(500));
      expect(baseElement).toMatchSnapshot();
    });

    it('hides permission-gated items when checkPagePermission returns false', async () => {
      mockUsePermission(
        {
          userOperationPermissions: [] as any,
          checkPagePermission: jest.fn().mockReturnValue(false)
        },
        { useSpyOnMockHooks: true }
      );
      const { baseElement } = baseSuperRender(
        <MenuList projectID={projectID} />
      );
      await act(async () => jest.advanceTimersByTime(500));
      expect(baseElement).toMatchSnapshot();
      // 权限控制的菜单项（如 rule-template、whitelist、member 等）应被隐藏
      // operateAndAudit 整个分组也有权限控制，应被完全隐藏
      expect(baseElement.querySelector('.ant-menu-item-group')).not.toBeNull();
    });

    it('shows all items when checkPagePermission returns true', async () => {
      mockUsePermission(
        {
          userOperationPermissions: [] as any,
          checkPagePermission: jest.fn().mockReturnValue(true)
        },
        { useSpyOnMockHooks: true }
      );
      const { baseElement } = baseSuperRender(
        <MenuList projectID={projectID} />
      );
      await act(async () => jest.advanceTimersByTime(500));
      expect(baseElement).toMatchSnapshot();
    });

    it('hides permission-gated items results in fewer menu items than when permitted', async () => {
      // 无权限时
      mockUsePermission(
        {
          userOperationPermissions: [] as any,
          checkPagePermission: jest.fn().mockReturnValue(false)
        },
        { useSpyOnMockHooks: true }
      );
      const { baseElement: noPermBaseElement } = baseSuperRender(
        <MenuList projectID={projectID} />
      );
      await act(async () => jest.advanceTimersByTime(500));
      const noPermMenuItems =
        noPermBaseElement.querySelectorAll('.ant-menu-item');

      cleanup();

      // 有权限时
      mockUsePermission(
        {
          userOperationPermissions: [] as any,
          checkPagePermission: jest.fn().mockReturnValue(true)
        },
        { useSpyOnMockHooks: true }
      );
      const { baseElement: withPermBaseElement } = baseSuperRender(
        <MenuList projectID={projectID} />
      );
      await act(async () => jest.advanceTimersByTime(500));
      const withPermMenuItems =
        withPermBaseElement.querySelectorAll('.ant-menu-item');

      expect(withPermMenuItems.length).toBeGreaterThan(noPermMenuItems.length);
    });
  });

  describe('连续分隔符处理', () => {
    it('does not render consecutive dividers', async () => {
      // 当权限过滤后相邻两个分隔符之间的分组被删除时，不应出现连续分隔符
      mockUsePermission(
        {
          userOperationPermissions: [] as any,
          // 只保留无权限控制的菜单项，让有权限控制的分组被清空
          checkPagePermission: jest.fn().mockReturnValue(false)
        },
        { useSpyOnMockHooks: true }
      );
      const { baseElement } = baseSuperRender(
        <MenuList projectID={projectID} />
      );
      await act(async () => jest.advanceTimersByTime(500));
      const dividers = baseElement.querySelectorAll('.ant-menu-item-divider');
      // 验证没有连续的分隔符：每个分隔符的下一个兄弟元素不应也是分隔符
      dividers.forEach((divider) => {
        const next = divider.nextElementSibling;
        if (next) {
          expect(next.classList.contains('ant-menu-item-divider')).toBe(false);
        }
      });
    });
  });
});
