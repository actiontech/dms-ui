import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import SqlOptimizationList from '.';
import { superRender } from '../../../testUtils/customRender';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { mockUseDbServiceDriver } from '@actiontech/shared/lib/testUtil/mockHook/mockUseDbServiceDriver';
import sqlOptimization from '../../../testUtils/mockApi/sqlOptimization';
import { sqlOptimizationRecordsMockData } from '../../../testUtils/mockApi/sqlOptimization/data';
import {
  getAllBySelector,
  getBySelector
} from '@actiontech/shared/lib/testUtil/customQuery';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { useNavigate } from 'react-router-dom';

jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn()
  };
});

describe('sqle/SqlOptimizationList', () => {
  let getOptimizationRecordsSpy: jest.SpyInstance;
  const navigateSpy = jest.fn();

  beforeEach(() => {
    (useNavigate as jest.Mock).mockImplementation(() => navigateSpy);
    getOptimizationRecordsSpy = sqlOptimization.getOptimizationRecords();
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
    const { baseElement } = superRender(<SqlOptimizationList />);
    expect(getOptimizationRecordsSpy).toHaveBeenCalled();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
  });

  it('render create optimization button', async () => {
    superRender(<SqlOptimizationList />);
    expect(getOptimizationRecordsSpy).toHaveBeenCalled();
    expect(screen.getByText('创建优化')).toBeInTheDocument();
    expect(screen.getByText('创建优化').closest('a')).toHaveAttribute('href');
    fireEvent.click(screen.getByText('创建优化'));
  });

  it('filter data with search', async () => {
    superRender(<SqlOptimizationList />);
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
    superRender(<SqlOptimizationList />);
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
