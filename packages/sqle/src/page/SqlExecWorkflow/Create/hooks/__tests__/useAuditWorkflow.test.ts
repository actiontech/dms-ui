import { act, renderHook } from '@testing-library/react';
import useAuditWorkflow from '../useAuditWorkflow';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { SAME_SQL_MODE_DEFAULT_FIELD_KEY } from '../../../Common/SqlStatementFormController/SqlStatementFormItem/index.data';
import execWorkflow from '../../../../../testUtils/mockApi/execWorkflow';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { SqlAuditInfoFormFields, SqlStatementFields } from '../../index.type';
import { AuditTaskResData } from '../../../../../testUtils/mockApi/execWorkflow/data';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';

describe('test useAuditWorkflow', () => {
  let mockCreateAuditTasksV1: jest.SpyInstance;
  let mockAuditTaskGroupId: jest.SpyInstance;
  let mockCreateAndAuditTaskV1: jest.SpyInstance;
  beforeEach(() => {
    jest.useFakeTimers();
    mockUseCurrentProject();
    mockCreateAuditTasksV1 = execWorkflow.createAuditTasks();
    mockAuditTaskGroupId = execWorkflow.auditTaskGroupId();
    mockCreateAndAuditTaskV1 = execWorkflow.createAndAuditTask();
    execWorkflow.getWorkflowTemplate();
  });
  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  it('should initialize with correct states', () => {
    const { result } = renderHook(() => useAuditWorkflow());
    expect(result.current.taskInfos).toEqual([]);
    expect(result.current.isDisableFinallySubmitButton).toBeFalsy();
  });

  it('should handle same sql workflow audit correctly', async () => {
    const onSuccessSpy = jest.fn();

    const { result } = renderHook(() => useAuditWorkflow());
    const values: SqlAuditInfoFormFields = {
      isSameSqlForAll: true,
      [SAME_SQL_MODE_DEFAULT_FIELD_KEY]: {
        form_data: 'SELECT * FROM table',
        exec_mode: 'sqls',
        sql_file: undefined,
        mybatis_xml_file: undefined,
        audit_plan: undefined,
        zip_file: undefined,
        git_repository: undefined
      } as SqlStatementFields,
      databaseInfo: [{ instanceName: 'instance1', instanceSchema: 'schema1' }]
    };

    await act(async () => {
      result.current.auditWorkflowWithSameSql(values, onSuccessSpy);
    });

    expect(mockCreateAuditTasksV1).toHaveBeenCalledWith({
      exec_mode: 'sqls',
      project_name: mockProjectInfo.projectName,
      instances: [{ instance_name: 'instance1', instance_schema: 'schema1' }]
    });
    await act(() => jest.advanceTimersByTime(3000));

    expect(mockAuditTaskGroupId).toHaveBeenCalledTimes(1);
    expect(mockAuditTaskGroupId).toHaveBeenCalledWith({
      task_group_id: 99,
      sql: 'SELECT * FROM table'
    });
    await act(async () => jest.advanceTimersByTime(3000));

    expect(onSuccessSpy).toHaveBeenCalledTimes(1);
    expect(result.current.taskInfos).toEqual(AuditTaskResData);

    await act(() => {
      result.current.clearTaskInfos();
    });

    expect(result.current.taskInfos).toEqual([]);
  });

  it('should handle different sql workflow audit correctly', async () => {
    const onSuccessSpy = jest.fn();
    mockCreateAndAuditTaskV1
      .mockImplementationOnce(() =>
        createSpySuccessResponse({
          data: AuditTaskResData[0]
        })
      )
      .mockImplementationOnce(() =>
        createSpySuccessResponse({
          data: AuditTaskResData[1]
        })
      );
    const { result } = renderHook(() => useAuditWorkflow());
    const values: SqlAuditInfoFormFields = {
      isSameSqlForAll: true,
      0: {
        form_data: 'SELECT * FROM table',
        exec_mode: 'sqls',
        sql_file: undefined,
        mybatis_xml_file: undefined,
        audit_plan: undefined,
        zip_file: undefined,
        git_repository: undefined
      } as SqlStatementFields,
      1: {
        form_data: 'SELECT * FROM table WHERE ID = 1',
        exec_mode: 'sql_file',
        sql_file: undefined,
        mybatis_xml_file: undefined,
        audit_plan: undefined,
        zip_file: undefined,
        git_repository: undefined
      } as SqlStatementFields,
      databaseInfo: [
        { instanceName: 'instance1', instanceSchema: 'schema1' },
        { instanceName: 'instance2', instanceSchema: 'schema2' }
      ]
    };

    await act(async () => {
      result.current.auditWorkflowWthDifferenceSql(
        values,
        [
          { key: '0', instanceName: 'instance1', schemaName: 'schema1' },
          { key: '1', instanceName: 'instance2', schemaName: 'schema2' }
        ],
        onSuccessSpy
      );
    });

    expect(mockCreateAndAuditTaskV1).toHaveBeenCalledTimes(
      values.databaseInfo.length
    );
    expect(mockCreateAndAuditTaskV1).toHaveBeenCalledWith({
      project_name: mockProjectInfo.projectName,
      instance_name: 'instance1',
      instance_schema: 'schema1',
      sql: 'SELECT * FROM table',
      exec_mode: 'sqls'
    });
    expect(mockCreateAndAuditTaskV1).toHaveBeenCalledWith({
      project_name: mockProjectInfo.projectName,
      instance_name: 'instance2',
      instance_schema: 'schema2',
      sql: 'SELECT * FROM table WHERE ID = 1',
      exec_mode: 'sql_file'
    });
    await act(async () => jest.advanceTimersByTime(3000));

    expect(onSuccessSpy).toHaveBeenCalledTimes(1);
    expect(result.current.taskInfos).toEqual([
      AuditTaskResData[0],
      AuditTaskResData[1]
    ]);
  });
});
