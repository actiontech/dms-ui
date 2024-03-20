import { useNavigate } from 'react-router-dom';
import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { superRender } from '../../../testUtils/customRender';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';

import syncTaskList from '../../../testUtils/mockApi/syncTaskList';
import SyncTaskList from '.';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';

jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn()
  };
});

describe('page/SyncDataSource/SyncTaskList', () => {
  const navigateSpy = jest.fn();
  const projectID = mockProjectInfo.projectID;

  const customRender = () => {
    return superRender(<SyncTaskList />);
  };

  beforeEach(() => {
    jest.useFakeTimers();
    (useNavigate as jest.Mock).mockImplementation(() => navigateSpy);
    mockUseCurrentProject();
    mockUseCurrentUser();
    syncTaskList.mockAllApi();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
  });

  it('render list snap when no projectID', async () => {
    mockUseCurrentProject({ projectID: '' });
    const { baseElement } = customRender();

    expect(screen.getByText('同步任务列表')).toBeInTheDocument();
    expect(screen.getByText('添加同步任务')).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();

    await act(async () => jest.advanceTimersByTime(3300));
    expect(baseElement).toMatchSnapshot();
  });

  it('render list snap', async () => {
    const requestList = syncTaskList.getTaskSourceList();
    const { baseElement } = customRender();

    await act(async () => jest.advanceTimersByTime(300));
    expect(baseElement).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestList).toHaveBeenCalled();
    expect(baseElement).toMatchSnapshot();
  });

  it('render list action when no permission', async () => {
    mockUseCurrentUser({ isAdmin: false });
    const requestList = syncTaskList.getTaskSourceList();
    const { baseElement } = customRender();

    await act(async () => jest.advanceTimersByTime(3300));
    expect(requestList).toHaveBeenCalled();
    expect(baseElement).toMatchSnapshot();
  });

  it('render list column data for table', async () => {
    const requestTableList = syncTaskList.getTaskSourceList();
    requestTableList.mockImplementationOnce(() =>
      createSpySuccessResponse({
        total_nums: 2,
        data: [
          {
            project_uid: projectID,
            name: 'test-mysql-1',
            uid: '0002',
            source: 'source1',
            url: 'http://192.168.1.1:3000',
            version: '4.2.2.0',
            cron_express: '0 0 * * *',
            sqle_config: {
              rule_template_id: '01',
              rule_template_name: 'global_rule_template_name1'
            }
          },
          {
            project_uid: projectID,
            name: 'test-oracle-1',
            db_type: 'oracle',
            uid: '1234',
            last_sync_success_time: '2023-01-10',
            source: 'source1',
            url: 'http://192.168.1.1:3000',
            version: '4.2.2.0',
            cron_express: '0 0 * * *'
          }
        ]
      })
    );
    const { baseElement } = customRender();

    await act(async () => jest.advanceTimersByTime(3300));
    expect(requestTableList).toHaveBeenCalled();
    expect(baseElement).toMatchSnapshot();
  });

  it('render edit action', async () => {
    const requestTableList = syncTaskList.getTaskSourceList();
    requestTableList.mockImplementationOnce(() =>
      createSpySuccessResponse({
        total_nums: 1,
        data: [
          {
            project_uid: projectID,
            name: 'test-oracle-1',
            db_type: 'oracle',
            uid: '1234',
            last_sync_success_time: '2023-01-10',
            source: 'source1',
            url: 'http://192.168.1.1:3000',
            version: '4.2.2.0',
            cron_express: '0 0 * * *'
          }
        ]
      })
    );
    customRender();

    await act(async () => jest.advanceTimersByTime(3300));
    fireEvent.click(screen.getByText('编 辑'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(navigateSpy).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(
      `/project/${projectID}/sync-data-source/update/1234`
    );
  });

  it('render delete action', async () => {
    const requestDel = syncTaskList.deleteTaskSource();
    const requestTableList = syncTaskList.getTaskSourceList();
    requestTableList.mockImplementationOnce(() =>
      createSpySuccessResponse({
        total_nums: 1,
        data: [
          {
            project_uid: projectID,
            name: 'test-oracle-1',
            db_type: 'oracle',
            uid: '1234',
            last_sync_success_time: '2023-01-10',
            source: 'source1',
            url: 'http://192.168.1.1:3000',
            version: '4.2.2.0',
            cron_express: '0 0 * * *'
          }
        ]
      })
    );
    customRender();

    await act(async () => jest.advanceTimersByTime(3300));
    fireEvent.click(screen.getByText('删 除'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(screen.getByText('确定要删除当前同步任务?')).toBeInTheDocument();
    fireEvent.click(screen.getByText('确 认'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(screen.getByText('正在删除任务...')).toBeInTheDocument();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestDel).toHaveBeenCalled();
    expect(requestDel).toHaveBeenCalledWith({
      database_source_service_uid: '1234',
      project_uid: projectID
    });
    expect(screen.getByText('删除任务成功')).toBeInTheDocument();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestTableList).toHaveBeenCalled();
  });

  it('render async btn action', async () => {
    const requestSyncTask = syncTaskList.syncTaskSource();
    const requestTableList = syncTaskList.getTaskSourceList();
    requestTableList.mockImplementationOnce(() =>
      createSpySuccessResponse({
        total_nums: 1,
        data: [
          {
            project_uid: projectID,
            name: 'test-oracle-1',
            db_type: 'oracle',
            uid: '1234',
            last_sync_success_time: '2023-01-10',
            source: 'source1',
            url: 'http://192.168.1.1:3000',
            version: '4.2.2.0',
            cron_express: '0 0 * * *'
          }
        ]
      })
    );
    customRender();

    await act(async () => jest.advanceTimersByTime(3300));
    fireEvent.click(screen.getByText('同 步'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(screen.getByText('正在同步任务...')).toBeInTheDocument();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestSyncTask).toHaveBeenCalled();
    expect(requestSyncTask).toHaveBeenCalledWith({
      database_source_service_uid: '1234',
      project_uid: projectID
    });
    expect(screen.getByText('同步任务成功')).toBeInTheDocument();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestTableList).toHaveBeenCalled();
  });

  // 同 步
});
