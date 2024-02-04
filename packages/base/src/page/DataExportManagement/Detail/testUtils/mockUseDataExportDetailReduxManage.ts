import { GetDataExportTaskStatusEnum } from '@actiontech/shared/lib/api/base/service/common.enum';
import * as useDataExportDetailReduxManage from '../hooks/index.redux';
import { GetDataExportWorkflowResponseData } from '../../../../testUtils/mockApi/dataExport/data';

export const mockDataExportDetailRedux = {
  workflowStepOpen: false,
  workflowRejectOpen: false,
  workflowInfo: GetDataExportWorkflowResponseData,
  taskInfos: [
    {
      task_uid: '1752172791873933312',
      db_info: {
        uid: '1752170583749038080',
        name: 'mysql-1',
        db_type: '',
        database_name: 'test'
      },
      status: GetDataExportTaskStatusEnum.finish,
      export_start_time: '2024-01-30T11:32:15.085+08:00',
      export_end_time: '2024-01-30T11:32:15.085+08:00',
      file_name: 'mysql-1_20240130113114-1752172791873933312.zip',
      audit_result: {
        audit_level: '',
        score: 100,
        pass_rate: 1
      },
      export_type: 'SQL',
      export_file_type: 'CSV'
    },
    {
      task_uid: '1752172791873933313',
      db_info: {
        uid: '1752170583749038080',
        name: 'mysql-1',
        db_type: '',
        database_name: 'test'
      },
      status: GetDataExportTaskStatusEnum.exporting,
      export_start_time: '2024-01-30T11:32:15.085+08:00',
      export_end_time: '2024-01-30T11:32:15.085+08:00',
      file_name: 'mysql-1_20240130113114-1752172791873933313.zip',
      audit_result: {
        audit_level: '',
        score: 100,
        pass_rate: 1
      },
      export_type: 'SQL',
      export_file_type: 'CSV'
    },
    {
      task_uid: '1752172791873933314',
      db_info: {
        uid: '1752170583749038080',
        name: 'mysql-1',
        db_type: '',
        database_name: 'test'
      },
      status: GetDataExportTaskStatusEnum.failed,
      export_start_time: '2024-01-30T11:32:15.085+08:00',
      export_end_time: '2024-01-30T11:32:15.085+08:00',
      file_name: 'mysql-1_20240130113114-1752172791873933314.zip',
      audit_result: {
        audit_level: '',
        score: 100,
        pass_rate: 1
      },
      export_type: 'SQL',
      export_file_type: 'CSV'
    }
  ],
  curTaskID: '1752172791873933312',
  taskStatusNumber: {
    success: 1,
    failed: 0,
    exporting: 0
  },
  canRejectWorkflow: false,
  updateWorkflowStepOpen: jest.fn(),
  updateWorkflowRejectOpen: jest.fn(),
  updateWorkflowInfo: jest.fn(),
  updateTaskInfos: jest.fn(),
  updateCurTaskID: jest.fn(),
  updateTaskStatusNumber: jest.fn(),
  updateCanRejectWorkflow: jest.fn(),
  clearAllDetailState: jest.fn()
};

export const mockUseDataExportDetailReduxManage = (
  data?: Partial<typeof mockDataExportDetailRedux>
) => {
  const spy = jest.spyOn(useDataExportDetailReduxManage, 'default');
  spy.mockImplementation(() => ({ ...mockDataExportDetailRedux, ...data }));
  return spy;
};
