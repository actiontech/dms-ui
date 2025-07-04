import { cleanup, screen, act, fireEvent } from '@testing-library/react';
import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import OperationRecordList from '.';
import operationRecord from '@actiontech/shared/lib/testUtil/mockApi/sqle/operationRecord';
import { operationRecordListMockData } from '@actiontech/shared/lib/testUtil/mockApi/sqle/operationRecord/data';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { createSpyErrorResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import {
  getAllBySelector,
  getBySelector
} from '@actiontech/shared/lib/testUtil/customQuery';

describe('sqle/OperationRecord/List', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    operationRecord.mockAllApi();
    mockUseCurrentProject();
  });

  beforeAll(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('render operation record table when request return data', async () => {
    const operationRecordListSpy = operationRecord.getOperationActionList();
    const actionSpy = operationRecord.getOperationActionList();
    const typeNameSpy = operationRecord.getOperationTypeNameList();
    const { baseElement } = superRender(<OperationRecordList />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(operationRecordListSpy).toHaveBeenCalledTimes(1);
    expect(actionSpy).toHaveBeenCalledTimes(1);
    expect(typeNameSpy).toHaveBeenCalledTimes(1);
    expect(
      screen.getByText(`共 ${operationRecordListMockData.length} 条数据`)
    ).toBeInTheDocument();
  });

  it('render table when request return error', async () => {
    const operationRecordListSpy = operationRecord.getOperationActionList();
    operationRecordListSpy.mockImplementationOnce(() =>
      createSpyErrorResponse({ message: 'error info' })
    );
    const { baseElement } = superRender(<OperationRecordList />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText('SQLE操作记录')).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
  });

  it('render table list when action filter', async () => {
    const operationRecordListSpy = operationRecord.getOperationRecordList();
    const { baseElement } = superRender(<OperationRecordList />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(operationRecordListSpy).toHaveBeenCalledTimes(1);
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
    expect(operationRecordListSpy).toHaveBeenCalled();
    expect(operationRecordListSpy).toHaveBeenCalledWith({
      filter_operate_project_name: mockProjectInfo.projectName,
      fuzzy_search_operate_user_name: 'test',
      page_index: 1,
      page_size: 20
    });
  });

  it('render action when filter item show', async () => {
    const operationRecordListSpy = operationRecord.getOperationActionList();
    const { baseElement } = superRender(<OperationRecordList />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(operationRecordListSpy).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByText('筛选'));
    await act(async () => jest.advanceTimersByTime(300));
    const filterItems = getAllBySelector(
      '.actiontech-table-filter-container-namespace .ant-space-item',
      baseElement
    );
    expect(filterItems.length).toBe(3);
    expect(baseElement).toMatchSnapshot();
  });

  it('should export data file when click export button', async () => {
    const exportListSpy = operationRecord.exportOperationRecordList();
    superRender(<OperationRecordList />);
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(screen.getByText('导出'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(screen.getByText('正在导出操作记录列表...')).toBeInTheDocument();
    expect(exportListSpy).toHaveBeenCalledTimes(1);
    expect(exportListSpy).toHaveBeenCalledWith(
      {
        filter_operate_project_name: mockProjectInfo.projectName,
        fuzzy_search_operate_user_name: ''
      },
      {
        responseType: 'blob'
      }
    );
    await act(async () => jest.advanceTimersByTime(3300));
    expect(screen.getByText('操作记录列表导出成功')).toBeInTheDocument();
  });
});
