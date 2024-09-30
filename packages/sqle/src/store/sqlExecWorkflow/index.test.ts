import reducers, {
  updateClonedExecWorkflowSqlAuditInfo,
  updateClonedExecWorkflowBaseInfo
} from '.';
import {
  AuditTaskResV1SqlSourceEnum,
  CreateAuditTasksGroupReqV1ExecModeEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { SqlStatementFields } from '../../page/SqlExecWorkflow/Create/index.type';

describe('store/sqlExecWorkflow', () => {
  test('should create action when call updateClonedExecWorkflowSqlAuditInfo', () => {
    const testSqlFile = new File([''], 'test.sql');
    const testZipFile = new File([''], 'test.zip');
    const mockWorkflowSqlAuditInfo = {
      databaseInfo: [
        {
          instanceName: 'test1',
          instanceSchema: 'test_schema_1'
        },
        {
          instanceName: 'test2',
          instanceSchema: 'test_schema_2'
        }
      ],
      isSameSqlForAll: false,
      '0': {
        currentUploadType: AuditTaskResV1SqlSourceEnum.sql_file,
        exec_mode: CreateAuditTasksGroupReqV1ExecModeEnum.sqls,
        sql_file: [testSqlFile]
      } as SqlStatementFields,
      '1': {
        currentUploadType: AuditTaskResV1SqlSourceEnum.zip_file,
        exec_mode: CreateAuditTasksGroupReqV1ExecModeEnum.sql_file,
        zip_file: [testZipFile],
        file_sort_method: 'file_order_method_suffix_num_asc'
      } as SqlStatementFields
    };
    expect(
      updateClonedExecWorkflowSqlAuditInfo(mockWorkflowSqlAuditInfo)
    ).toEqual({
      payload: mockWorkflowSqlAuditInfo,
      type: 'sqlExecWorkflow/updateClonedExecWorkflowSqlAuditInfo'
    });

    const state = reducers(
      {
        clonedExecWorkflowSqlAuditInfo: null,
        clonedExecWorkflowBaseInfo: null,
        versionFirstStageInstances: null
      },
      updateClonedExecWorkflowSqlAuditInfo(mockWorkflowSqlAuditInfo)
    );
    expect(state).toEqual({
      clonedExecWorkflowSqlAuditInfo: mockWorkflowSqlAuditInfo,
      clonedExecWorkflowBaseInfo: null,
      versionFirstStageInstances: null
    });
  });

  test('should create action when call updateClonedExecWorkflowBaseInfo', () => {
    const mockWorkflowBaseInfo = {
      workflow_subject: 'test_workflow_name',
      desc: 'test desc'
    };
    expect(updateClonedExecWorkflowBaseInfo(mockWorkflowBaseInfo)).toEqual({
      payload: mockWorkflowBaseInfo,
      type: 'sqlExecWorkflow/updateClonedExecWorkflowBaseInfo'
    });

    const state = reducers(
      {
        clonedExecWorkflowSqlAuditInfo: null,
        clonedExecWorkflowBaseInfo: null,
        versionFirstStageInstances: null
      },
      updateClonedExecWorkflowBaseInfo(mockWorkflowBaseInfo)
    );
    expect(state).toEqual({
      clonedExecWorkflowSqlAuditInfo: null,
      clonedExecWorkflowBaseInfo: mockWorkflowBaseInfo,
      versionFirstStageInstances: null
    });
  });
});
