import { renderWithTheme } from '../../../../testUtils/customRender';
import { cleanup, fireEvent, act } from '@testing-library/react';

import { DataSourceResultListProps } from '../index.type';
import DataSourceResultList from '.';

import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { IAuditTaskSQLResV2 } from '@actiontech/shared/lib/api/sqle/service/common';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';

const mockListData: IAuditTaskSQLResV2[] = [];
for (let i = 0; i < 50; i++) {
  mockListData.push({
    number: i + 1,
    audit_level: '',
    audit_result: [
      {
        level: 'level'
      }
    ],
    audit_status: 'audit_status' + i,
    description: 'description' + i,
    exec_result: 'exec_result' + i,
    exec_sql: 'exec_sql' + i,
    exec_status: 'exec_status' + i,
    rollback_sql: 'rollback_sql' + i
  });
}

describe('sqle/Order/AuditDetail/DataSourceResultList', () => {
  const customRender = (params: DataSourceResultListProps) => {
    return renderWithTheme(<DataSourceResultList {...params} />);
  };

  beforeEach(() => {
    jest.useFakeTimers();
    mockUseCurrentUser();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
  });

  it('render snap when loading', () => {
    const { baseElement } = customRender({
      list: undefined,
      total: undefined,
      pagination: {
        page_index: 1,
        page_size: 10
      },
      onChange: jest.fn(),
      loading: true,
      taskId: 'task id',
      refresh: jest.fn()
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when load is false', () => {
    const { baseElement } = customRender({
      list: mockListData,
      total: mockListData.length,
      pagination: {
        page_index: 1,
        page_size: 10
      },
      onChange: jest.fn(),
      loading: false,
      taskId: 'task id',
      refresh: jest.fn()
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render onChange event', async () => {
    const onChangeSpy = jest.fn();
    customRender({
      list: mockListData,
      total: mockListData.length,
      pagination: {
        page_index: 1,
        page_size: 10
      },
      onChange: onChangeSpy,
      loading: false,
      taskId: 'task id',
      refresh: jest.fn()
    });
    await act(async () => {
      fireEvent.click(getBySelector('li[title="2"]'));
      await jest.advanceTimersByTime(100);
    });
    expect(onChangeSpy).toBeCalledTimes(1);
  });
});
