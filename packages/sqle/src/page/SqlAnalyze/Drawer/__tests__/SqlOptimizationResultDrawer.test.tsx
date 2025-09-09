import { fireEvent, screen } from '@testing-library/react';
import { useDispatch, useSelector } from 'react-redux';
import SqlOptimizationResultDrawer from '../SqlOptimizationResultDrawer';
import {
  getBySelector,
  superRender,
  mockUseCurrentProject,
  mockUseCurrentUser
} from '@actiontech/shared/lib/testUtil';
import { ModalName } from '../../../../data/ModalName';
import {
  updateSqlAnalyzeModalStatus,
  updateResultDrawerData
} from '../../../../store/sqlAnalyze';
import useOptimizationResult from '../../../SqlOptimization/Result/hooks/useOptimizationResult';
import { OptimizationSQLDetailStatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { OptimizationResultStatus } from '../../../SqlOptimization/Result/index.type';
import { mockReactFlow } from '@actiontech/shared/lib/testUtil/mockModule/mockReactFlow';
import { optimizationDetailMockData } from '@actiontech/shared/lib/testUtil/mockApi/sqle/sqlOptimization/data';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
  useDispatch: jest.fn()
}));

jest.mock('../../../SqlOptimization/Result/hooks/useOptimizationResult');

describe('SqlOptimizationResultDrawer', () => {
  const mockDispatch = jest.fn();
  const mockUseOptimizationResult =
    useOptimizationResult as jest.MockedFunction<typeof useOptimizationResult>;

  const defaultOptimizationResult = {
    optimizationResultStatus: OptimizationResultStatus.RESOLVED,
    errorMessage: undefined,
    optimizationResult: optimizationDetailMockData,
    optimizationResultLoading: false,
    getOptimizationResult: jest.fn(),
    cancelOptimizationRequestPolling: jest.fn()
  };

  beforeEach(() => {
    mockUseCurrentProject();
    mockUseCurrentUser();
    jest.useFakeTimers({ legacyFakeTimers: true });

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
        },
        sqlAnalyze: {
          modalStatus: {
            [ModalName.Sql_Optimization_Result_Drawer]: true
          },
          resultDrawer: {
            currentResultDrawerData: {
              optimizationId: 'test-optimization-id'
            }
          }
        }
      })
    );
    mockUseOptimizationResult.mockReturnValue(defaultOptimizationResult);
    mockReactFlow();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  it('should render correctly when drawer is open with finished optimization', () => {
    const { baseElement } = superRender(<SqlOptimizationResultDrawer />);

    expect(screen.getByText('SQL调优结果详情')).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
  });

  it('should render loading state when optimization is in progress', () => {
    mockUseOptimizationResult.mockReturnValue({
      ...defaultOptimizationResult,
      optimizationResult: {
        status: OptimizationSQLDetailStatusEnum.optimizing
      }
    });

    const { baseElement } = superRender(<SqlOptimizationResultDrawer />);

    expect(
      screen.getByText('优化进行中，预计5-10分钟后完成。感谢您的耐心等待。')
    ).toBeInTheDocument();
    expect(
      screen.getByText('也可进入 快捷诊断-SQL调优 页面追踪进度')
    ).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
  });

  it('should render error state when optimization failed', () => {
    mockUseOptimizationResult.mockReturnValue({
      ...defaultOptimizationResult,
      optimizationResult: {
        status: OptimizationSQLDetailStatusEnum.failed,
        status_detail: '优化失败的详细信息'
      }
    });

    const { baseElement } = superRender(<SqlOptimizationResultDrawer />);

    expect(screen.getByText('优化失败的详细信息')).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
  });

  it('should dispatch close actions when drawer is closed', () => {
    superRender(<SqlOptimizationResultDrawer />);

    fireEvent.click(getBySelector('.closed-icon-custom'));

    expect(mockDispatch).toHaveBeenCalledWith(
      updateSqlAnalyzeModalStatus({
        modalName: ModalName.Sql_Optimization_Result_Drawer,
        status: false
      })
    );

    expect(mockDispatch).toHaveBeenCalledWith(
      updateResultDrawerData({
        resultDrawerData: null
      })
    );

    expect(
      defaultOptimizationResult.cancelOptimizationRequestPolling
    ).toHaveBeenCalled();
  });

  it('should call getOptimizationResult when drawer opens with optimization id', () => {
    mockUseOptimizationResult.mockReturnValue({
      ...defaultOptimizationResult,
      optimizationResult: undefined
    });

    superRender(<SqlOptimizationResultDrawer />);

    expect(
      defaultOptimizationResult.getOptimizationResult
    ).toHaveBeenCalledWith('test-optimization-id');
  });

  it('should not call getOptimizationResult when optimization is finished', () => {
    const getOptimizationResultSpy = jest.fn();
    mockUseOptimizationResult.mockReturnValue({
      ...defaultOptimizationResult,
      getOptimizationResult: getOptimizationResultSpy,
      optimizationResult: {
        status: OptimizationSQLDetailStatusEnum.finish
      }
    });

    superRender(<SqlOptimizationResultDrawer />);

    expect(getOptimizationResultSpy).not.toHaveBeenCalled();
  });
});
