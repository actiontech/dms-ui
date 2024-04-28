import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import SqlOptimizationOverview from '.';
import { superRender } from '../../../testUtils/customRender';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { mockUseDbServiceDriver } from '@actiontech/shared/lib/testUtil/mockHook/mockUseDbServiceDriver';
import sqlOptimization from '../../../testUtils/mockApi/sqlOptimization';
import {
  optimizationRecordSqlMockData,
  optimizationRecordMockData
} from '../../../testUtils/mockApi/sqlOptimization/data';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { useNavigate, useParams } from 'react-router-dom';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import { SqlOptimizationStatusEnum } from '../index.data';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';

jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
    useParams: jest.fn()
  };
});

describe('sqle/SqlOptimization/Overview', () => {
  let getOptimizationRecordReqSpy: jest.SpyInstance;
  let getOptimizationSQLsSpy: jest.SpyInstance;
  const useParamsMock: jest.Mock = useParams as jest.Mock;
  const navigateSpy = jest.fn();
  const optimizationId = '1234567';

  beforeEach(() => {
    (useNavigate as jest.Mock).mockImplementation(() => navigateSpy);
    useParamsMock.mockReturnValue({ optimizationId });
    getOptimizationRecordReqSpy = sqlOptimization.getOptimizationRecordReq();
    getOptimizationSQLsSpy = sqlOptimization.getOptimizationSQLs();
    mockUseCurrentProject();
    mockUseCurrentUser();
    mockUseDbServiceDriver();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('render overview page', async () => {
    const { baseElement } = superRender(<SqlOptimizationOverview />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(getOptimizationRecordReqSpy).toHaveBeenCalled();
    expect(getOptimizationSQLsSpy).toHaveBeenCalled();
  });

  it('render overview page when status is optimizing', async () => {
    getOptimizationRecordReqSpy.mockClear();
    getOptimizationRecordReqSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: {
          ...optimizationRecordMockData,
          basic_summary: {},
          index_recommendations: [],
          status: SqlOptimizationStatusEnum.optimizing
        }
      })
    );
    const { baseElement } = superRender(<SqlOptimizationOverview />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(getOptimizationRecordReqSpy).toHaveBeenCalledTimes(1);
    expect(getOptimizationSQLsSpy).toHaveBeenCalledTimes(1);
    expect(getBySelector('.refresh-icon')).toBeInTheDocument();
    fireEvent.click(getBySelector('.refresh-icon'));
    expect(getOptimizationRecordReqSpy).toHaveBeenCalledTimes(2);
    expect(getOptimizationSQLsSpy).toHaveBeenCalledTimes(2);
  });

  it('render overview page when status is failed', async () => {
    getOptimizationRecordReqSpy.mockClear();
    getOptimizationRecordReqSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: {
          ...optimizationRecordMockData,
          status: SqlOptimizationStatusEnum.failed
        }
      })
    );
    const { baseElement } = superRender(<SqlOptimizationOverview />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(getOptimizationRecordReqSpy).toHaveBeenCalled();
    expect(getOptimizationSQLsSpy).toHaveBeenCalled();
  });

  it('render overview page when index_recommendations is empty list', async () => {
    getOptimizationRecordReqSpy.mockClear();
    getOptimizationRecordReqSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: {
          ...optimizationRecordMockData,
          index_recommendations: []
        }
      })
    );
    const { baseElement } = superRender(<SqlOptimizationOverview />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(getOptimizationRecordReqSpy).toHaveBeenCalled();
    expect(getOptimizationSQLsSpy).toHaveBeenCalled();
  });

  it('render return back to optimization list page', async () => {
    superRender(<SqlOptimizationOverview />);
    expect(screen.getByText('返回智能调优列表')).toBeInTheDocument();
    fireEvent.click(screen.getByText('返回智能调优列表'));
  });

  it('render link to detail page', async () => {
    superRender(<SqlOptimizationOverview />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getOptimizationRecordReqSpy).toHaveBeenCalled();
    expect(getOptimizationSQLsSpy).toHaveBeenCalled();

    expect(screen.queryAllByText('优化详情')).toHaveLength(
      optimizationRecordSqlMockData.length
    );

    fireEvent.click(screen.queryAllByText('优化详情')[0]);
    await act(async () => jest.advanceTimersByTime(100));
    expect(navigateSpy).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(
      `/sqle/project/${mockProjectInfo.projectID}/sql-optimization/detail/${optimizationId}/${optimizationRecordSqlMockData[0]?.number}`
    );
  });
});
