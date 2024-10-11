import { cleanup, act } from '@testing-library/react';
import MenuList from '.';
import { superRender } from '../../../../testUtils/customRender';
import { useNavigate } from 'react-router-dom';
import { SystemRole } from '@actiontech/shared/lib/enum';
import {
  ignoreConsoleErrors,
  UtilsConsoleErrorStringsEnum
} from '@actiontech/shared/lib/testUtil/common';

const projectID = '700300';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn()
}));

/**
 * 为了保证数据源的测试代码与 dms-ui-ee 中同步，现在的环境变量中的 dms 为 true，在该环境下左侧菜单的数据为空，所以这个文件的单元测试暂时没有任何意义了
 * 暂时先跳过，解决单元测试项目的条件编译时来处理
 */

describe.skip('base/page/Nav/SideMenu/MenuList', () => {
  const navigateSpy = jest.fn();
  const customRender = (role: SystemRole | '' = '') => {
    return superRender(
      <MenuList
        projectID={projectID}
        userRoles={{
          [SystemRole.admin]: true,
          [SystemRole.certainProjectManager]: true,
          [SystemRole.globalViewing]: false
        }}
      />
    );
  };

  ignoreConsoleErrors([UtilsConsoleErrorStringsEnum.INVALID_CUSTOM_ATTRIBUTE]);

  beforeEach(() => {
    jest.useFakeTimers();
    (useNavigate as jest.Mock).mockImplementation(() => navigateSpy);
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('render snap when is not admin', async () => {
    const { baseElement } = customRender();

    await act(async () => jest.advanceTimersByTime(500));
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when is admin', async () => {
    const { baseElement } = customRender(SystemRole.admin);

    await act(async () => jest.advanceTimersByTime(500));
    expect(baseElement).toMatchSnapshot();
  });

  it('render is not admin snap when has location pathname', async () => {
    const { baseElement } = superRender(
      <MenuList
        projectID={projectID}
        userRoles={{
          [SystemRole.admin]: true,
          [SystemRole.certainProjectManager]: true,
          [SystemRole.globalViewing]: false
        }}
      />,
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

  it('render is admin snap when has location pathname', async () => {
    const { baseElement } = superRender(
      <MenuList
        projectID={projectID}
        userRoles={{
          [SystemRole.admin]: true,
          [SystemRole.certainProjectManager]: true,
          [SystemRole.globalViewing]: false
        }}
      />,
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
