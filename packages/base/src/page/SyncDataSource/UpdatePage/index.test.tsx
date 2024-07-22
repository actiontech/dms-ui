import Router, { useNavigate } from 'react-router-dom';
import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { superRender } from '../../../testUtils/customRender';
import syncTaskList from '../../../testUtils/mockApi/syncTaskList';
import ruleTemplate from 'sqle/src/testUtils/mockApi/rule_template';
import EmitterKey from '../../../data/EmitterKey';
import EventEmitter from '../../../utils/EventEmitter';
import UpdateSyncTask from '.';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import { DataSourceManagerSegmentedKey } from '../../DataSourceManagement/index.type';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import { syncTaskDetailMockData } from '../../../testUtils/mockApi/syncTaskList/data';

jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn()
  };
});

describe('page/SyncDataSource/UpdateSyncTask', () => {
  const navigateSpy = jest.fn();
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
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
  });

  it('render edit database snap', async () => {
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));

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
    expect(baseElement).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestDetail).toHaveBeenCalled();
    expect(requestDetail).toHaveBeenCalledWith({
      db_service_sync_task_uid: taskId
    });
    expect(baseElement).toMatchSnapshot();

    fireEvent.click(screen.getByText('重 置'));
    await act(async () => jest.advanceTimersByTime(0));

    expect(eventEmitSpy).toHaveBeenCalledWith(
      EmitterKey.DMS_SYNC_TASK_RESET_FORM
    );
  });

  it('render update task submit', async () => {
    const requestDetail = syncTaskList.getTaskSource();
    const requestUpdate = syncTaskList.updateTaskSource();
    const { container } = customRender();

    expect(requestDetail).toHaveBeenCalled();
    await act(async () => jest.advanceTimersByTime(3300));

    expect(container).toMatchSnapshot();

    fireEvent.change(getBySelector('#url', container), {
      target: {
        value: 'http://192.168.1.3:3333'
      }
    });
    fireEvent.change(getBySelector('#params_key1', container), {
      target: { value: 'params__1' }
    });
    fireEvent.change(getBySelector('#params_key2', container), {
      target: { value: 432 }
    });
    fireEvent.click(getBySelector('#needAuditForSqlQuery', container));

    fireEvent.click(screen.getByText('提 交'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(screen.getByText('提 交').parentNode).toHaveClass('ant-btn-loading');
    expect(screen.getByText('重 置').parentNode).toHaveAttribute('disabled');
    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestUpdate).toHaveBeenCalled();
    expect(requestUpdate).toHaveBeenCalledWith({
      db_service_sync_task_uid: taskId,
      db_service_sync_task: {
        name: syncTaskDetailMockData.name,
        source: syncTaskDetailMockData.source,
        db_type: syncTaskDetailMockData.db_type,
        cron_express: syncTaskDetailMockData.cron_express,
        url: 'http://192.168.1.3:3333',
        sqle_config: {
          ...syncTaskDetailMockData.sqle_config,
          sql_query_config: {
            audit_enabled: false
          }
        },
        additional_params: [
          { key: 'key1', value: 'params__1' },
          { key: 'key2', value: '432' }
        ]
      }
    });
    expect(screen.getByText('同步任务编辑成功')).toBeInTheDocument();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(navigateSpy).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(
      `/data-source-management?active=${DataSourceManagerSegmentedKey.SyncDataSource}`,
      {
        replace: true
      }
    );
  });

  it('get task source failed', async () => {
    const requestDetail = syncTaskList.getTaskSource();
    requestDetail.mockImplementation(() =>
      createSpySuccessResponse({
        code: '500',
        message: 'error'
      })
    );
    const { baseElement } = customRender();
    expect(baseElement).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestDetail).toHaveBeenCalled();
    expect(requestDetail).toHaveBeenCalledWith({
      db_service_sync_task_uid: taskId
    });
    expect(baseElement).toMatchSnapshot();
  });
});
