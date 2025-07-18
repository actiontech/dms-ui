import { useNavigate } from 'react-router-dom';
import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { baseSuperRender } from '../../../testUtils/superRender';
import syncTaskList from '@actiontech/shared/lib/testUtil/mockApi/base/syncTaskList';
import SyncTaskList from '.';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { syncTaskListMockData } from '@actiontech/shared/lib/testUtil/mockApi/base/syncTaskList/data';
import { SystemRole } from '@actiontech/shared/lib/enum';

jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn()
  };
});

describe('page/SyncDataSource/SyncTaskList', () => {
  const navigateSpy = jest.fn();
  let requestTableList: jest.SpyInstance;
  const customRender = () => {
    return baseSuperRender(<SyncTaskList />);
  };

  beforeEach(() => {
    jest.useFakeTimers();
    (useNavigate as jest.Mock).mockImplementation(() => navigateSpy);
    mockUseCurrentUser();
    syncTaskList.mockAllApi();
    requestTableList = syncTaskList.getTaskSourceList();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
  });

  it('render list snap', async () => {
    const requestList = syncTaskList.getTaskSourceList();
    const { baseElement } = customRender();

    expect(baseElement).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestList).toHaveBeenCalled();
    expect(baseElement).toMatchSnapshot();
  });

  it('render list action when no permission', async () => {
    mockUseCurrentUser({ isAdmin: false });
    const requestList = syncTaskList.getTaskSourceList();
    const { baseElement } = customRender();

    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestList).toHaveBeenCalled();
    expect(baseElement).toMatchSnapshot();
  });

  it('render delete action', async () => {
    const requestDel = syncTaskList.deleteTaskSource();
    customRender();
    expect(requestTableList).toHaveBeenCalledTimes(1);

    await act(async () => jest.advanceTimersByTime(3300));
    fireEvent.click(screen.getAllByText('删 除')[1]);
    await act(async () => jest.advanceTimersByTime(300));
    expect(screen.getByText('确定要删除当前同步任务?')).toBeInTheDocument();
    fireEvent.click(screen.getByText('确 认'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(screen.getByText('正在删除任务...')).toBeInTheDocument();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestDel).toHaveBeenCalledWith({
      db_service_sync_task_uid: syncTaskListMockData[1].uid
    });
    expect(screen.getByText('删除任务成功')).toBeInTheDocument();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestTableList).toHaveBeenCalledTimes(2);
  });

  it('render async btn action', async () => {
    const requestSyncTask = syncTaskList.syncTaskSource();

    customRender();

    await act(async () => jest.advanceTimersByTime(3300));
    fireEvent.click(screen.getAllByText('同 步')[0]);
    await act(async () => jest.advanceTimersByTime(300));
    expect(screen.getByText('正在同步任务...')).toBeInTheDocument();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestSyncTask).toHaveBeenCalled();
    expect(requestSyncTask).toHaveBeenCalledWith({
      db_service_sync_task_uid: syncTaskListMockData[0].uid
    });
    expect(screen.getByText('同步任务成功')).toBeInTheDocument();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestTableList).toHaveBeenCalledTimes(2);
  });

  it('should not render action column when user no operation permissions', async () => {
    mockUseCurrentUser({
      userRoles: {
        [SystemRole.admin]: false,
        [SystemRole.systemAdministrator]: false,
        [SystemRole.auditAdministrator]: false,
        [SystemRole.projectDirector]: false,
        [SystemRole.certainProjectManager]: true
      }
    });

    const { container } = customRender();

    await act(async () => jest.advanceTimersByTime(3000));

    expect(container).toMatchSnapshot();
    expect(screen.queryAllByText('删 除')).toHaveLength(0);
    expect(screen.queryAllByText('编 辑')).toHaveLength(0);
  });
});
