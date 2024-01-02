import Router, { useNavigate } from 'react-router-dom';
import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { superRender } from '../../../testUtils/customRender';
import {
  getAllBySelector,
  getBySelector
} from '@actiontech/shared/lib/testUtil/customQuery';

import syncTaskList from '../../../testUtils/mockApi/syncTaskList';
import ruleTemplate from 'sqle/src/testUtils/mockApi/rule_template';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { taskList } from '../../../testUtils/mockApi/syncTaskList/data';

import EmitterKey from '../../../data/EmitterKey';
import EventEmitter from '../../../utils/EventEmitter';

import UpdateSyncTask from '.';

jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn()
  };
});

describe('page/SyncDataSource/UpdateSyncTask', () => {
  const navigateSpy = jest.fn();
  const projectID = mockProjectInfo.projectID;
  const taskId = '1739531854064652288';

  const customRender = () => {
    return superRender(<UpdateSyncTask />);
  };

  beforeEach(() => {
    jest.useFakeTimers();
    (useNavigate as jest.Mock).mockImplementation(() => navigateSpy);
    jest.spyOn(Router, 'useParams').mockReturnValue({
      taskId
    });
    syncTaskList.mockAllApi();
    ruleTemplate.mockAllApi();
    mockUseCurrentProject();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
  });

  it('render edit database snap', async () => {
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(1000));

    expect(screen.getByText('返回同步任务列表')).toBeInTheDocument();
    expect(screen.getByText('编辑同步任务')).toBeInTheDocument();
    expect(screen.getByText('提 交')).toBeInTheDocument();
    expect(screen.getByText('基础配置')).toBeInTheDocument();
    expect(screen.getByText('SQL审核配置')).toBeInTheDocument();

    expect(baseElement).toMatchSnapshot();
  });

  it('render taskId is null', async () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({
      taskId: ''
    });
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(1000));

    expect(baseElement).toMatchSnapshot();
    fireEvent.click(screen.getByText('重 试'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(baseElement).toMatchSnapshot();
  });

  it('render click reset btn', async () => {
    const eventEmitSpy = jest.spyOn(EventEmitter, 'emit');
    const requestDetail = syncTaskList.getTaskSource();
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(300));
    expect(baseElement).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestDetail).toBeCalled();
    expect(requestDetail).toBeCalledWith({
      database_source_service_uid: taskId,
      project_uid: projectID
    });
    expect(baseElement).toMatchSnapshot();

    fireEvent.click(screen.getByText('重 置'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(eventEmitSpy).toBeCalledWith(EmitterKey.DMS_SYNC_TASK_RESET_FORM);
  });

  it('render update task submit', async () => {
    const requestDetail = syncTaskList.getTaskSource();
    const requestUpdate = syncTaskList.updateTaskSource();
    const detailInfo = { ...taskList[0] };
    delete detailInfo.uid;
    delete detailInfo.last_sync_success_time;
    delete detailInfo.project_uid;
    customRender();
    await act(async () => jest.advanceTimersByTime(3300));
    expect(requestDetail).toBeCalled();
    fireEvent.click(screen.getByText('提 交'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(screen.getByText('提 交').parentNode).toHaveClass('ant-btn-loading');
    expect(screen.getByText('重 置').parentNode).toHaveAttribute('disabled');
    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestUpdate).toBeCalled();
    expect(requestUpdate).toBeCalledWith({
      database_source_service: {
        ...detailInfo
      },
      database_source_service_uid: taskId,
      project_uid: projectID
    });
    expect(screen.getByText('同步任务编辑成功')).toBeInTheDocument();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(navigateSpy).toBeCalled();
    expect(navigateSpy).toBeCalledWith(`/project/${projectID}/syncDataSource`, {
      replace: true
    });
  });
});
