import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import AuditResultList from '.';
import { superRender } from '../../../../testUtils/customRender';
import dataExport from '../../../../testUtils/mockApi/dataExport';
import {
  BatchGetDataExportTaskResponseData,
  ListDataExportTaskSQLsResponseData
} from '../../../../testUtils/mockApi/dataExport/data';
import {
  createSpySuccessResponse,
  createSpyFailResponse
} from '@actiontech/shared/lib/testUtil/mockApi';
import { GetDataExportTaskStatusEnum } from '@actiontech/shared/lib/api/base/service/common.enum';
import {
  getAllBySelector,
  getBySelector
} from '@actiontech/shared/lib/testUtil/customQuery';

describe('test DataExport/Common/AuditResultList', () => {
  let batchGetTaskSpy: jest.SpyInstance;
  let getTaskSQLsSpy: jest.SpyInstance;
  const taskIDs = ['1233234654', '324234234'];
  const projectID = '400300';

  beforeEach(() => {
    jest.useFakeTimers();
    batchGetTaskSpy = dataExport.BatchGetDataExportTask();
    getTaskSQLsSpy = dataExport.ListDataExportTaskSQLs();
  });
  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  it('should match snapshot', async () => {
    const { baseElement } = superRender(
      <AuditResultList taskIDs={taskIDs} projectID={projectID} />
    );
    expect(baseElement).toMatchSnapshot();

    expect(batchGetTaskSpy).toBeCalledTimes(1);
    expect(batchGetTaskSpy).toBeCalledWith({
      project_uid: projectID,
      data_export_task_uids: '1233234654,324234234'
    });

    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();

    expect(getTaskSQLsSpy).toBeCalledTimes(1);
    expect(getTaskSQLsSpy).toBeCalledWith({
      project_uid: projectID,
      data_export_task_uid: BatchGetDataExportTaskResponseData[0].task_uid,
      page_index: 1,
      page_size: 20
    });

    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();

    fireEvent.click(
      getAllBySelector(
        '.audit-result-exec-sql-column .ant-typography-ellipsis'
      )[0]
    );
    expect(baseElement).toMatchSnapshot();
    expect(getBySelector('.ant-drawer-content-wrapper')).not.toHaveClass(
      'ant-drawer-content-wrapper-hidden'
    );
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.click(getBySelector('.closed-icon-custom'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(getBySelector('.ant-drawer-content-wrapper')).toHaveClass(
      'ant-drawer-content-wrapper-hidden'
    );
    fireEvent.click(getAllBySelector('.audit-result-column')[1].children[0]);
    await act(async () => jest.advanceTimersByTime(300));
    expect(getBySelector('.ant-drawer-content-wrapper')).not.toHaveClass(
      'ant-drawer-content-wrapper-hidden'
    );
  });

  it('should match snapshot when data is null', async () => {
    getTaskSQLsSpy.mockClear();
    getTaskSQLsSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: [
          {
            uid: 1,
            sql: null,
            export_status: '',
            export_sql_type: '',
            audit_level: '',
            audit_sql_result: [
              {
                level: 'error',
                message: '除了自增列及大字段列之外，每个列都必须添加默认值',
                rule_name: 'ddl_check_column_without_default',
                db_type: ''
              }
            ]
          },
          {
            uid: 2,
            sql: 'SELECT 1;',
            export_status: '',
            export_sql_type: 'dql',
            audit_level: '',
            audit_sql_result: [
              {
                level: 'error',
                message: '除了自增列及大字段列之外，每个列都必须添加默认值',
                rule_name: 'ddl_check_column_without_default',
                db_type: ''
              },
              {
                level: null,
                message: '主键建议使用 BIGINT 无符号类型，即 BIGINT UNSIGNED',
                rule_name: 'ddl_check_pk_without_bigint_unsigned',
                db_type: ''
              }
            ]
          }
        ]
      })
    );
    const { container } = superRender(
      <AuditResultList taskIDs={taskIDs} projectID={projectID} />
    );
    await act(async () => jest.advanceTimersByTime(3000));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getTaskSQLsSpy).toBeCalledTimes(1);
    expect(container).toMatchSnapshot();
  });

  it('should switch tab when click label', async () => {
    batchGetTaskSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: [
          ...BatchGetDataExportTaskResponseData,
          {
            task_uid: '1752623436938612735',
            db_info: {
              uid: '1752583372904861696',
              name: 'test-mysql-1',
              db_type: '',
              database_name: ''
            },
            status: GetDataExportTaskStatusEnum.init,
            file_name: '',
            audit_result: {
              audit_level: '',
              score: 100,
              pass_rate: 1
            },
            export_type: 'SQL',
            export_file_type: 'CSV'
          }
        ]
      })
    );

    const { container } = superRender(
      <AuditResultList taskIDs={taskIDs} projectID={projectID} />
    );
    await act(async () => jest.advanceTimersByTime(3000));

    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.click(screen.getByText('test-mysql-1'));
    expect(getTaskSQLsSpy).toBeCalledTimes(2);
    expect(getTaskSQLsSpy).toBeCalledWith({
      project_uid: projectID,
      data_export_task_uid: '1752623436938612735',
      page_index: 1,
      page_size: 20
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(container).toMatchSnapshot();
  });

  it('should execute updateExecuteSQLsTypeIsDQL', async () => {
    const updateExecuteSQLsTypeIsDQLSpy = jest.fn();
    superRender(
      <AuditResultList
        taskIDs={taskIDs}
        projectID={projectID}
        updateExecuteSQLsTypeIsDQL={updateExecuteSQLsTypeIsDQLSpy}
      />
    );
    await act(async () => jest.advanceTimersByTime(3000));
    await act(async () => jest.advanceTimersByTime(3000));

    expect(updateExecuteSQLsTypeIsDQLSpy).toBeCalledTimes(1);
    expect(updateExecuteSQLsTypeIsDQLSpy).toBeCalledWith(true);

    jest.clearAllMocks();
    cleanup();

    getTaskSQLsSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: [
          ...ListDataExportTaskSQLsResponseData,
          {
            uid: 7,
            sql: 'INSERT INTO t1 values (name, "test")',
            export_status: '',
            export_sql_type: 'dml',
            audit_level: ''
          }
        ]
      })
    );
    superRender(
      <AuditResultList
        taskIDs={taskIDs}
        projectID={projectID}
        updateExecuteSQLsTypeIsDQL={updateExecuteSQLsTypeIsDQLSpy}
      />
    );
    await act(async () => jest.advanceTimersByTime(3000));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(updateExecuteSQLsTypeIsDQLSpy).toBeCalledTimes(1);
    expect(updateExecuteSQLsTypeIsDQLSpy).toBeCalledWith(false);

    jest.clearAllMocks();
    cleanup();

    getTaskSQLsSpy.mockImplementation(() => createSpyFailResponse({}));
    superRender(
      <AuditResultList
        taskIDs={taskIDs}
        projectID={projectID}
        updateExecuteSQLsTypeIsDQL={updateExecuteSQLsTypeIsDQLSpy}
      />
    );
    await act(async () => jest.advanceTimersByTime(3000));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(updateExecuteSQLsTypeIsDQLSpy).toBeCalledTimes(1);
    expect(updateExecuteSQLsTypeIsDQLSpy).toBeCalledWith(true);
  });
});
