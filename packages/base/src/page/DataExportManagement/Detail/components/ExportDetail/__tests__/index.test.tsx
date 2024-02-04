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
  beforeEach(() => {
    jest.useFakeTimers();
    mockUseCurrentProject();
    getDataExportTaskSQLs = dataExport.ListDataExportTaskSQLs();
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

    expect(getDataExportTaskSQLs).toBeCalledTimes(1);
    expect(getDataExportTaskSQLs).toBeCalledWith({
      project_uid: mockProjectInfo.projectID,
      data_export_task_uid: mockDataExportDetailRedux.curTaskID,
      page_size: 20,
      page_index: 1
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(container).toMatchSnapshot();

    fireEvent.click(screen.getByText('概览'));
    expect(mockDataExportDetailRedux.updateCurTaskID).toBeCalledTimes(1);
    expect(mockDataExportDetailRedux.updateCurTaskID).toBeCalledWith(null);
  });

  it('should match snapshot when curTaskID is undefined', async () => {
    mockUseDataExportDetailReduxManage({ curTaskID: undefined });

    const { container } = superRender(<ExportDetail />);
    expect(container).toMatchSnapshot();
    expect(getDataExportTaskSQLs).toBeCalledTimes(0);
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.click(getAllBySelector('.db-service-segmented-label-text')[1]);

    expect(mockDataExportDetailRedux.updateCurTaskID).toBeCalledTimes(1);
    expect(mockDataExportDetailRedux.updateCurTaskID).toBeCalledWith(
      mockDataExportDetailRedux.taskInfos[1].task_uid
    );
  });
});
