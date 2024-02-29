import { renderWithTheme } from '../../../../testUtils/customRender';
import { cleanup } from '@testing-library/react';

import { DataSourceResultWaterfallListProps } from '../index.type';
import DataSourceWaterfallList from './WaterfallList';

import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { IAuditTaskSQLResV2 } from '@actiontech/shared/lib/api/sqle/service/common';

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

describe('sqle/Order/AuditDetail/DataSourceWaterfallList', () => {
  const customRender = (params: DataSourceResultWaterfallListProps) => {
    return renderWithTheme(<DataSourceWaterfallList {...params} />);
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
      hasMore: false,
      loading: true,
      taskId: 'task id',
      scrollPage: 1,
      refreshScrollList: jest.fn(),
      list: undefined
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render all data', async () => {
    const { baseElement } = customRender({
      hasMore: false,
      loading: false,
      taskId: 'task id',
      scrollPage: 1,
      refreshScrollList: jest.fn(),
      list: mockListData
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render has more data', async () => {
    const { baseElement } = customRender({
      hasMore: true,
      loading: false,
      taskId: 'task id',
      scrollPage: 5,
      refreshScrollList: jest.fn(),
      list: mockListData
    });
    expect(baseElement).toMatchSnapshot();
  });
});
