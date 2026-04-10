import DownloadRecord from '..';
import { sqleSuperRender } from '../../../../../testUtils/superRender';
import execWorkflow from '@actiontech/shared/lib/testUtil/mockApi/sqle/execWorkflow';
import { DownloadRecordProps } from '../index.type';
import { fireEvent, act, cleanup, screen } from '@testing-library/react';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';

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

  it('expand report submenu and show all 4 format options (EE)', async () => {
    customRender({
      taskId: 'task Id',
      noDuplicate: true
    });
    fireEvent.click(screen.getByText('下载'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(screen.getByText('下载审核报告')).toBeInTheDocument();

    // Click "下载审核报告" to expand the submenu
    fireEvent.click(screen.getByText('下载审核报告'));
    await act(async () => jest.advanceTimersByTime(300));

    // EE version should display all 4 format options
    expect(screen.getByText('HTML 格式')).toBeInTheDocument();
    expect(screen.getByText('PDF 格式')).toBeInTheDocument();
    expect(screen.getByText('CSV 格式')).toBeInTheDocument();
    expect(screen.getByText('WORD 格式 (.docx)')).toBeInTheDocument();
  });

  it('select HTML format triggers API call with export_format param', async () => {
    customRender({
      taskId: 'task Id',
      noDuplicate: true
    });
    fireEvent.click(screen.getByText('下载'));
    await act(async () => jest.advanceTimersByTime(300));

    // Expand the report submenu
    fireEvent.click(screen.getByText('下载审核报告'));
    await act(async () => jest.advanceTimersByTime(300));

    // Click HTML format option
    fireEvent.click(screen.getByText('HTML 格式'));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestDownloadReport).toHaveBeenCalled();
    expect(requestDownloadReport).toHaveBeenCalledWith(
      {
        task_id: 'task Id',
        no_duplicate: true,
        export_format: 'html'
      },
      { responseType: 'blob' }
    );
  });

  it('select PDF format triggers API call with export_format param', async () => {
    customRender({
      taskId: 'task Id',
      noDuplicate: true
    });
    fireEvent.click(screen.getByText('下载'));
    await act(async () => jest.advanceTimersByTime(300));

    fireEvent.click(screen.getByText('下载审核报告'));
    await act(async () => jest.advanceTimersByTime(300));

    fireEvent.click(screen.getByText('PDF 格式'));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestDownloadReport).toHaveBeenCalled();
    expect(requestDownloadReport).toHaveBeenCalledWith(
      {
        task_id: 'task Id',
        no_duplicate: true,
        export_format: 'pdf'
      },
      { responseType: 'blob' }
    );
  });

  it('select CSV format triggers API call with export_format param', async () => {
    customRender({
      taskId: 'task Id',
      noDuplicate: true
    });
    fireEvent.click(screen.getByText('下载'));
    await act(async () => jest.advanceTimersByTime(300));

    fireEvent.click(screen.getByText('下载审核报告'));
    await act(async () => jest.advanceTimersByTime(300));

    fireEvent.click(screen.getByText('CSV 格式'));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestDownloadReport).toHaveBeenCalled();
    expect(requestDownloadReport).toHaveBeenCalledWith(
      {
        task_id: 'task Id',
        no_duplicate: true,
        export_format: 'csv'
      },
      { responseType: 'blob' }
    );
  });

  it('select WORD format triggers API call with export_format param', async () => {
    customRender({
      taskId: 'task Id',
      noDuplicate: true
    });
    fireEvent.click(screen.getByText('下载'));
    await act(async () => jest.advanceTimersByTime(300));

    fireEvent.click(screen.getByText('下载审核报告'));
    await act(async () => jest.advanceTimersByTime(300));

    fireEvent.click(screen.getByText('WORD 格式 (.docx)'));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestDownloadReport).toHaveBeenCalled();
    expect(requestDownloadReport).toHaveBeenCalledWith(
      {
        task_id: 'task Id',
        no_duplicate: true,
        export_format: 'word'
      },
      { responseType: 'blob' }
    );
  });

  it('noDuplicate false is passed correctly in format download', async () => {
    customRender({
      taskId: 'task Id',
      noDuplicate: false
    });
    fireEvent.click(screen.getByText('下载'));
    await act(async () => jest.advanceTimersByTime(300));

    fireEvent.click(screen.getByText('下载审核报告'));
    await act(async () => jest.advanceTimersByTime(300));

    fireEvent.click(screen.getByText('CSV 格式'));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestDownloadReport).toHaveBeenCalled();
    expect(requestDownloadReport).toHaveBeenCalledWith(
      {
        task_id: 'task Id',
        no_duplicate: false,
        export_format: 'csv'
      },
      { responseType: 'blob' }
    );
  });

  it('selecting a format closes the popover and submenu', async () => {
    const { baseElement } = customRender({
      taskId: 'task Id',
      noDuplicate: true
    });
    fireEvent.click(screen.getByText('下载'));
    await act(async () => jest.advanceTimersByTime(300));

    // Expand submenu
    fireEvent.click(screen.getByText('下载审核报告'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(screen.getByText('HTML 格式')).toBeInTheDocument();

    // Select a format
    fireEvent.click(screen.getByText('HTML 格式'));
    await act(async () => jest.advanceTimersByTime(3000));

    // After selecting, the popover should close (format options should no longer be visible)
    expect(screen.queryByText('HTML 格式')).not.toBeInTheDocument();
  });

  it('download SQL file is not affected by report submenu changes', async () => {
    customRender({
      taskId: 'task Id',
      noDuplicate: true
    });
    fireEvent.click(screen.getByText('下载'));
    await act(async () => jest.advanceTimersByTime(300));

    // Download SQL file directly without expanding the report submenu
    fireEvent.click(screen.getByText('下载SQL语句'));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestDownloadFile).toHaveBeenCalled();
    expect(requestDownloadFile).toHaveBeenCalledWith(
      { task_id: 'task Id' },
      { responseType: 'blob' }
    );
    // Report API should NOT be called
    expect(requestDownloadReport).not.toHaveBeenCalled();
  });

  it('expand and collapse the report submenu', async () => {
    customRender({
      taskId: 'task Id',
      noDuplicate: true
    });
    fireEvent.click(screen.getByText('下载'));
    await act(async () => jest.advanceTimersByTime(300));

    // Expand submenu
    fireEvent.click(screen.getByText('下载审核报告'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(screen.getByText('HTML 格式')).toBeInTheDocument();

    // Click again to collapse submenu
    fireEvent.click(screen.getByText('下载审核报告'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(screen.queryByText('HTML 格式')).not.toBeInTheDocument();
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
