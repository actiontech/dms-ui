import { cleanup, act, fireEvent, screen } from '@testing-library/react';
import MenuList from '.';
import { ignoreComponentCustomAttr } from '@actiontech/shared/lib/testUtil/common';
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

  ignoreComponentCustomAttr();
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
    expect(navigateSpy).toHaveBeenCalledTimes(1);
    expect(navigateSpy).toHaveBeenNthCalledWith(
      1,
      `/project/${projectID}/db-services`
    );

    fireEvent.click(screen.getByText('外部数据源'));
    expect(navigateSpy).toHaveBeenCalledTimes(2);
    expect(navigateSpy).toHaveBeenNthCalledWith(
      2,
      `/project/${projectID}/sync-data-source`
    );

    fireEvent.click(screen.getByText('成员与权限'));
    expect(navigateSpy).toHaveBeenCalledTimes(3);
    expect(navigateSpy).toHaveBeenNthCalledWith(
      3,
      `/project/${projectID}/member`
    );

    fireEvent.click(screen.getByText('SQL开发'));
    expect(baseElement).toMatchSnapshot();

    fireEvent.click(screen.getByText('SQL工作台'));
    expect(navigateSpy).toHaveBeenCalledTimes(4);
    expect(navigateSpy).toHaveBeenNthCalledWith(4, `/cloud-beaver`);

    fireEvent.click(screen.getByText('数据导出'));
    expect(navigateSpy).toHaveBeenCalledTimes(5);
    expect(navigateSpy).toHaveBeenNthCalledWith(
      5,
      `/project/${projectID}/data/export`
    );

    fireEvent.click(screen.getByText('项目概览'));
    expect(navigateSpy).toHaveBeenCalledTimes(6);
    expect(navigateSpy).toHaveBeenNthCalledWith(
      6,
      `/sqle/project/${projectID}/overview`
    );

    fireEvent.click(screen.getByText('待关注清单'));
    expect(navigateSpy).toHaveBeenCalledTimes(7);
    expect(navigateSpy).toHaveBeenNthCalledWith(
      7,
      `/sqle/project/${projectID}/dashboard`
    );

    fireEvent.click(screen.getAllByText('SQL审核')[0]);
    expect(navigateSpy).toHaveBeenCalledTimes(8);
    expect(navigateSpy).toHaveBeenNthCalledWith(
      8,
      `/sqle/project/${projectID}/sql-audit`
    );

    fireEvent.click(screen.getByText('IDE审核'));
    expect(navigateSpy).toHaveBeenCalledTimes(9);
    expect(navigateSpy).toHaveBeenNthCalledWith(
      9,
      `/sqle/project/${projectID}/plugin-audit`
    );

    fireEvent.click(screen.getAllByText('SQL审核')[1]);
    expect(baseElement).toMatchSnapshot();

    fireEvent.click(screen.getByText('规则模板'));
    expect(navigateSpy).toHaveBeenCalledTimes(10);
    expect(navigateSpy).toHaveBeenNthCalledWith(
      10,
      `/sqle/project/${projectID}/rule/template`
    );

    fireEvent.click(screen.getByText('白名单'));
    expect(navigateSpy).toHaveBeenCalledTimes(11);
    expect(navigateSpy).toHaveBeenNthCalledWith(
      11,
      `/sqle/project/${projectID}/whitelist`
    );

    fireEvent.click(screen.getByText('流程模板'));
    expect(navigateSpy).toHaveBeenCalledTimes(12);
    expect(navigateSpy).toHaveBeenNthCalledWith(
      12,
      `/sqle/project/${projectID}/progress`
    );

    fireEvent.click(screen.getByText('SQL管控'));
    expect(navigateSpy).toHaveBeenCalledTimes(13);
    expect(navigateSpy).toHaveBeenNthCalledWith(
      13,
      `/sqle/project/${projectID}/sql-management`
    );

    fireEvent.click(screen.getByText('SQL工单'));
    expect(navigateSpy).toHaveBeenCalledTimes(14);
    expect(navigateSpy).toHaveBeenNthCalledWith(
      14,
      `/sqle/project/${projectID}/order`
    );

    fireEvent.click(screen.getByText('扫描任务'));
    expect(navigateSpy).toHaveBeenCalledTimes(15);
    expect(navigateSpy).toHaveBeenNthCalledWith(
      15,
      `/sqle/project/${projectID}/audit-plan`
    );

    fireEvent.click(screen.getByText('操作与审计'));
    expect(navigateSpy).toHaveBeenCalledTimes(15);
    expect(baseElement).toMatchSnapshot();

    fireEvent.click(screen.getByText('SQLE操作记录'));
    expect(navigateSpy).toHaveBeenCalledTimes(16);
    expect(navigateSpy).toHaveBeenNthCalledWith(
      16,
      `/sqle/project/${projectID}/operation-record`
    );

    fireEvent.click(screen.getByText('授权审计'));
    expect(navigateSpy).toHaveBeenCalledTimes(17);
    expect(navigateSpy).toHaveBeenNthCalledWith(
      17,
      `/provision/project/${projectID}/audit/auth`
    );

    fireEvent.click(screen.getByText('权限模版审计'));
    expect(navigateSpy).toHaveBeenCalledTimes(18);
    expect(navigateSpy).toHaveBeenNthCalledWith(
      18,
      `/provision/project/${projectID}/audit/template`
    );

    // fireEvent.click(screen.getByText('数据源操作审计'));
    // expect(navigateSpy).toHaveBeenCalledTimes(18);
    // expect(navigateSpy).nthCalledWith(
    //   18,
    //   `/provision/project/${projectID}/audit/service`
    // );

    fireEvent.click(screen.getByText('脱敏规则'));
    expect(navigateSpy).toHaveBeenCalledTimes(19);
    expect(navigateSpy).toHaveBeenNthCalledWith(
      19,
      `/project/${projectID}/data-mask-rule-overview`
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
