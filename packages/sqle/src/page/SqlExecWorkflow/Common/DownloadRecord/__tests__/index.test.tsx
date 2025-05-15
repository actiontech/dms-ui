import DownloadRecord from '..';
import { sqleSuperRender } from '../../../../../testUtils/superRender';
import execWorkflow from '../../../../../testUtils/mockApi/execWorkflow';
import { DownloadRecordProps } from '../index.type';
import { fireEvent, act, cleanup, screen } from '@testing-library/react';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';

describe('sqle/ExecWorkflow/Common/DownloadRecord', () => {
  let requestDownloadFile: jest.SpyInstance;
  let requestDownloadReport: jest.SpyInstance;
  let downloadBackupFileSpy: jest.SpyInstance;
  const customRender = (params: DownloadRecordProps) => {
    return sqleSuperRender(<DownloadRecord {...params} />);
  };

  beforeEach(() => {
    jest.useFakeTimers();
    requestDownloadFile = execWorkflow.downloadAuditTaskSQLFile();
    requestDownloadReport = execWorkflow.downloadAuditTaskSQLReport();
    downloadBackupFileSpy = execWorkflow.downloadBackupFile();
    mockUseCurrentProject();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
  });

  it('render snap download btn', () => {
    const { baseElement } = customRender({
      taskId: 'task Id',
      noDuplicate: true
    });
    expect(screen.getByText('下载')).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when click down show dropdown', async () => {
    const { baseElement } = customRender({
      taskId: 'task Id',
      noDuplicate: true
    });

    fireEvent.click(screen.getByText('下载'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(screen.getByText('下载审核报告')).toBeInTheDocument();
    expect(screen.getByText('下载SQL语句')).toBeInTheDocument();
    // expect(screen.getByText('下载回滚语句')).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when click down file', async () => {
    const { baseElement } = customRender({
      taskId: 'task Id',
      noDuplicate: true
    });
    fireEvent.click(screen.getByText('下载'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(screen.getByText('下载SQL语句')).toBeInTheDocument();

    fireEvent.click(screen.getByText('下载SQL语句'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(baseElement).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(2800));
    expect(requestDownloadFile).toHaveBeenCalled();
    expect(requestDownloadFile).toHaveBeenCalledWith(
      { task_id: 'task Id' },
      { responseType: 'blob' }
    );
  });

  it('render snap when click down report', async () => {
    const { baseElement } = customRender({
      taskId: 'task Id',
      noDuplicate: true
    });
    fireEvent.click(screen.getByText('下载'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(screen.getByText('下载审核报告')).toBeInTheDocument();

    fireEvent.click(screen.getByText('下载审核报告'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(baseElement).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(2800));
    expect(requestDownloadReport).toHaveBeenCalled();
    expect(requestDownloadReport).toHaveBeenCalledWith(
      {
        task_id: 'task Id',
        no_duplicate: true
      },
      { responseType: 'blob' }
    );
  });

  it('render down report when noDuplicate is false', async () => {
    customRender({
      taskId: 'task Id',
      noDuplicate: false
    });
    fireEvent.click(screen.getByText('下载'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(screen.getByText('下载审核报告')).toBeInTheDocument();

    fireEvent.click(screen.getByText('下载审核报告'));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestDownloadReport).toHaveBeenCalled();
    expect(requestDownloadReport).toHaveBeenCalledWith(
      {
        task_id: 'task Id',
        no_duplicate: false
      },
      { responseType: 'blob' }
    );
  });

  // it('render snap when click down backup sql', async () => {
  //   const { baseElement } = customRender({
  //     taskId: 'task Id',
  //     noDuplicate: true,
  //     workflowId: 'workflow id'
  //   });
  //   fireEvent.click(screen.getByText('下载'));
  //   await act(async () => jest.advanceTimersByTime(300));
  //   expect(screen.getByText('下载回滚语句')).toBeInTheDocument();

  //   fireEvent.click(screen.getByText('下载回滚语句'));
  //   await act(async () => jest.advanceTimersByTime(300));
  //   expect(baseElement).toMatchSnapshot();
  //   await act(async () => jest.advanceTimersByTime(2800));
  //   expect(downloadBackupFileSpy).toHaveBeenCalled();
  //   expect(downloadBackupFileSpy).toHaveBeenCalledWith(
  //     {
  //       task_id: 'task Id',
  //       project_name: mockProjectInfo.projectName,
  //       workflow_id: 'workflow id'
  //     },
  //     { responseType: 'blob' }
  //   );
  // });
});
