import { exportWorkflowV1FilterStatusEnum } from '@actiontech/shared/lib/api/sqle/service/workflow/index.enum';
import { superRender } from '../../../../../testUtils/customRender';
import ExportWorkflowButton from '../ExportWorkflowButton';
import { fireEvent } from '@testing-library/dom';
import execWorkflow from '../../../../../testUtils/mockApi/execWorkflow';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { act } from '@testing-library/react';

describe('test ExportWorkflowButton', () => {
  let RequestExportWorkflowList: jest.SpyInstance;
  beforeEach(() => {
    jest.useFakeTimers();
    RequestExportWorkflowList = execWorkflow.exportWorkflow();
    mockUseCurrentProject();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });
  it('should be called request with params when the button is clicked', async () => {
    const { getByText } = superRender(
      <ExportWorkflowButton
        tableFilterInfo={{
          filter_task_execute_start_time_from: '2024-05-01T17:02:21+08:00',
          filter_task_execute_start_time_to: '2024-05-17T17:02:23+08:00',
          filter_create_time_from: '2024-05-01T17:02:29+08:00',
          filter_create_time_to: '2024-05-10T17:02:30+08:00',
          filter_create_user_id: '700200',
          filter_current_step_assignee_user_id: '700200',
          filter_task_instance_name: 'mysql-2'
        }}
        filterStatus={exportWorkflowV1FilterStatusEnum.exec_failed}
        searchKeyword="filter value"
      />
    );

    fireEvent.click(getByText('导出工单'));
    expect(RequestExportWorkflowList).toHaveBeenCalledTimes(1);
    expect(RequestExportWorkflowList).toHaveBeenCalledWith(
      {
        filter_task_execute_start_time_from: '2024-05-01T17:02:21+08:00',
        filter_task_execute_start_time_to: '2024-05-17T17:02:23+08:00',
        filter_create_time_from: '2024-05-01T17:02:29+08:00',
        filter_create_time_to: '2024-05-10T17:02:30+08:00',
        filter_create_user_id: '700200',
        filter_current_step_assignee_user_id: '700200',
        filter_task_instance_name: 'mysql-2',
        filter_status: exportWorkflowV1FilterStatusEnum.exec_failed,
        fuzzy_keyword: 'filter value',
        project_name: mockProjectInfo.projectName
      },
      { responseType: 'blob' }
    );

    await act(async () => jest.advanceTimersByTime(3000));
    expect(getByText('历史工单导出成功')).toBeInTheDocument();
  });
});
