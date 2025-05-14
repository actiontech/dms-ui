import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import {
  mockDataExportDetailRedux,
  mockUseDataExportDetailReduxManage
} from '../../../testUtils/mockUseDataExportDetailReduxManage';
import dataExport from '../../../../../../testUtils/mockApi/dataExport';
import { baseSuperRender } from '../../../../../../testUtils/superRender';
import ExportTaskList from '.';
import { act } from '@testing-library/react';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';

describe('test ExportTaskList', () => {
  let getDataExportTaskSQLsSpy: jest.SpyInstance;
  beforeEach(() => {
    jest.useFakeTimers();
    getDataExportTaskSQLsSpy = dataExport.ListDataExportTaskSQLs();
    mockUseCurrentProject();
    mockUseDataExportDetailReduxManage();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  it('should match snapshot', async () => {
    const { container } = baseSuperRender(<ExportTaskList />);

    expect(container).toMatchSnapshot();

    await act(async () => jest.advanceTimersByTime(3000));
    expect(getDataExportTaskSQLsSpy).toHaveBeenCalledTimes(1);

    expect(getDataExportTaskSQLsSpy).toHaveBeenCalledWith({
      project_uid: mockProjectInfo.projectID,
      data_export_task_uid: mockDataExportDetailRedux.curTaskID,
      page_index: 1,
      page_size: 20
    });

    expect(container).toMatchSnapshot();
  });
});
