import { cleanup, act, fireEvent, screen } from '@testing-library/react';
import MenuList from '.';

import { superRender } from '../../../../testUtils/customRender';
import { useNavigate } from 'react-router-dom';

const projectID = '700300';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn()
}));

describe('base/page/Nav/SideMenu/MenuList', () => {
  const navigateSpy = jest.fn();
  const customRender = (isAdmin = false) => {
    return superRender(<MenuList projectID={projectID} isAdmin={isAdmin} />);
  };

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
    const { baseElement } = customRender(true);

    await act(async () => jest.advanceTimersByTime(500));
    expect(baseElement).toMatchSnapshot();

    fireEvent.click(screen.getByText('数据源管理'));
    expect(baseElement).toMatchSnapshot();

    fireEvent.click(screen.getByText('数据源'));
    expect(navigateSpy).toBeCalledTimes(1);
    expect(navigateSpy).nthCalledWith(1, `/project/${projectID}/db-services`);

    fireEvent.click(screen.getByText('外部数据源'));
    expect(navigateSpy).toBeCalledTimes(2);
    expect(navigateSpy).nthCalledWith(
      2,
      `/project/${projectID}/syncDataSource`
    );

    fireEvent.click(screen.getByText('成员与权限'));
    expect(navigateSpy).toBeCalledTimes(3);
    expect(navigateSpy).nthCalledWith(3, `/project/${projectID}/member`);

    fireEvent.click(screen.getByText('SQL开发'));
    expect(baseElement).toMatchSnapshot();

    fireEvent.click(screen.getByText('SQL工作台'));
    expect(navigateSpy).toBeCalledTimes(4);
    expect(navigateSpy).nthCalledWith(4, `/cloudBeaver`);

    fireEvent.click(screen.getByText('数据导出'));
    expect(navigateSpy).toBeCalledTimes(5);
    expect(navigateSpy).nthCalledWith(5, `/project/${projectID}/data/export`);

    fireEvent.click(screen.getByText('项目概览'));
    expect(navigateSpy).toBeCalledTimes(6);
    expect(navigateSpy).nthCalledWith(6, `/sqle/project/${projectID}/overview`);

    fireEvent.click(screen.getByText('待关注清单'));
    expect(navigateSpy).toBeCalledTimes(7);
    expect(navigateSpy).nthCalledWith(
      7,
      `/sqle/project/${projectID}/dashboard`
    );

    fireEvent.click(screen.getAllByText('SQL审核')[0]);
    expect(baseElement).toMatchSnapshot();

    fireEvent.click(screen.getByText('规则模板'));
    expect(navigateSpy).toBeCalledTimes(8);
    expect(navigateSpy).nthCalledWith(
      8,
      `/sqle/project/${projectID}/rule/template`
    );

    fireEvent.click(screen.getByText('白名单'));
    expect(navigateSpy).toBeCalledTimes(9);
    expect(navigateSpy).nthCalledWith(
      9,
      `/sqle/project/${projectID}/whitelist`
    );

    fireEvent.click(screen.getByText('流程模板'));
    expect(navigateSpy).toBeCalledTimes(10);
    expect(navigateSpy).nthCalledWith(
      10,
      `/sqle/project/${projectID}/progress`
    );

    fireEvent.click(screen.getByText('SQL管控'));
    expect(navigateSpy).toBeCalledTimes(11);
    expect(navigateSpy).nthCalledWith(
      11,
      `/sqle/project/${projectID}/sqlManagement`
    );

    fireEvent.click(screen.getAllByText('SQL审核')[1]);
    expect(navigateSpy).toBeCalledTimes(12);
    expect(navigateSpy).nthCalledWith(
      12,
      `/sqle/project/${projectID}/sqlAudit`
    );

    fireEvent.click(screen.getByText('SQL工单'));
    expect(navigateSpy).toBeCalledTimes(13);
    expect(navigateSpy).nthCalledWith(13, `/sqle/project/${projectID}/order`);

    fireEvent.click(screen.getByText('扫描任务'));
    expect(navigateSpy).toBeCalledTimes(14);
    expect(navigateSpy).nthCalledWith(
      14,
      `/sqle/project/${projectID}/auditPlan`
    );

    fireEvent.click(screen.getByText('操作与审计'));
    expect(navigateSpy).toBeCalledTimes(15);
    expect(navigateSpy).nthCalledWith(
      15,
      `/sqle/project/${projectID}/operationRecord`
    );
  });

  it('render is not admin snap when has location pathname', async () => {
    const { baseElement } = superRender(
      <MenuList projectID={projectID} isAdmin={false} />,
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
      <MenuList projectID={projectID} isAdmin={true} />,
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
