import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import ExportDetail from '..';
import { superRender } from '../../../../../../testUtils/customRender';
import dataExport from '../../../../../../testUtils/mockApi/dataExport';
import {
  mockDataExportDetailRedux,
  mockUseDataExportDetailReduxManage
} from '../../../testUtils/mockUseDataExportDetailReduxManage';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { getAllBySelector } from '@actiontech/shared/lib/testUtil/customQuery';

describe('test base/DataExport/Detail/ExportDetail', () => {
  let getDataExportTaskSQLs: jest.SpyInstance;
  let downloadSQLsSpy: jest.SpyInstance;
  beforeEach(() => {
    jest.useFakeTimers();
    mockUseCurrentProject();
    getDataExportTaskSQLs = dataExport.ListDataExportTaskSQLs();
    downloadSQLsSpy = dataExport.DownloadDataExportTaskSQLs();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
    jest.clearAllTimers();
  });
  it('should match snapshot', async () => {
    mockUseDataExportDetailReduxManage();

    const { container } = superRender(<ExportDetail />);
    expect(container).toMatchSnapshot();

    expect(getDataExportTaskSQLs).toHaveBeenCalledTimes(1);
    expect(getDataExportTaskSQLs).toHaveBeenCalledWith({
      project_uid: mockProjectInfo.projectID,
      data_export_task_uid: mockDataExportDetailRedux.curTaskID,
      page_size: 20,
      page_index: 1
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(container).toMatchSnapshot();

    fireEvent.click(screen.getByText('概览'));
    expect(mockDataExportDetailRedux.updateCurTaskID).toHaveBeenCalledTimes(1);
    expect(mockDataExportDetailRedux.updateCurTaskID).toHaveBeenCalledWith(
      null
    );
  });

  it('should match snapshot when curTaskID is undefined', async () => {
    mockUseDataExportDetailReduxManage({ curTaskID: undefined });

    const { container } = superRender(<ExportDetail />);
    expect(container).toMatchSnapshot();
    expect(screen.getByText('下载SQL语句').closest('button')).toHaveAttribute(
      'hidden'
    );

    expect(getDataExportTaskSQLs).toHaveBeenCalledTimes(0);
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.click(getAllBySelector('.db-service-segmented-label-text')[1]);

    expect(mockDataExportDetailRedux.updateCurTaskID).toHaveBeenCalledTimes(1);
    expect(mockDataExportDetailRedux.updateCurTaskID).toHaveBeenCalledWith(
      mockDataExportDetailRedux.taskInfos[1].task_uid
    );
  });

  it('should render download sql button when  curTaskID is not undefined', async () => {
    mockUseDataExportDetailReduxManage();
    superRender(<ExportDetail />);

    expect(
      screen.getByText('下载SQL语句').closest('button')
    ).not.toHaveAttribute('hidden');

    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.click(screen.getByText('下载SQL语句'));
    expect(downloadSQLsSpy).toHaveBeenCalledTimes(1);
    expect(downloadSQLsSpy).toHaveBeenCalledWith({
      project_uid: mockProjectInfo.projectID,
      data_export_task_uid: mockDataExportDetailRedux.curTaskID
    });

    expect(screen.getByText('下载SQL语句').closest('button')).toHaveClass(
      'ant-btn-loading'
    );
    await act(async () => jest.advanceTimersByTime(3000));

    expect(screen.getByText('下载SQL语句').closest('button')).not.toHaveClass(
      'ant-btn-loading'
    );
  });
});
