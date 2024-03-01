import { cleanup, screen, act, fireEvent } from '@testing-library/react';
import { renderWithReduxAndTheme } from '@actiontech/shared/lib/testUtil/customRender';
import SqlAuditList from '.';
import sqlAuditRecord from '../../../testUtils/mockApi/sqlAuditRecord';
import instance from '../../../testUtils/mockApi/instance';
import { sqlAuditRecordMockData } from '../../../testUtils/mockApi/sqlAuditRecord/data';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { createSpyErrorResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import {
  getAllBySelector,
  getBySelector,
  queryBySelector
} from '@actiontech/shared/lib/testUtil/customQuery';
import { useLocation, BrowserRouter } from 'react-router-dom';
import { SQLAuditRecordListUrlParamsKey } from '../../SqlManagement/component/SQLEEIndex/index.data';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn()
}));

describe('sqle/SqlAudit/List', () => {
  const useLocationMock: jest.Mock = useLocation as jest.Mock;
  let sqlAuditRecordsSpy: jest.SpyInstance;
  let mockUseCurrentProjectSpy: jest.SpyInstance;
  beforeEach(() => {
    jest.useFakeTimers();
    instance.mockAllApi();
    sqlAuditRecordsSpy = sqlAuditRecord.getSQLAuditRecords();
    mockUseCurrentProjectSpy = mockUseCurrentProject();
    mockUseCurrentUser();
    useLocationMock.mockReturnValue({
      pathname: '/',
      search: '',
      hash: '',
      state: null
    });
  });

  beforeAll(() => {
    jest.useRealTimers();
    cleanup();
  });

  const customRender = () => {
    return (
      <BrowserRouter>
        <SqlAuditList />
      </BrowserRouter>
    );
  };

  it('render sql audit record table when request return data', async () => {
    const { baseElement } = renderWithReduxAndTheme(customRender());
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
      `/sqle/project/${mockProjectInfo.projectID}/sqlAudit/detail/${sqlAuditRecordMockData[0].sql_audit_record_id}`
    );
    expect(
      screen
        .getByText(sqlAuditRecordMockData[1].sql_audit_record_id!)
        .closest('a')
    ).toHaveAttribute(
      'href',
      `/sqle/project/${mockProjectInfo.projectID}/sqlAudit/detail/${sqlAuditRecordMockData[1].sql_audit_record_id}`
    );
  });

  it('should request list with url params', async () => {
    useLocationMock.mockReturnValue({
      pathname: '/',
      search: `?${SQLAuditRecordListUrlParamsKey.SQLAuditRecordID}=123456`,
      hash: '',
      state: null
    });
    renderWithReduxAndTheme(customRender());
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
    const { baseElement } = renderWithReduxAndTheme(customRender());
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText('SQL审核')).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
  });

  it('render table list when action filter', async () => {
    const { baseElement } = renderWithReduxAndTheme(customRender());
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
      filter_sql_audit_record_ids: ''
    });
  });

  it('render action when filter item show', async () => {
    const { baseElement } = renderWithReduxAndTheme(customRender());
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
    renderWithReduxAndTheme(customRender());
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText('创建审核')).toBeInTheDocument();
    cleanup();
    mockUseCurrentProjectSpy.mockClear();
    mockUseCurrentProjectSpy.mockImplementation(() => ({
      ...mockProjectInfo,
      projectArchive: true
    }));
    renderWithReduxAndTheme(customRender());
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
    renderWithReduxAndTheme(customRender());
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
});
