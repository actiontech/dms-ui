import { sqleSuperRender } from '../../../../testUtils/superRender';
import SqlOptimizationResult from '..';
import {
  mockUseCurrentProject,
  sqleMockApi,
  mockUseCurrentUser
} from '@actiontech/shared/lib/testUtil';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { act } from '@testing-library/react';
import { mockReactFlow } from '@actiontech/shared/lib/testUtil/mockModule/mockReactFlow';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
    useDispatch: jest.fn()
  };
});

jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useParams: jest.fn()
  };
});

describe('sqle/SqlOptimization/Result', () => {
  let getOptimizationSQLDetailSpy: jest.SpyInstance;
  const mockDispatch = jest.fn();

  beforeEach(() => {
    mockUseCurrentProject();
    mockUseCurrentUser();
    getOptimizationSQLDetailSpy =
      sqleMockApi.sqlOptimization.getOptimizationSQLDetail();
    (useParams as jest.Mock).mockImplementation(() => ({
      optimizationId: '123456'
    }));
    (useDispatch as jest.Mock).mockImplementation(() => mockDispatch);
    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        sqlOptimization: {
          modalStatus: {},
          submitLoading: false,
          diffModal: {
            currentDiffData: null
          },
          tableStructureModal: {
            currentTableData: null
          },
          optimizationResultModal: {
            currentResultData: null
          },
          queryPlanFlowModal: {
            currentQueryPlanData: null
          },
          queryPlanDiffModal: {
            currentQueryPlanDiffData: null
          }
        }
      })
    );
    jest.useFakeTimers();
    mockReactFlow();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('render snap', async () => {
    const { baseElement } = sqleSuperRender(<SqlOptimizationResult />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(getOptimizationSQLDetailSpy).toHaveBeenCalledTimes(1);
  });
});
