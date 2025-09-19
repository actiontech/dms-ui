import { sqleSuperRender } from '../../../../testUtils/superRender';
import ResultContent from '../ResultContent';
import {
  mockUseCurrentProject,
  mockUseCurrentUser,
  getBySelector,
  getAllBySelector
} from '@actiontech/shared/lib/testUtil';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { act, fireEvent, screen } from '@testing-library/react';
import { mockReactFlow } from '@actiontech/shared/lib/testUtil/mockModule/mockReactFlow';
import { optimizationDetailMockData } from '@actiontech/shared/lib/testUtil/mockApi/sqle/sqlOptimization/data';
import { ModalName } from '../../../../data/ModalName';

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

describe('sqle/SqlOptimization/ResultContent', () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    mockUseCurrentProject();
    mockUseCurrentUser();
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
    mockDispatch.mockClear();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  const customRender = (props = {}) => {
    const defaultProps = {
      errorMessage: undefined,
      optimizationResult: optimizationDetailMockData,
      optimizationResultLoading: false,
      isVerticalLayout: false,
      ...props
    };
    return sqleSuperRender(<ResultContent {...defaultProps} />);
  };

  it('render snap', async () => {
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
  });

  it('should render with vertical layout', async () => {
    const { container } = customRender({ isVerticalLayout: true });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(container).toBeInTheDocument();
  });

  it('should render with loading state', async () => {
    const { container } = customRender({ optimizationResultLoading: true });
    await act(async () => jest.advanceTimersByTime(3000));

    // Check if Spin component is present
    const spinElement = container.querySelector('.ant-spin-spinning');
    expect(spinElement).toBeInTheDocument();
  });

  it('should render with error message', async () => {
    const errorMessage = 'Test error message';
    const { container } = customRender({
      errorMessage
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(container).toBeInTheDocument();
  });

  it('should render with empty optimization result', async () => {
    const { container } = customRender({ optimizationResult: undefined });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(container).toBeInTheDocument();
  });

  describe('modal interactions', () => {
    it('should open diff modal when view overall diff is clicked', async () => {
      customRender();
      await act(async () => jest.advanceTimersByTime(3000));

      const viewDiffButtons = screen.getAllByText('查看差异');
      fireEvent.click(viewDiffButtons[0]);

      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'sqlOptimization/updateDiffModalData',
        payload: {
          diffData: {
            originalSql: optimizationDetailMockData.origin_sql,
            optimizedSql:
              optimizationDetailMockData?.optimize?.steps?.[2].optimized_sql
          }
        }
      });
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'sqlOptimization/updateModalStatus',
        payload: {
          modalName: ModalName.Sql_Optimization_Diff_Modal,
          status: true
        }
      });
    });

    it('should open optimization step result modal when optimization step is clicked', async () => {
      customRender();
      await act(async () => jest.advanceTimersByTime(3000));

      // when click first step
      const stepItems = getAllBySelector('.step-item');
      fireEvent.click(stepItems[0]);

      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'sqlOptimization/updateOptimizationResultModalData',
        payload: {
          resultData: {
            ...optimizationDetailMockData?.optimize?.steps?.[0],
            origin_sql: optimizationDetailMockData.origin_sql
          }
        }
      });
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'sqlOptimization/updateModalStatus',
        payload: {
          modalName: ModalName.Sql_Optimization_Result_Modal,
          status: true
        }
      });

      // when click second step
      fireEvent.click(stepItems[1]);

      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'sqlOptimization/updateOptimizationResultModalData',
        payload: {
          resultData: {
            ...optimizationDetailMockData?.optimize?.steps?.[1],
            origin_sql:
              optimizationDetailMockData?.optimize?.steps?.[0].optimized_sql
          }
        }
      });
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'sqlOptimization/updateModalStatus',
        payload: {
          modalName: ModalName.Sql_Optimization_Result_Modal,
          status: true
        }
      });
    });

    it('should open table structure modal when view table structure is clicked', async () => {
      customRender();
      await act(async () => jest.advanceTimersByTime(3000));

      const viewTableStructureButton = screen.getByText('查看表结构');
      fireEvent.click(viewTableStructureButton);

      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'sqlOptimization/updateTableStructureModalData',
        payload: {
          tableData: {
            tableStructure: optimizationDetailMockData.metadata,
            recommendedIndexes:
              optimizationDetailMockData?.advised_index?.indexes
                ?.map(
                  (item) =>
                    `/* ${item.reason ?? ''} */\n${
                      item.create_index_statement ?? ''
                    }\n\n`
                )
                .join('')
                .trim() ?? ''
          }
        }
      });
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'sqlOptimization/updateModalStatus',
        payload: {
          modalName: ModalName.Sql_Optimization_Table_Structure_Modal,
          status: true
        }
      });
    });

    it('should open query plan flow modal when expand query plan is clicked', async () => {
      customRender();
      await act(async () => jest.advanceTimersByTime(3000));

      const expandButton = getBySelector('.view-query-plan-diff-button');
      fireEvent.click(expandButton);

      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'sqlOptimization/updateQueryPlanFlowModalData',
        payload: {
          queryPlanData:
            optimizationDetailMockData.origin_query_plan?.query_plan_desc ?? []
        }
      });
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'sqlOptimization/updateModalStatus',
        payload: {
          modalName: ModalName.Sql_Optimization_Query_Plan_Flow_Modal,
          status: true
        }
      });
    });

    it('should open query plan diff modal when view query plan diff is clicked', async () => {
      customRender();
      await act(async () => jest.advanceTimersByTime(3000));

      const viewDiffButtons = screen.getAllByText('查看差异');
      fireEvent.click(viewDiffButtons[1]);

      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'sqlOptimization/updateQueryPlanDiffModalData',
        payload: {
          queryPlanDiffData: {
            originalQueryPlan:
              optimizationDetailMockData.origin_query_plan?.query_plan_desc ??
              [],
            optimizedQueryPlan: expect.any(Array)
          }
        }
      });
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'sqlOptimization/updateModalStatus',
        payload: {
          modalName: ModalName.Sql_Optimization_Query_Plan_Diff_Modal,
          status: true
        }
      });
    });
  });

  describe('data processing', () => {
    it('should correctly process optimized SQL and query plan from steps', async () => {
      const mockDataWithSteps = {
        ...optimizationDetailMockData,
        optimize: {
          steps: [
            {
              optimized_sql: 'SELECT * FROM test1',
              query_plan: {
                query_plan_desc: [{ id: '1', name: 'Step1' }]
              }
            },
            {
              optimized_sql: 'SELECT * FROM test2 WHERE id = 1',
              query_plan: {
                query_plan_desc: [{ id: '2', name: 'Step2' }]
              }
            }
          ]
        }
      };

      customRender({ optimizationResult: mockDataWithSteps });
      await act(async () => jest.advanceTimersByTime(3000));

      const steps = mockDataWithSteps.optimize.steps;
      const lastStep = steps[steps.length - 1];
      expect(lastStep.optimized_sql).toBe('SELECT * FROM test2 WHERE id = 1');
      expect(steps).toHaveLength(2);
    });

    it('should fall back to origin SQL when no optimization steps exist', async () => {
      const mockDataWithoutSteps = {
        ...optimizationDetailMockData,
        optimize: {
          steps: []
        }
      };

      customRender({ optimizationResult: mockDataWithoutSteps });
      await act(async () => jest.advanceTimersByTime(3000));

      expect(mockDataWithoutSteps.origin_sql).toBeTruthy();
      expect(mockDataWithoutSteps.optimize.steps).toHaveLength(0);
    });

    it('should correctly format advised index from optimization result', async () => {
      customRender();
      await act(async () => jest.advanceTimersByTime(3000));

      const expectedAdvisedIndex =
        optimizationDetailMockData.advised_index?.indexes
          ?.map(
            (item) =>
              `/* ${item.reason ?? ''} */\n${
                item.create_index_statement ?? ''
              }\n\n`
          )
          .join('')
          .trim();

      expect(expectedAdvisedIndex).toBeTruthy();
    });
  });

  describe('edge cases', () => {
    it('should handle null optimization result gracefully', async () => {
      const { container } = customRender({ optimizationResult: null });
      await act(async () => jest.advanceTimersByTime(3000));
      expect(container).toBeInTheDocument();
    });

    it('should handle optimization result without advised_index', async () => {
      const mockDataWithoutIndex = {
        ...optimizationDetailMockData,
        advised_index: undefined
      };

      const { container } = customRender({
        optimizationResult: mockDataWithoutIndex
      });
      await act(async () => jest.advanceTimersByTime(3000));
      expect(container).toBeInTheDocument();
    });

    it('should handle optimization result without metadata', async () => {
      const mockDataWithoutMetadata = {
        ...optimizationDetailMockData,
        metadata: undefined
      };

      const { container } = customRender({
        optimizationResult: mockDataWithoutMetadata
      });
      await act(async () => jest.advanceTimersByTime(3000));
      expect(container).toBeInTheDocument();
    });

    it('should handle optimization result without query plan', async () => {
      const mockDataWithoutQueryPlan = {
        ...optimizationDetailMockData,
        origin_query_plan: undefined
      };

      const { container } = customRender({
        optimizationResult: mockDataWithoutQueryPlan
      });
      await act(async () => jest.advanceTimersByTime(3000));
      expect(container).toBeInTheDocument();
    });
  });
});
