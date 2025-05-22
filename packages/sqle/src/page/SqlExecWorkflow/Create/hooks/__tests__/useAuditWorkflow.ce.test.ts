/**
 * @test_version ce
 */

import {
  AuditTaskResV1SqlSourceEnum,
  CreateAuditTasksGroupReqV1ExecModeEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { act, renderHook } from '@testing-library/react';
import { AuditTaskResData } from '@actiontech/shared/lib/testUtil/mockApi/sqle/execWorkflow/data';
import { SAME_SQL_MODE_DEFAULT_FIELD_KEY } from '../../../Common/SqlStatementFormController/SqlStatementFormItem/index.data';
import { SqlAuditInfoFormFields, SqlStatementFields } from '../../index.type';
import useAuditWorkflow from '../useAuditWorkflow';
import execWorkflow from '@actiontech/shared/lib/testUtil/mockApi/sqle/execWorkflow';

describe('test useAuditWorkflow ce', () => {
  const sqlFile = new File(
    [new Blob(['this is sql info'], { type: 'file/sql' })],
    'test.sql'
  );
  const zipFile = new File(
    [new Blob(['this is sql info'], { type: 'file/zip' })],
    'test.zip'
  );
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

  it('should handle same sql workflow audit correctly', async () => {
    const onSuccessSpy = jest.fn();

    const { result } = renderHook(() => useAuditWorkflow());
    const values: SqlAuditInfoFormFields = {
      isSameSqlForAll: true,
      [SAME_SQL_MODE_DEFAULT_FIELD_KEY]: {
        currentUploadType: AuditTaskResV1SqlSourceEnum.form_data,
        form_data: 'SELECT * FROM table',
        exec_mode: CreateAuditTasksGroupReqV1ExecModeEnum.sqls,
        sql_file: [sqlFile],
        zip_file: [zipFile],
        file_sort_method: 'desc'
      } as SqlStatementFields,
      databaseInfo: [{ instanceName: 'instance1', instanceSchema: 'schema1' }]
    };

    await act(async () => {
      result.current.auditWorkflowWithSameSql(values, onSuccessSpy);
    });

    expect(mockCreateAuditTasksV1).toHaveBeenCalledTimes(1);
    expect(mockCreateAuditTasksV1).toHaveBeenNthCalledWith(1, {
      project_name: mockProjectInfo.projectName,
      exec_mode: CreateAuditTasksGroupReqV1ExecModeEnum.sqls,
      instances: [{ instance_name: 'instance1', instance_schema: 'schema1' }]
    });
    await act(() => jest.advanceTimersByTime(3000));

    expect(mockAuditTaskGroupId).toHaveBeenCalledTimes(1);
    expect(mockAuditTaskGroupId).toHaveBeenNthCalledWith(1, {
      task_group_id: 99,
      sql: 'SELECT * FROM table'
    });
    await act(async () => jest.advanceTimersByTime(3000));

    expect(onSuccessSpy).toHaveBeenCalledTimes(1);
    expect(result.current.taskInfos).toEqual(AuditTaskResData);

    await act(async () => {
      result.current.auditWorkflowWithSameSql(
        {
          ...values,
          [SAME_SQL_MODE_DEFAULT_FIELD_KEY]: {
            currentUploadType: AuditTaskResV1SqlSourceEnum.sql_file,
            form_data: 'SELECT * FROM table',
            exec_mode: CreateAuditTasksGroupReqV1ExecModeEnum.sql_file,
            sql_file: [sqlFile],
            zip_file: [zipFile]
          } as SqlStatementFields
        },
        onSuccessSpy
      );
    });

    expect(mockCreateAuditTasksV1).toHaveBeenCalledTimes(2);
    expect(mockCreateAuditTasksV1).toHaveBeenNthCalledWith(2, {
      project_name: mockProjectInfo.projectName,
      exec_mode: CreateAuditTasksGroupReqV1ExecModeEnum.sql_file,
      instances: [{ instance_name: 'instance1', instance_schema: 'schema1' }]
    });
    await act(() => jest.advanceTimersByTime(3000));

    expect(mockAuditTaskGroupId).toHaveBeenCalledTimes(2);
    expect(mockAuditTaskGroupId).toHaveBeenNthCalledWith(2, {
      task_group_id: 99,
      input_sql_file: sqlFile
    });
    await act(async () => jest.advanceTimersByTime(3000));

    await act(async () => {
      result.current.auditWorkflowWithSameSql(
        {
          ...values,
          [SAME_SQL_MODE_DEFAULT_FIELD_KEY]: {
            currentUploadType: AuditTaskResV1SqlSourceEnum.zip_file,
            form_data: 'SELECT * FROM table',
            exec_mode: CreateAuditTasksGroupReqV1ExecModeEnum.sql_file,
            sql_file: [sqlFile],
            zip_file: [zipFile]
          } as SqlStatementFields
        },
        onSuccessSpy
      );
    });

    expect(mockCreateAuditTasksV1).toHaveBeenCalledTimes(3);
    expect(mockCreateAuditTasksV1).toHaveBeenNthCalledWith(3, {
      project_name: mockProjectInfo.projectName,
      exec_mode: CreateAuditTasksGroupReqV1ExecModeEnum.sql_file,
      instances: [{ instance_name: 'instance1', instance_schema: 'schema1' }]
    });
    await act(() => jest.advanceTimersByTime(3000));

    expect(mockAuditTaskGroupId).toHaveBeenCalledTimes(3);
    expect(mockAuditTaskGroupId).toHaveBeenNthCalledWith(3, {
      task_group_id: 99,
      input_zip_file: zipFile
    });
    await act(async () => jest.advanceTimersByTime(3000));

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
        exec_mode: 'sql_file',
        zip_file: [zipFile],
        currentUploadType: AuditTaskResV1SqlSourceEnum.zip_file,
        file_sort_method: 'desc'
      } as SqlStatementFields,
      1: {
        exec_mode: 'sql_file',
        sql_file: [sqlFile],
        currentUploadType: AuditTaskResV1SqlSourceEnum.sql_file
      } as SqlStatementFields,
      2: {
        exec_mode: 'sqls',
        form_data: 'SELECT * FROM table',
        currentUploadType: AuditTaskResV1SqlSourceEnum.form_data
      } as SqlStatementFields,
      databaseInfo: [
        { instanceName: 'instance1', instanceSchema: 'schema1' },
        { instanceName: 'instance2', instanceSchema: 'schema2' },
        { instanceName: 'instance3', instanceSchema: 'schema3' }
      ]
    };

    await act(async () => {
      result.current.auditWorkflowWthDifferenceSql(
        values,
        [
          { key: '0', instanceName: 'instance1', schemaName: 'schema1' },
          { key: '1', instanceName: 'instance2', schemaName: 'schema2' },
          { key: '2', instanceName: 'instance3', schemaName: 'schema3' }
        ],
        onSuccessSpy
      );
    });

    expect(mockCreateAndAuditTaskV1).toHaveBeenCalledTimes(
      values.databaseInfo.length
    );
    expect(mockCreateAndAuditTaskV1).toHaveBeenCalledWith({
      project_name: mockProjectInfo.projectName,
      exec_mode: 'sql_file',
      instance_name: 'instance1',
      instance_schema: 'schema1',
      input_zip_file: zipFile
    });
    expect(mockCreateAndAuditTaskV1).toHaveBeenCalledWith({
      project_name: mockProjectInfo.projectName,
      exec_mode: 'sql_file',
      instance_name: 'instance2',
      instance_schema: 'schema2',
      input_sql_file: sqlFile
    });
    expect(mockCreateAndAuditTaskV1).toHaveBeenCalledWith({
      project_name: mockProjectInfo.projectName,
      exec_mode: 'sqls',
      instance_name: 'instance3',
      instance_schema: 'schema3',
      sql: 'SELECT * FROM table'
    });
    await act(async () => jest.advanceTimersByTime(3000));

    expect(onSuccessSpy).toHaveBeenCalledTimes(1);
    expect(result.current.taskInfos).toEqual([
      AuditTaskResData[0],
      AuditTaskResData[1],
      AuditTaskResData[1]
    ]);
  });
});
