import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import SqlOptimizationOverview from '.';
import { sqleSuperRender } from '../../../testUtils/superRender';
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
    jest.clearAllMocks();
    cleanup();
  });

  it('render overview page', async () => {
    const { baseElement } = sqleSuperRender(<SqlOptimizationOverview />);
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
    const { baseElement } = sqleSuperRender(<SqlOptimizationOverview />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(getOptimizationRecordReqSpy).toHaveBeenCalledTimes(1);
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
    const { baseElement } = sqleSuperRender(<SqlOptimizationOverview />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(getOptimizationRecordReqSpy).toHaveBeenCalled();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getOptimizationSQLsSpy).toHaveBeenCalled();
    expect(screen.queryAllByText('优化详情')).toHaveLength(
      optimizationRecordSqlMockData.length
    );
    expect(
      screen.queryAllByText('优化详情')[0].closest('button')
    ).toHaveAttribute('disabled');
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
    const { baseElement } = sqleSuperRender(<SqlOptimizationOverview />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(getOptimizationRecordReqSpy).toHaveBeenCalled();
    expect(getOptimizationSQLsSpy).toHaveBeenCalled();
  });

  it('render return back to optimization list page', async () => {
    sqleSuperRender(<SqlOptimizationOverview />);
    expect(screen.getByText('返回智能调优列表')).toBeInTheDocument();
    fireEvent.click(screen.getByText('返回智能调优列表'));
  });

  it('render link to detail page', async () => {
    sqleSuperRender(<SqlOptimizationOverview />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getOptimizationRecordReqSpy).toHaveBeenCalled();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getOptimizationSQLsSpy).toHaveBeenCalled();

    expect(screen.queryAllByText('优化详情')).toHaveLength(
      optimizationRecordSqlMockData.length
    );

    fireEvent.click(screen.queryAllByText('优化详情')[0]);
    await act(async () => jest.advanceTimersByTime(100));
    expect(navigateSpy).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(
      `/sqle/project/${mockProjectInfo.projectID}/sql-optimization/detail/MySQL/${optimizationId}/${optimizationRecordSqlMockData[0]?.number}`
    );
  });
});
