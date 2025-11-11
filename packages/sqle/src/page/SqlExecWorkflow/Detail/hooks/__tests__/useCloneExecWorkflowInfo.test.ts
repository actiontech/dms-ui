import { act, cleanup, renderHook } from '@testing-library/react';
import execWorkflow from '@actiontech/shared/lib/testUtil/mockApi/sqle/execWorkflow';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { WorkflowsOverviewListData } from '@actiontech/shared/lib/testUtil/mockApi/sqle/execWorkflow/data';
import useCloneExecWorkflowInfo from '../useCloneExecWorkflowInfo';
import {
  AuditTaskResV1AuditLevelEnum,
  AuditTaskResV1StatusEnum,
  AuditTaskResV1SqlSourceEnum,
  WorkflowResV2ModeEnum,
  CreateAuditTasksGroupReqV1ExecModeEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { IAuditTaskResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import 'blob-polyfill';
import { AxiosResponse } from 'axios';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
  useSelector: jest.fn()
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn()
}));

describe('test useCloneExecWorkflowInfo', () => {
  let getAuditTaskSQLsSpy: jest.SpyInstance;
  let getWorkflowAttachmentSpy: jest.SpyInstance;
  const dispatchSpy = jest.fn();
  const navigateSpy = jest.fn();

  beforeEach(() => {
    mockUseCurrentProject();
    jest.useFakeTimers();
    (useNavigate as jest.Mock).mockImplementation(() => navigateSpy);
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
    getAuditTaskSQLsSpy = execWorkflow.getAuditTaskSQLs();
    getWorkflowAttachmentSpy = execWorkflow.getWorkflowAttachment();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  const taskInfo: IAuditTaskResV1 = {
    task_id: 50,
    instance_name: 'mysql-1',
    instance_db_type: 'MySQL',
    instance_schema: 'test',
    audit_level: AuditTaskResV1AuditLevelEnum.UNKNOWN,
    score: 100,
    pass_rate: 1,
    status: AuditTaskResV1StatusEnum.audited,
    sql_source: AuditTaskResV1SqlSourceEnum.form_data,
    exec_mode: CreateAuditTasksGroupReqV1ExecModeEnum.sqls,
    file_order_method: 'value1'
  };

  describe('workflow mode is same_sqls', () => {
    it('render execute in other instance when sql_source is form_data', async () => {
      const { result } = renderHook(() =>
        useCloneExecWorkflowInfo([taskInfo], {
          ...WorkflowsOverviewListData,
          mode: WorkflowResV2ModeEnum.same_sqls
        })
      );
      await act(async () => {
        result.current.executeInOtherInstance();
        await jest.advanceTimersByTime(3000);
      });
      expect(getAuditTaskSQLsSpy).toHaveBeenCalledTimes(1);
      expect(getAuditTaskSQLsSpy).toHaveBeenNthCalledWith(1, {
        task_id: `${taskInfo.task_id}`,
        page_index: '1',
        page_size: '9999'
      });
      expect(dispatchSpy).toHaveBeenCalledTimes(2);
      expect(dispatchSpy).toHaveBeenNthCalledWith(1, {
        payload: {
          workflow_subject: WorkflowsOverviewListData.workflow_name,
          desc: WorkflowsOverviewListData.desc
        },
        type: 'sqlExecWorkflow/updateClonedExecWorkflowBaseInfo'
      });
      expect(dispatchSpy).toHaveBeenNthCalledWith(2, {
        payload: {
          isSameSqlForAll: true,
          databaseInfo: [
            {
              instanceName: 'mysql-1',
              instanceSchema: 'test'
            }
          ],
          '0': {
            currentUploadType: AuditTaskResV1SqlSourceEnum.form_data,
            form_data: 'SELECT * '
          }
        },
        type: 'sqlExecWorkflow/updateClonedExecWorkflowSqlAuditInfo'
      });
      expect(navigateSpy).toHaveBeenCalledTimes(1);
    });

    it('render execute in other instance when sql_source is sql_file', async () => {
      const { result } = renderHook(() =>
        useCloneExecWorkflowInfo(
          [
            {
              ...taskInfo,
              sql_source: AuditTaskResV1SqlSourceEnum.sql_file,
              audit_files: [{ file_name: 'test.sql' }]
            }
          ],
          {
            ...WorkflowsOverviewListData,
            mode: WorkflowResV2ModeEnum.same_sqls
          }
        )
      );
      await act(async () => {
        result.current.executeInOtherInstance();
        await jest.advanceTimersByTime(3000);
      });
      await act(async () => {
        await jest.advanceTimersByTime(3000);
      });
      expect(getWorkflowAttachmentSpy).toHaveBeenCalledTimes(1);
      expect(getWorkflowAttachmentSpy).toHaveBeenNthCalledWith(
        1,
        {
          project_name: mockProjectInfo.projectName,
          task_id: `${taskInfo.task_id}`,
          workflow_id: WorkflowsOverviewListData.workflow_id
        },
        { responseType: 'blob' }
      );
      expect(dispatchSpy).toHaveBeenCalledTimes(2);
      expect(dispatchSpy).toHaveBeenNthCalledWith(1, {
        payload: {
          workflow_subject: WorkflowsOverviewListData.workflow_name,
          desc: WorkflowsOverviewListData.desc
        },
        type: 'sqlExecWorkflow/updateClonedExecWorkflowBaseInfo'
      });
      expect(dispatchSpy).toHaveBeenNthCalledWith(2, {
        payload: {
          isSameSqlForAll: true,
          databaseInfo: [
            {
              instanceName: 'mysql-1',
              instanceSchema: 'test'
            }
          ],
          '0': {
            currentUploadType: AuditTaskResV1SqlSourceEnum.sql_file,
            exec_mode: CreateAuditTasksGroupReqV1ExecModeEnum.sqls,
            sql_file: [new File([new Blob(['test file content'])], 'test.sql')]
          }
        },
        type: 'sqlExecWorkflow/updateClonedExecWorkflowSqlAuditInfo'
      });
      expect(navigateSpy).toHaveBeenCalledTimes(1);
    });

    it('render execute in other instance when sql_source is zip_file', async () => {
      const { result } = renderHook(() =>
        useCloneExecWorkflowInfo(
          [
            {
              ...taskInfo,
              // 目前接口返回的sql_source是错的，待后端修改统一
              sql_source: AuditTaskResV1SqlSourceEnum.zip_file,
              exec_mode: CreateAuditTasksGroupReqV1ExecModeEnum.sql_file,
              audit_files: [{ file_name: 'test.zip' }]
            }
          ],
          {
            ...WorkflowsOverviewListData,
            mode: WorkflowResV2ModeEnum.same_sqls
          }
        )
      );
      await act(async () => {
        result.current.executeInOtherInstance();
        await jest.advanceTimersByTime(3000);
      });
      await act(async () => {
        await jest.advanceTimersByTime(3000);
      });
      expect(getWorkflowAttachmentSpy).toHaveBeenCalledTimes(1);
      expect(getWorkflowAttachmentSpy).toHaveBeenNthCalledWith(
        1,
        {
          project_name: mockProjectInfo.projectName,
          task_id: `${taskInfo.task_id}`,
          workflow_id: WorkflowsOverviewListData.workflow_id
        },
        { responseType: 'blob' }
      );
      expect(dispatchSpy).toHaveBeenCalledTimes(2);
      expect(dispatchSpy).toHaveBeenNthCalledWith(1, {
        payload: {
          workflow_subject: WorkflowsOverviewListData.workflow_name,
          desc: WorkflowsOverviewListData.desc
        },
        type: 'sqlExecWorkflow/updateClonedExecWorkflowBaseInfo'
      });
      expect(dispatchSpy).toHaveBeenNthCalledWith(2, {
        payload: {
          isSameSqlForAll: true,
          databaseInfo: [
            {
              instanceName: 'mysql-1',
              instanceSchema: 'test'
            }
          ],
          '0': {
            currentUploadType: AuditTaskResV1SqlSourceEnum.zip_file,
            exec_mode: CreateAuditTasksGroupReqV1ExecModeEnum.sql_file,
            file_sort_method: 'value1',
            zip_file: [new File([new Blob(['test file content'])], 'test.zip')]
          }
        },
        type: 'sqlExecWorkflow/updateClonedExecWorkflowSqlAuditInfo'
      });
      expect(navigateSpy).toHaveBeenCalledTimes(1);
    });

    it('render sql_source is zip_file when Request file failed ', async () => {
      getWorkflowAttachmentSpy.mockClear();
      getWorkflowAttachmentSpy.mockImplementation(() => {
        return new Promise<AxiosResponse<any>>((res) => {
          setTimeout(() => {
            res({
              status: 200,
              headers: {},
              config: {},
              statusText: '',
              data: new Blob([
                JSON.stringify({ code: -1, message: '获取文件失败' })
              ])
            });
          }, 3000);
        });
      });
      const { result } = renderHook(() =>
        useCloneExecWorkflowInfo(
          [
            {
              ...taskInfo,
              // 目前接口返回的sql_source是错的，待后端修改统一
              sql_source: AuditTaskResV1SqlSourceEnum.zip_file,
              exec_mode: CreateAuditTasksGroupReqV1ExecModeEnum.sql_file,
              audit_files: [{ file_name: 'test.zip' }]
            }
          ],
          {
            ...WorkflowsOverviewListData,
            mode: WorkflowResV2ModeEnum.same_sqls
          }
        )
      );
      await act(async () => {
        result.current.executeInOtherInstance();
        await jest.advanceTimersByTime(3000);
      });
      await act(async () => {
        await jest.advanceTimersByTime(3000);
      });
      expect(getWorkflowAttachmentSpy).toHaveBeenCalledTimes(1);
      expect(getWorkflowAttachmentSpy).toHaveBeenNthCalledWith(
        1,
        {
          project_name: mockProjectInfo.projectName,
          task_id: `${taskInfo.task_id}`,
          workflow_id: WorkflowsOverviewListData.workflow_id
        },
        { responseType: 'blob' }
      );
      expect(dispatchSpy).toHaveBeenCalledTimes(2);
      expect(dispatchSpy).toHaveBeenNthCalledWith(1, {
        payload: {
          workflow_subject: WorkflowsOverviewListData.workflow_name,
          desc: WorkflowsOverviewListData.desc
        },
        type: 'sqlExecWorkflow/updateClonedExecWorkflowBaseInfo'
      });
      expect(dispatchSpy).toHaveBeenNthCalledWith(2, {
        payload: {
          isSameSqlForAll: true,
          databaseInfo: [
            {
              instanceName: 'mysql-1',
              instanceSchema: 'test'
            }
          ],
          '0': {
            currentUploadType: AuditTaskResV1SqlSourceEnum.zip_file,
            exec_mode: CreateAuditTasksGroupReqV1ExecModeEnum.sql_file,
            file_sort_method: 'value1',
            zip_file: undefined
          }
        },
        type: 'sqlExecWorkflow/updateClonedExecWorkflowSqlAuditInfo'
      });
      expect(navigateSpy).toHaveBeenCalledTimes(1);
    });
  });

  it('render execute in other instance when workflow mode is different_sqls', async () => {
    const { result } = renderHook(() =>
      useCloneExecWorkflowInfo(
        [
          {
            ...taskInfo,
            sql_source: AuditTaskResV1SqlSourceEnum.form_data
          },
          {
            ...taskInfo,
            sql_source: AuditTaskResV1SqlSourceEnum.sql_file,
            task_id: 51,
            audit_files: [{ file_name: 'test.sql' }],
            exec_mode: CreateAuditTasksGroupReqV1ExecModeEnum.sqls
          },
          {
            ...taskInfo,
            sql_source: AuditTaskResV1SqlSourceEnum.zip_file,
            task_id: 52,
            audit_files: [{ file_name: 'test.zip' }],
            exec_mode: CreateAuditTasksGroupReqV1ExecModeEnum.sql_file,
            file_order_method: 'value1'
          }
        ],
        {
          ...WorkflowsOverviewListData,
          mode: WorkflowResV2ModeEnum.different_sqls
        }
      )
    );
    await act(async () => {
      result.current.executeInOtherInstance();
      await jest.advanceTimersByTime(3000);
    });
    await act(async () => {
      await jest.advanceTimersByTime(3000);
    });
    expect(getAuditTaskSQLsSpy).toHaveBeenCalledTimes(1);
    expect(getAuditTaskSQLsSpy).toHaveBeenNthCalledWith(1, {
      task_id: `${taskInfo.task_id}`,
      page_index: '1',
      page_size: '9999'
    });
    expect(getWorkflowAttachmentSpy).toHaveBeenCalledTimes(2);
    expect(getWorkflowAttachmentSpy).toHaveBeenNthCalledWith(
      1,
      {
        project_name: mockProjectInfo.projectName,
        task_id: '51',
        workflow_id: WorkflowsOverviewListData.workflow_id
      },
      { responseType: 'blob' }
    );
    expect(getWorkflowAttachmentSpy).toHaveBeenNthCalledWith(
      2,
      {
        project_name: mockProjectInfo.projectName,
        task_id: '52',
        workflow_id: WorkflowsOverviewListData.workflow_id
      },
      { responseType: 'blob' }
    );
    expect(dispatchSpy).toHaveBeenCalledTimes(2);
    expect(dispatchSpy).toHaveBeenNthCalledWith(1, {
      payload: {
        workflow_subject: WorkflowsOverviewListData.workflow_name,
        desc: WorkflowsOverviewListData.desc
      },
      type: 'sqlExecWorkflow/updateClonedExecWorkflowBaseInfo'
    });
    expect(dispatchSpy).toHaveBeenNthCalledWith(2, {
      payload: {
        isSameSqlForAll: false,
        databaseInfo: [
          {
            instanceName: 'mysql-1',
            instanceSchema: 'test'
          },
          {
            instanceName: 'mysql-1',
            instanceSchema: 'test'
          },
          {
            instanceName: 'mysql-1',
            instanceSchema: 'test'
          }
        ],
        '0': {
          currentUploadType: AuditTaskResV1SqlSourceEnum.form_data,
          form_data: 'SELECT * '
        },
        '1': {
          currentUploadType: AuditTaskResV1SqlSourceEnum.sql_file,
          exec_mode: CreateAuditTasksGroupReqV1ExecModeEnum.sqls,
          sql_file: [new File([new Blob(['test file content'])], 'test.sql')]
        },
        '2': {
          currentUploadType: AuditTaskResV1SqlSourceEnum.zip_file,
          exec_mode: CreateAuditTasksGroupReqV1ExecModeEnum.sql_file,
          file_sort_method: 'value1',
          zip_file: [new File([new Blob(['test file content'])], 'test.zip')]
        }
      },
      type: 'sqlExecWorkflow/updateClonedExecWorkflowSqlAuditInfo'
    });
    expect(navigateSpy).toHaveBeenCalledTimes(1);
  });
});
