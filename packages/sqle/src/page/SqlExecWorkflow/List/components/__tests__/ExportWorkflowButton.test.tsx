import {
  exportWorkflowV1FilterStatusEnum,
  exportWorkflowV1ExportFormatEnum
} from '@actiontech/shared/lib/api/sqle/service/workflow/index.enum';
import { sqleSuperRender } from '../../../../../testUtils/superRender';
import ExportWorkflowButton from '../ExportWorkflowButton';
import { fireEvent, screen } from '@testing-library/dom';
import execWorkflow from '@actiontech/shared/lib/testUtil/mockApi/sqle/execWorkflow';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { act } from '@testing-library/react';
import { mockUsePermission } from '@actiontech/shared/lib/testUtil/mockHook/mockUsePermission';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn()
  };
});

describe('test ExportWorkflowButton', () => {
  let RequestExportWorkflowList: jest.SpyInstance;
  beforeEach(() => {
    jest.useFakeTimers();
    RequestExportWorkflowList = execWorkflow.exportWorkflow();
    mockUseCurrentProject();
    mockUsePermission(undefined, {
      mockCurrentUser: true,
      mockSelector: true
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });
  it('should export with CSV format by default when clicking OK', async () => {
    const { getByText, baseElement } = sqleSuperRender(
      <ExportWorkflowButton
        tableFilterInfo={{
          filter_task_execute_start_time_from: '2024-05-01T17:02:21+08:00',
          filter_task_execute_start_time_to: '2024-05-17T17:02:23+08:00',
          filter_create_time_from: '2024-05-01T17:02:29+08:00',
          filter_create_time_to: '2024-05-10T17:02:30+08:00',
          filter_create_user_id: '700200',
          filter_current_step_assignee_user_id: '700200',
          filter_task_instance_id: '1739531942258282496'
        }}
        filterStatus={exportWorkflowV1FilterStatusEnum.exec_failed}
        searchKeyword="filter value"
      />
    );

    fireEvent.click(getByText('导出工单'));

    await act(async () => jest.advanceTimersByTime(0));
    expect(screen.getByText('选择导出文件格式')).toBeInTheDocument();

    expect(baseElement).toMatchSnapshot();

    fireEvent.click(screen.getByText('确 认'));

    await act(async () => jest.advanceTimersByTime(0));
    expect(RequestExportWorkflowList).toHaveBeenCalledTimes(1);
    expect(RequestExportWorkflowList).toHaveBeenCalledWith(
      {
        filter_task_execute_start_time_from: '2024-05-01T17:02:21+08:00',
        filter_task_execute_start_time_to: '2024-05-17T17:02:23+08:00',
        filter_create_time_from: '2024-05-01T17:02:29+08:00',
        filter_create_time_to: '2024-05-10T17:02:30+08:00',
        filter_create_user_id: '700200',
        filter_current_step_assignee_user_id: '700200',
        filter_task_instance_id: '1739531942258282496',
        filter_status: exportWorkflowV1FilterStatusEnum.exec_failed,
        fuzzy_keyword: 'filter value',
        project_name: mockProjectInfo.projectName,
        export_format: exportWorkflowV1ExportFormatEnum.csv
      },
      { responseType: 'blob' }
    );

    await act(async () => jest.advanceTimersByTime(3000));
    expect(getByText('历史工单导出成功')).toBeInTheDocument();
  });
});
