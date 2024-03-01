import AuditResultForCreateList from '.';
import { AuditResultForCreateListProps } from './index.type';

import { superRender } from '../../../../../testUtils/customRender';
import { fireEvent, act, cleanup, screen } from '@testing-library/react';
import order from '../../../../../testUtils/mockApi/order';
import { getAuditTaskSQLsV2FilterAuditLevelEnum } from '@actiontech/shared/lib/api/sqle/service/task/index.enum';
import { createSpyFailResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import {
  getBySelector,
  getAllBySelector
} from '@actiontech/shared/lib/testUtil/customQuery';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import rule_template from '../../../../..//testUtils/mockApi/rule_template';

describe('sqle/Order/Common/AuditResultList/List', () => {
  let requestUpdateAuditTaskSQLs: jest.SpyInstance;
  let requestGetAuditTaskSQLs: jest.SpyInstance;

  const customRender = (params: AuditResultForCreateListProps) => {
    return superRender(<AuditResultForCreateList {...params} />);
  };

  beforeEach(() => {
    jest.useFakeTimers();
    requestUpdateAuditTaskSQLs = order.updateAuditTaskSQLs();
    requestGetAuditTaskSQLs = order.getAuditTaskSQLs();
    order.mockAllApi();
    rule_template.getRuleList();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
  });

  it('render snap when data is empty', () => {
    const { baseElement } = customRender({
      duplicate: true,
      projectID: 'projectID',
      auditLevelFilterValue: 'all'
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when get table data', async () => {
    const openSpy = jest.spyOn(window, 'open').mockImplementation(() => null);
    const { baseElement } = customRender({
      duplicate: true,
      taskID: 'taskID',
      projectID: 'projectID',
      auditLevelFilterValue: getAuditTaskSQLsV2FilterAuditLevelEnum.normal
    });

    await act(async () => jest.advanceTimersByTime(500));
    expect(baseElement).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(2600));
    expect(baseElement).toMatchSnapshot();
    expect(requestGetAuditTaskSQLs).toHaveBeenCalled();
    expect(requestGetAuditTaskSQLs).toHaveBeenCalledWith({
      filter_audit_level: 'normal',
      no_duplicate: true,
      page_index: '1',
      page_size: '20',
      task_id: 'taskID'
    });

    const analyzeBtn = screen.getAllByText('分 析');
    expect(analyzeBtn.length).toBe(1);
    fireEvent.click(screen.getByText('分 析'));
    await act(async () => jest.advanceTimersByTime(500));
    expect(openSpy).toHaveBeenCalled();
    expect(openSpy).toHaveBeenCalledWith(
      `/sqle/project/projectID/order/taskID/1/analyze`
    );
    openSpy.mockRestore();
  });

  it('render snap when get table error', async () => {
    requestGetAuditTaskSQLs.mockImplementation(() =>
      createSpyFailResponse({ message: 'error' })
    );
    const { baseElement } = customRender({
      duplicate: true,
      taskID: 'taskID',
      projectID: 'projectID',
      auditLevelFilterValue: getAuditTaskSQLsV2FilterAuditLevelEnum.normal
    });

    await act(async () => jest.advanceTimersByTime(3300));
    expect(baseElement).toMatchSnapshot();
    expect(requestGetAuditTaskSQLs).toHaveBeenCalled();
    expect(requestGetAuditTaskSQLs).toHaveBeenCalledWith({
      filter_audit_level: 'normal',
      no_duplicate: true,
      page_index: '1',
      page_size: '20',
      task_id: 'taskID'
    });
  });

  it('render snap when add note', async () => {
    const { baseElement } = customRender({
      duplicate: true,
      taskID: 'taskID',
      projectID: 'projectID',
      auditLevelFilterValue: getAuditTaskSQLsV2FilterAuditLevelEnum.normal
    });

    await act(async () => jest.advanceTimersByTime(3300));
    expect(screen.getByText('添加说明')).toBeInTheDocument();
    fireEvent.click(screen.getByText('添加说明'));
    await act(async () => jest.advanceTimersByTime(500));
    const descInput = getBySelector('textarea.ant-input', baseElement);
    fireEvent.change(descInput, {
      target: {
        value: 'desc text'
      }
    });
    await act(async () => jest.advanceTimersByTime(200));
    fireEvent.keyDown(descInput, {
      key: 'Enter',
      code: 'Enter',
      keyCode: 13
    });
    await act(async () => jest.advanceTimersByTime(500));
    expect(baseElement).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(2600));
    expect(baseElement).toMatchSnapshot();
  });

  it('should match snapshot when has audit result data', async () => {
    requestGetAuditTaskSQLs.mockClear();
    requestGetAuditTaskSQLs.mockImplementation(() =>
      createSpySuccessResponse({
        data: [
          {
            number: 1,
            exec_sql: 'SELECT * ',
            sql_source_file: '',
            audit_level: '',
            audit_status: 'finished',
            exec_result: '',
            exec_status: 'initialized',
            description: '',
            audit_result: [
              {
                level: 'error',
                message: '除了自增列及大字段列之外，每个列都必须添加默认值',
                rule_name: 'ddl_check_column_without_default',
                db_type: ''
              }
            ]
          },
          {
            number: 2,
            exec_sql: 'SELECT * ',
            sql_source_file: '',
            audit_level: '',
            audit_status: 'finished',
            exec_result: '',
            exec_status: 'initialized',
            description: '',
            audit_result: [
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

    const { baseElement } = customRender({
      duplicate: true,
      taskID: 'taskID',
      projectID: 'projectID',
      auditLevelFilterValue: getAuditTaskSQLsV2FilterAuditLevelEnum.normal
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestGetAuditTaskSQLs).toBeCalled();
    expect(baseElement).toMatchSnapshot();

    fireEvent.click(
      getAllBySelector('.audit-result-describe-column .ant-btn')[0]
    );
    await act(async () => jest.advanceTimersByTime(300));
    const inputEl = getAllBySelector(
      '.audit-result-describe-column .ant-input'
    )[0];
    await act(async () => {
      fireEvent.input(inputEl, {
        target: { value: 'test1' }
      });
      await jest.advanceTimersByTime(300);
    });

    await act(async () => {
      fireEvent.keyDown(inputEl, {
        key: 'Enter',
        code: 'Enter',
        keyCode: 13
      });
      fireEvent.keyUp(inputEl, {
        key: 'Enter',
        code: 'Enter',
        keyCode: 13
      });
      await act(() => jest.advanceTimersByTime(3300));
    });
    expect(requestUpdateAuditTaskSQLs).toBeCalledTimes(1);

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
});
