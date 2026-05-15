import reducers, {
  updateClonedExecWorkflowSqlAuditInfo,
  updateClonedExecWorkflowBaseInfo,
  updateVersionFirstStageInstances,
  updateWorkflowRollbackSqlIds,
  updateRetryExecuteData
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
        versionFirstStageInstances: null,
        workflowRollbackSqlIds: null,
        retryExecuteData: null,
        modalStatus: {}
      },
      updateClonedExecWorkflowSqlAuditInfo(mockWorkflowSqlAuditInfo)
    );
    expect(state).toEqual({
      clonedExecWorkflowSqlAuditInfo: mockWorkflowSqlAuditInfo,
      clonedExecWorkflowBaseInfo: null,
      versionFirstStageInstances: null,
      workflowRollbackSqlIds: null,
      retryExecuteData: null,
      modalStatus: {}
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
        versionFirstStageInstances: null,
        workflowRollbackSqlIds: null,
        retryExecuteData: null,
        modalStatus: {}
      },
      updateClonedExecWorkflowBaseInfo(mockWorkflowBaseInfo)
    );
    expect(state).toEqual({
      clonedExecWorkflowSqlAuditInfo: null,
      clonedExecWorkflowBaseInfo: mockWorkflowBaseInfo,
      versionFirstStageInstances: null,
      workflowRollbackSqlIds: null,
      retryExecuteData: null,
      modalStatus: {}
    });
  });

  test('should create action when call updateVersionFirstStageInstances', () => {
    const versionFirstStageInstances = [
      {
        instances_name: 'test',
        instance_id: '1'
      }
    ];
    expect(
      updateVersionFirstStageInstances({ versionFirstStageInstances })
    ).toEqual({
      payload: { versionFirstStageInstances },
      type: 'sqlExecWorkflow/updateVersionFirstStageInstances'
    });

    const state = reducers(
      {
        clonedExecWorkflowSqlAuditInfo: null,
        clonedExecWorkflowBaseInfo: null,
        versionFirstStageInstances: null,
        workflowRollbackSqlIds: null,
        retryExecuteData: null,
        modalStatus: {}
      },
      updateVersionFirstStageInstances({ versionFirstStageInstances })
    );
    expect(state).toEqual({
      clonedExecWorkflowSqlAuditInfo: null,
      clonedExecWorkflowBaseInfo: null,
      versionFirstStageInstances: versionFirstStageInstances,
      workflowRollbackSqlIds: null,
      retryExecuteData: null,
      modalStatus: {}
    });
  });

  test('should create action when call updateWorkflowRollbackSqlIds', () => {
    const workflowRollbackSqlIds = [1];
    expect(updateWorkflowRollbackSqlIds({ workflowRollbackSqlIds })).toEqual({
      payload: { workflowRollbackSqlIds },
      type: 'sqlExecWorkflow/updateWorkflowRollbackSqlIds'
    });

    const state = reducers(
      {
        clonedExecWorkflowSqlAuditInfo: null,
        clonedExecWorkflowBaseInfo: null,
        versionFirstStageInstances: null,
        workflowRollbackSqlIds: null,
        retryExecuteData: null,
        modalStatus: {}
      },
      updateWorkflowRollbackSqlIds({ workflowRollbackSqlIds })
    );
    expect(state).toEqual({
      clonedExecWorkflowSqlAuditInfo: null,
      clonedExecWorkflowBaseInfo: null,
      versionFirstStageInstances: null,
      workflowRollbackSqlIds: workflowRollbackSqlIds,
      retryExecuteData: null,
      modalStatus: {}
    });
  });

  test('should create action when call updateRetryExecuteData', () => {
    const retryExecuteData = {
      taskId: '1',
      execSqlId: 1,
      pageIndex: 1,
      pageSize: 10
    };
    expect(updateRetryExecuteData({ ...retryExecuteData })).toEqual({
      payload: { ...retryExecuteData },
      type: 'sqlExecWorkflow/updateRetryExecuteData'
    });

    const state = reducers(
      {
        clonedExecWorkflowSqlAuditInfo: null,
        clonedExecWorkflowBaseInfo: null,
        versionFirstStageInstances: null,
        workflowRollbackSqlIds: null,
        retryExecuteData: null,
        modalStatus: {}
      },
      updateRetryExecuteData({ ...retryExecuteData })
    );
    expect(state).toEqual({
      clonedExecWorkflowSqlAuditInfo: null,
      clonedExecWorkflowBaseInfo: null,
      versionFirstStageInstances: null,
      workflowRollbackSqlIds: null,
      retryExecuteData: retryExecuteData,
      modalStatus: {}
    });
  });
});
