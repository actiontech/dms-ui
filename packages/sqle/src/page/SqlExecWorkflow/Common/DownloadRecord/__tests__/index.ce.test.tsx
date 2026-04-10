/**
 * @test_version ce
 */
import DownloadRecord from '..';
import { sqleSuperRender } from '../../../../../testUtils/superRender';
import execWorkflow from '@actiontech/shared/lib/testUtil/mockApi/sqle/execWorkflow';
import { DownloadRecordProps } from '../index.type';
import { fireEvent, act, cleanup, screen } from '@testing-library/react';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';

describe('sqle/ExecWorkflow/Common/DownloadRecord ce', () => {
  let requestDownloadReport: jest.SpyInstance;
  const customRender = (params: DownloadRecordProps) => {
    return sqleSuperRender(<DownloadRecord {...params} />);
  };

  beforeEach(() => {
    jest.useFakeTimers();
    requestDownloadReport = execWorkflow.downloadAuditTaskSQLReport();
    mockUseCurrentProject();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
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
    // expect(screen.queryByText('下载回滚语句')).not.toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
  });

  it('CE version only shows HTML and CSV format options', async () => {
    customRender({
      taskId: 'task Id',
      noDuplicate: true
    });

    fireEvent.click(screen.getByText('下载'));
    await act(async () => jest.advanceTimersByTime(300));

    // Expand the report submenu
    fireEvent.click(screen.getByText('下载审核报告'));
    await act(async () => jest.advanceTimersByTime(300));

    // CE version should only display HTML and CSV
    expect(screen.getByText('HTML 格式')).toBeInTheDocument();
    expect(screen.getByText('CSV 格式')).toBeInTheDocument();

    // CE version should NOT display PDF and WORD
    expect(screen.queryByText('PDF 格式')).not.toBeInTheDocument();
    expect(screen.queryByText('WORD 格式 (.docx)')).not.toBeInTheDocument();
  });

  it('CE version select HTML format triggers API call with export_format param', async () => {
    customRender({
      taskId: 'task Id',
      noDuplicate: true
    });
    fireEvent.click(screen.getByText('下载'));
    await act(async () => jest.advanceTimersByTime(300));

    fireEvent.click(screen.getByText('下载审核报告'));
    await act(async () => jest.advanceTimersByTime(300));

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

  it('CE version select CSV format triggers API call with export_format param', async () => {
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
});
