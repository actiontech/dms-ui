import { cleanup, screen, act, fireEvent } from '@testing-library/react';
import SqlAuditList from '.';
import sqlAuditRecord from '@actiontech/shared/lib/testUtil/mockApi/sqle/sqlAuditRecord';
import instance from '@actiontech/shared/lib/testUtil/mockApi/sqle/instance';
import { sqlAuditRecordMockData } from '@actiontech/shared/lib/testUtil/mockApi/sqle/sqlAuditRecord/data';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { createSpyErrorResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import {
  getAllBySelector,
  getBySelector,
  queryBySelector
} from '@actiontech/shared/lib/testUtil/customQuery';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import { sqleSuperRender } from '../../../testUtils/superRender';
import { useSelector } from 'react-redux';
import { driverMeta } from '../../../hooks/useDatabaseType/index.test.data';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn()
  };
});

describe('sqle/SqlAudit/List', () => {
  let sqlAuditRecordsSpy: jest.SpyInstance;
  let mockUseCurrentProjectSpy: jest.SpyInstance;
  beforeEach(() => {
    jest.useFakeTimers();
    instance.mockAllApi();
    sqlAuditRecordsSpy = sqlAuditRecord.getSQLAuditRecords();
    mockUseCurrentProjectSpy = mockUseCurrentProject();
    mockUseCurrentUser();

    (useSelector as jest.Mock).mockImplementation((selector) => {
      return selector({
        database: { driverMeta: driverMeta },
        permission: {
          moduleFeatureSupport: false,
          userOperationPermissions: {
            is_admin: true,
            op_permission_list: []
          }
        }
      });
    });
  });

  beforeAll(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('render sql audit record table when request return data', async () => {
    const { baseElement } = sqleSuperRender(<SqlAuditList />);

    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(sqlAuditRecordsSpy).toHaveBeenCalledTimes(1);
    expect(
      screen.getByText(`共 ${sqlAuditRecordMockData.length} 条数据`)
    ).toBeInTheDocument();
    expect(
      screen
        .getByText(sqlAuditRecordMockData[0].sql_audit_record_id!)
        .closest('a')
    ).toHaveAttribute(
      'href',
      `/sqle/project/${mockProjectInfo.projectID}/sql-audit/detail/${sqlAuditRecordMockData[0].sql_audit_record_id}`
    );
    expect(
      screen
        .getByText(sqlAuditRecordMockData[1].sql_audit_record_id!)
        .closest('a')
    ).toHaveAttribute(
      'href',
      `/sqle/project/${mockProjectInfo.projectID}/sql-audit/detail/${sqlAuditRecordMockData[1].sql_audit_record_id}`
    );
  });

  it('should request list with url params', async () => {
    sqleSuperRender(<SqlAuditList />, undefined, {
      routerProps: { initialEntries: ['/sql-audit?SQLAuditRecordID=123456'] }
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(sqlAuditRecordsSpy).toHaveBeenCalledTimes(1);
    expect(sqlAuditRecordsSpy).toHaveBeenCalledWith({
      page_index: 1,
      page_size: 20,
      project_name: mockProjectInfo.projectName,
      filter_sql_audit_record_ids: '123456',
      fuzzy_search_tags: ''
    });
  });

  it('render table when request return error', async () => {
    sqlAuditRecordsSpy.mockClear();
    sqlAuditRecordsSpy.mockImplementationOnce(() =>
      createSpyErrorResponse({ message: 'error info' })
    );
    const { baseElement } = sqleSuperRender(<SqlAuditList />);

    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText('快捷审核')).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
  });

  it('render table list when action filter', async () => {
    const { baseElement } = sqleSuperRender(<SqlAuditList />);

    await act(async () => jest.advanceTimersByTime(3000));
    expect(sqlAuditRecordsSpy).toHaveBeenCalledTimes(1);
    const searchInputEle = getBySelector(
      '.basic-input-wrapper #actiontech-table-search-input',
      baseElement
    );
    await act(async () => {
      fireEvent.input(searchInputEle, {
        target: { value: 'test' }
      });
      await jest.advanceTimersByTime(300);
    });
    await act(async () => {
      fireEvent.keyDown(searchInputEle, {
        key: 'Enter',
        code: 'Enter',
        keyCode: 13
      });
      await act(() => jest.advanceTimersByTime(300));
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(sqlAuditRecordsSpy).toHaveBeenCalled();
    expect(sqlAuditRecordsSpy).toHaveBeenCalledWith({
      project_name: mockProjectInfo.projectName,
      fuzzy_search_tags: 'test',
      page_index: 1,
      page_size: 20,
      filter_sql_audit_record_ids: undefined
    });
  });

  it('render action when filter item show', async () => {
    const { baseElement } = sqleSuperRender(<SqlAuditList />);

    await act(async () => jest.advanceTimersByTime(3000));
    expect(sqlAuditRecordsSpy).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByText('筛选'));
    await act(async () => jest.advanceTimersByTime(300));
    const filterItems = getAllBySelector(
      '.actiontech-table-filter-container-namespace .ant-space-item',
      baseElement
    );
    expect(filterItems.length).toBe(2);
    expect(baseElement).toMatchSnapshot();
  });

  it('should hide link button when project is archived', async () => {
    sqleSuperRender(<SqlAuditList />);

    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText('创建审核')).toBeInTheDocument();
    cleanup();

    mockUseCurrentUser({
      bindProjects: [
        {
          project_id: mockProjectInfo.projectID,
          project_name: mockProjectInfo.projectName,
          is_manager: true,
          archived: true
        }
      ]
    });
    sqleSuperRender(<SqlAuditList />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.queryByText('创建审核')).not.toBeInTheDocument();
  });

  it('change record tags', async () => {
    const updateSQLAuditRecordSpy = sqlAuditRecord.updateSQLAuditRecord();
    sqlAuditRecordsSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: [sqlAuditRecordMockData[0]],
        total_nums: 2
      })
    );
    sqleSuperRender(<SqlAuditList />);

    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(
      queryBySelector(
        '.anticon-close.ant-tag-close-icon',
        screen.getByText('test').parentElement!
      )!
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(updateSQLAuditRecordSpy).toHaveBeenCalledTimes(1);
    expect(updateSQLAuditRecordSpy).toHaveBeenCalledWith({
      tags: [],
      sql_audit_record_id: sqlAuditRecordMockData[0].sql_audit_record_id,
      project_name: mockProjectInfo.projectName
    });
    expect(screen.getByText('更新业务标签成功')).toBeInTheDocument();
    expect(sqlAuditRecordsSpy).toHaveBeenCalled();
  });

  it('render polling request when sql audit status is auditing', async () => {
    sqlAuditRecordsSpy
      .mockImplementationOnce(() =>
        createSpySuccessResponse({
          data: [
            {
              ...sqlAuditRecordMockData[0],
              sql_audit_status: 'auditing'
            }
          ],
          total_nums: 2
        })
      )
      .mockImplementationOnce(() =>
        createSpySuccessResponse({
          data: [
            {
              ...sqlAuditRecordMockData[0],
              sql_audit_status: 'successfully'
            }
          ],
          total_nums: 2
        })
      );
    sqleSuperRender(<SqlAuditList />);

    await act(async () => jest.advanceTimersByTime(3000));
    expect(sqlAuditRecordsSpy).toHaveBeenCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(sqlAuditRecordsSpy).toHaveBeenCalledTimes(2);
  });

  it('render stop polling request when sql audit status is not auditing', async () => {
    sqlAuditRecordsSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: [
          {
            ...sqlAuditRecordMockData[0],
            sql_audit_status: 'successfully'
          }
        ],
        total_nums: 2
      })
    );
    sqleSuperRender(<SqlAuditList />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(sqlAuditRecordsSpy).toHaveBeenCalledTimes(1);
  });
});
