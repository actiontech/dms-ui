import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import SqlOptimizationList from '.';
import { sqleSuperRender } from '../../../testUtils/superRender';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { mockUseDbServiceDriver } from '@actiontech/shared/lib/testUtil/mockHook/mockUseDbServiceDriver';
import sqlOptimization from '@actiontech/shared/lib/testUtil/mockApi/sqle/sqlOptimization';
import { sqlOptimizationRecordsMockData } from '@actiontech/shared/lib/testUtil/mockApi/sqle/sqlOptimization/data';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { useNavigate } from 'react-router-dom';
import instance from '@actiontech/shared/lib/testUtil/mockApi/sqle/instance';
import eventEmitter from '../../../utils/EventEmitter';
import EmitterKey from '../../../data/EmitterKey';
import {
  createSpyErrorResponse,
  createSpySuccessResponse
} from '@actiontech/shared/lib/testUtil';

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
    fireEvent.click(screen.getAllByText('查 看')[0]);
    await act(async () => jest.advanceTimersByTime(100));
    expect(navigateSpy).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(
      `/sqle/project/${mockProjectInfo.projectID}/sql-audit/optimization-result/${sqlOptimizationRecordsMockData[0].optimization_id}`
    );
  });

  it('should refresh table data ', async () => {
    sqleSuperRender(<SqlOptimizationList />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getOptimizationRecordsSpy).toHaveBeenCalledTimes(1);

    act(() => {
      eventEmitter.emit(EmitterKey.Refresh_Sql_Optimization_List);
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getOptimizationRecordsSpy).toHaveBeenCalledTimes(2);
  });

  it('should polling request every 5 seconds with auto refresh enabled', async () => {
    sqleSuperRender(<SqlOptimizationList />);

    await act(async () => jest.advanceTimersByTime(3000));
    expect(getOptimizationRecordsSpy).toHaveBeenCalledTimes(1);

    await act(async () => jest.advanceTimersByTime(5000));
    expect(getOptimizationRecordsSpy).toHaveBeenCalledTimes(2);
  });

  it('should cancel polling when auto refresh button is clicked to disable', async () => {
    sqleSuperRender(<SqlOptimizationList />);

    await act(async () => jest.advanceTimersByTime(3000));
    expect(getOptimizationRecordsSpy).toHaveBeenCalledTimes(1);

    await act(async () => jest.advanceTimersByTime(5000));
    expect(getOptimizationRecordsSpy).toHaveBeenCalledTimes(2);

    const autoRefreshButton = screen.getByText('自动刷新');
    await act(async () => {
      fireEvent.click(autoRefreshButton);
    });

    await act(async () => jest.advanceTimersByTime(10000));
    expect(getOptimizationRecordsSpy).toHaveBeenCalledTimes(2);
  });

  it('should re-enable polling when auto refresh button is clicked again', async () => {
    sqleSuperRender(<SqlOptimizationList />);

    await act(async () => jest.advanceTimersByTime(3000));
    expect(getOptimizationRecordsSpy).toHaveBeenCalledTimes(1);

    const autoRefreshButton = screen.getByText('自动刷新');
    await act(async () => {
      fireEvent.click(autoRefreshButton);
    });

    await act(async () => jest.advanceTimersByTime(5000));
    expect(getOptimizationRecordsSpy).toHaveBeenCalledTimes(1);

    await act(async () => {
      fireEvent.click(autoRefreshButton);
    });

    await act(async () => jest.advanceTimersByTime(5000));
    expect(getOptimizationRecordsSpy).toHaveBeenCalledTimes(2);
  });

  it('should cancel polling when API request fails', async () => {
    getOptimizationRecordsSpy
      .mockImplementationOnce(() =>
        createSpySuccessResponse({
          data: sqlOptimizationRecordsMockData,
          total_nums: sqlOptimizationRecordsMockData.length
        })
      )
      .mockImplementationOnce(() =>
        createSpyErrorResponse({
          data: null
        })
      );

    sqleSuperRender(<SqlOptimizationList />);

    await act(async () => jest.advanceTimersByTime(3000));
    expect(getOptimizationRecordsSpy).toHaveBeenCalledTimes(1);

    await act(async () => jest.advanceTimersByTime(5000));
    expect(getOptimizationRecordsSpy).toHaveBeenCalledTimes(2);

    await act(async () => jest.advanceTimersByTime(10000));
    expect(getOptimizationRecordsSpy).toHaveBeenCalledTimes(2);
  });
});
