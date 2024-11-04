import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import {
  mockDataExportDetailRedux,
  mockUseDataExportDetailReduxManage
} from '../../../testUtils/mockUseDataExportDetailReduxManage';
import { superRender } from '../../../../../../testUtils/customRender';
import OverviewList from '.';
import { act, fireEvent, screen } from '@testing-library/react';
import { getAllBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import dataExport from '../../../../../../testUtils/mockApi/dataExport';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import MockDate from 'mockdate';

describe('test base/DataExport/Detail/OverviewList', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    MockDate.set('2024-01-30 10:00:00');
    mockUseCurrentProject();
    mockUseCurrentUser({
      userId: mockDataExportDetailRedux.workflowInfo.create_user?.uid
    });

    mockUseDataExportDetailReduxManage();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
    MockDate.reset();
  });

  it('should match snapshot', () => {
    const { container } = superRender(<OverviewList />);

    expect(container).toMatchSnapshot();

    fireEvent.click(getAllBySelector('.ant-table-row')[0]);
    expect(mockDataExportDetailRedux.updateCurTaskID).toHaveBeenCalledTimes(1);
    expect(mockDataExportDetailRedux.updateCurTaskID).toHaveBeenCalledWith(
      mockDataExportDetailRedux.taskInfos[0].task_uid
    );
  });

  it('should not render download button when current user is not workflow creator', () => {
    mockUseCurrentUser({
      userId: mockDataExportDetailRedux.workflowInfo.create_user?.uid + '1'
    });

    superRender(<OverviewList />);
    expect(screen.queryByText('操作')).not.toBeInTheDocument();
    expect(screen.queryByText('下载数据')).not.toBeInTheDocument();
  });

  it('should send download request when click download button', async () => {
    const downloadSpy = dataExport.DownloadDataExportTask();
    superRender(<OverviewList />);
    expect(screen.queryByText('操作')).toBeInTheDocument();

    fireEvent.click(screen.getAllByText('下载数据')[0]);
    expect(mockDataExportDetailRedux.updateCurTaskID).not.toHaveBeenCalled();

    expect(screen.getAllByText('下载数据')[1].closest('button')).toHaveClass(
      'ant-btn-loading'
    );

    expect(downloadSpy).toHaveBeenCalledTimes(1);
    expect(downloadSpy).toHaveBeenCalledWith(
      {
        project_uid: mockProjectInfo.projectID,
        data_export_task_uid: mockDataExportDetailRedux.taskInfos[0].task_uid
      },
      { responseType: 'blob' }
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(
      screen.getAllByText('下载数据')[1].closest('button')
    ).not.toHaveClass('ant-btn-loading');
  });

  it('should disabled when workflow status is not finish or export time has expired', () => {
    const downloadSpy = dataExport.DownloadDataExportTask();
    MockDate.set('2024-01-31 15:00:00');
    superRender(<OverviewList />);

    expect(screen.getAllByText('下载数据')[0].closest('button')).toBeDisabled();

    expect(screen.getAllByText('下载数据')[1].closest('button')).toBeDisabled();

    expect(downloadSpy).toHaveBeenCalledTimes(0);

    MockDate.reset();
  });
});
