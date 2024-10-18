import { cleanup, act, fireEvent, screen } from '@testing-library/react';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { mockUseDbServiceDriver } from '@actiontech/shared/lib/testUtil/mockHook/mockUseDbServiceDriver';
import workflow from '../../../testUtils/mockApi/execWorkflow';
import sqlManage from '../../../testUtils/mockApi/sqlManage';
import instance from '../../../testUtils/mockApi/instance';
import { instanceTipsMockData } from '../../../testUtils/mockApi/instance/data';
import { superRender } from '../../../testUtils/customRender';
import GlobalDashboard from '../index';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';

describe('sqle/GlobalDashboard', () => {
  let getGlobalWorkflowsSpy: jest.SpyInstance;
  let getGlobalSqlManageList: jest.SpyInstance;
  let getInstanceTipListSpy: jest.SpyInstance;
  beforeEach(() => {
    jest.useFakeTimers();
    mockUseCurrentProject();
    mockUseCurrentUser();
    mockUseDbServiceDriver();
    getGlobalWorkflowsSpy = workflow.getGlobalWorkflows();
    getGlobalSqlManageList = sqlManage.getGlobalSqlManageList();
    getInstanceTipListSpy = instance.getInstanceTipList();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('render init snap shot', async () => {
    const { baseElement } = superRender(<GlobalDashboard />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(getGlobalWorkflowsSpy).toHaveBeenCalledTimes(1);
  });

  it('render filter list', async () => {
    superRender(<GlobalDashboard />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getGlobalWorkflowsSpy).toHaveBeenCalledTimes(1);

    fireEvent.mouseDown(getBySelector('#projectId'));
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(getBySelector('div[title="default"]'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(getInstanceTipListSpy).toHaveBeenCalledTimes(1);
    expect(getGlobalWorkflowsSpy).toHaveBeenCalledTimes(2);

    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.mouseDown(getBySelector('#instanceId'));
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(getBySelector('div[title="default"]'));

    const instance = instanceTipsMockData[0];
    fireEvent.click(
      getBySelector(
        `div[title="${instance.instance_name}(${instance.host}:${instance.port})"]`
      )
    );
    await act(async () => jest.advanceTimersByTime(0));
    expect(getGlobalWorkflowsSpy).toHaveBeenCalledTimes(3);

    fireEvent.mouseDown(getBySelector('#projectPriority'));
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(getBySelector('div[title="高"]'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(getGlobalWorkflowsSpy).toHaveBeenCalledTimes(4);
  });

  it('test refresh list', async () => {
    superRender(<GlobalDashboard />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getGlobalWorkflowsSpy).toHaveBeenCalledTimes(1);

    const refreshBtn = getBySelector('.custom-icon-refresh').closest('button')!;
    fireEvent.click(refreshBtn);
    await act(async () => jest.advanceTimersByTime(0));
    expect(getGlobalWorkflowsSpy).toHaveBeenCalledTimes(2);

    fireEvent.click(screen.getByText('待解决SQL'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(getGlobalSqlManageList).toHaveBeenCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(refreshBtn);
    await act(async () => jest.advanceTimersByTime(0));
    expect(getGlobalSqlManageList).toHaveBeenCalledTimes(2);

    fireEvent.click(screen.getByText('发起的工单'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(getGlobalWorkflowsSpy).toHaveBeenCalledTimes(3);
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(refreshBtn);
    await act(async () => jest.advanceTimersByTime(0));
    expect(getGlobalWorkflowsSpy).toHaveBeenCalledTimes(4);
  });
});
