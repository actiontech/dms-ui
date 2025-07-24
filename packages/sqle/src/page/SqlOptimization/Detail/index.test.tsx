import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import SqlOptimizationOverview from '.';
import { sqleSuperRender } from '../../../testUtils/superRender';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import sqlOptimization from '@actiontech/shared/lib/testUtil/mockApi/sqle/sqlOptimization';
import { optimizationDetailMockData } from '@actiontech/shared/lib/testUtil/mockApi/sqle/sqlOptimization/data';
import { useParams } from 'react-router-dom';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';

jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useParams: jest.fn()
  };
});

describe('sqle/SqlOptimization/Detail', () => {
  let getOptimizationReqSpy: jest.SpyInstance;
  const useParamsMock: jest.Mock = useParams as jest.Mock;
  const optimizationId = '1234567';
  const paramNumber = '1';

  beforeEach(() => {
    useParamsMock.mockReturnValue({
      optimizationId,
      number: paramNumber,
      dbType: 'MySQL'
    });
    getOptimizationReqSpy = sqlOptimization.getOptimizationReq();
    mockUseCurrentProject();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('render detail page', async () => {
    const { baseElement } = sqleSuperRender(<SqlOptimizationOverview />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(getOptimizationReqSpy).toHaveBeenCalled();
  });

  it('render detail page when params empty', async () => {
    getOptimizationReqSpy.mockClear();
    getOptimizationReqSpy.mockImplementation(() =>
      createSpySuccessResponse({
        ...optimizationDetailMockData,
        index_recommendations: [],
        triggered_rule: [],
        explain_validation_details: {}
      })
    );
    const { baseElement } = sqleSuperRender(<SqlOptimizationOverview />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(getOptimizationReqSpy).toHaveBeenCalled();
  });

  it('render detail page when optimized sql is empty', async () => {
    getOptimizationReqSpy.mockClear();
    getOptimizationReqSpy.mockImplementation(() =>
      createSpySuccessResponse({
        ...optimizationDetailMockData,
        optimized_sql: ''
      })
    );
    const { baseElement } = sqleSuperRender(<SqlOptimizationOverview />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(getOptimizationReqSpy).toHaveBeenCalled();
  });

  it('render link to overview page', async () => {
    sqleSuperRender(<SqlOptimizationOverview />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getOptimizationReqSpy).toHaveBeenCalled();

    expect(screen.getByText('返回性能优化概览')).toBeInTheDocument();
    fireEvent.click(screen.getByText('返回性能优化概览'));
  });
});
