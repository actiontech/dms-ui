import reducers, {
  updateClonedExecWorkflowSqlAuditInfo,
  updateClonedExecWorkflowBaseInfo,
  updateVersionFirstStageInstances,
  updateWorkflowRollbackSqlIds
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
        sql_file: [testSqlFile]
      } as SqlStatementFields,
      '1': {
        currentUploadType: AuditTaskResV1SqlSourceEnum.zip_file,
        zip_file: [testZipFile]
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
        workflowRollbackSqlIds: null
      },
      updateClonedExecWorkflowSqlAuditInfo(mockWorkflowSqlAuditInfo)
    );
    expect(state).toEqual({
      clonedExecWorkflowSqlAuditInfo: mockWorkflowSqlAuditInfo,
      clonedExecWorkflowBaseInfo: null,
      versionFirstStageInstances: null,
      workflowRollbackSqlIds: null
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
        workflowRollbackSqlIds: null
      },
      updateClonedExecWorkflowBaseInfo(mockWorkflowBaseInfo)
    );
    expect(state).toEqual({
      clonedExecWorkflowSqlAuditInfo: null,
      clonedExecWorkflowBaseInfo: mockWorkflowBaseInfo,
      versionFirstStageInstances: null,
      workflowRollbackSqlIds: null
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
        workflowRollbackSqlIds: null
      },
      updateVersionFirstStageInstances({ versionFirstStageInstances })
    );
    expect(state).toEqual({
      clonedExecWorkflowSqlAuditInfo: null,
      clonedExecWorkflowBaseInfo: null,
      versionFirstStageInstances: versionFirstStageInstances,
      workflowRollbackSqlIds: null
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
        workflowRollbackSqlIds: null
      },
      updateWorkflowRollbackSqlIds({ workflowRollbackSqlIds })
    );
    expect(state).toEqual({
      clonedExecWorkflowSqlAuditInfo: null,
      clonedExecWorkflowBaseInfo: null,
      versionFirstStageInstances: null,
      workflowRollbackSqlIds: workflowRollbackSqlIds
    });
  });
});
