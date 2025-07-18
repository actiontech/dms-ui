import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import SqlOptimizationList from '.';
import { sqleSuperRender } from '../../../testUtils/superRender';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { mockUseDbServiceDriver } from '@actiontech/shared/lib/testUtil/mockHook/mockUseDbServiceDriver';
import sqlOptimization from '@actiontech/shared/lib/testUtil/mockApi/sqle/sqlOptimization';
import { sqlOptimizationRecordsMockData } from '@actiontech/shared/lib/testUtil/mockApi/sqle/sqlOptimization/data';
import {
  getAllBySelector,
  getBySelector
} from '@actiontech/shared/lib/testUtil/customQuery';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { useNavigate } from 'react-router-dom';
import instance from '@actiontech/shared/lib/testUtil/mockApi/sqle/instance';

jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn()
  };
});

describe('sqle/SqlOptimizationList', () => {
  let getOptimizationRecordsSpy: jest.SpyInstance;
  let getInstanceTipListSpy: jest.SpyInstance;
  const navigateSpy = jest.fn();

  beforeEach(() => {
    (useNavigate as jest.Mock).mockImplementation(() => navigateSpy);
    getOptimizationRecordsSpy = sqlOptimization.getOptimizationRecords();
    getInstanceTipListSpy = instance.getInstanceTipList();
    mockUseCurrentProject();
    mockUseCurrentUser();
    mockUseDbServiceDriver();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('render table data', async () => {
    const { baseElement } = sqleSuperRender(<SqlOptimizationList />);
    expect(getOptimizationRecordsSpy).toHaveBeenCalled();
    expect(getInstanceTipListSpy).toHaveBeenCalled();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
  });

  it('render create optimization button', async () => {
    sqleSuperRender(<SqlOptimizationList />);
    expect(getOptimizationRecordsSpy).toHaveBeenCalled();
    expect(screen.getByText('创建智能调优')).toBeInTheDocument();
    expect(screen.getByText('创建智能调优').closest('a')).toHaveAttribute(
      'href'
    );
    fireEvent.click(screen.getByText('创建智能调优'));
  });

  it('filter data with search', async () => {
    sqleSuperRender(<SqlOptimizationList />);
    expect(getOptimizationRecordsSpy).toHaveBeenCalled();
    const searchText = 'search text';
    const inputEle = getBySelector('#actiontech-table-search-input');
    fireEvent.change(inputEle, {
      target: { value: searchText }
    });

    await act(async () => {
      fireEvent.keyDown(inputEle, {
        key: 'Enter',
        code: 'Enter',
        keyCode: 13
      });
      await jest.advanceTimersByTime(300);
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getOptimizationRecordsSpy).toHaveBeenCalledWith({
      fuzzy_search: searchText,
      page_index: 1,
      page_size: 20,
      project_name: mockProjectInfo.projectName
    });
  });

  it('render click table row', async () => {
    sqleSuperRender(<SqlOptimizationList />);
    expect(getOptimizationRecordsSpy).toHaveBeenCalled();
    await act(async () => jest.advanceTimersByTime(3000));
    const tableRows = getAllBySelector(
      '.ant-table-content .ant-table-tbody .ant-table-row'
    );
    fireEvent.click(tableRows[0]);
    await act(async () => jest.advanceTimersByTime(100));
    expect(navigateSpy).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(
      `/sqle/project/${mockProjectInfo.projectID}/sql-optimization/overview/${sqlOptimizationRecordsMockData[0].optimization_id}`
    );
  });
});
