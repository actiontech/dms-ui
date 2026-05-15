import { sqleSuperRender } from '../../../../../testUtils/superRender';
import SqlOptimizationModals from '../index';
import {
  mockUseCurrentProject,
  mockUseCurrentUser
} from '@actiontech/shared/lib/testUtil';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { ModalName } from '../../../../../data/ModalName';

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

describe('sqle/SqlOptimization/Result/SqlOptimizationModals', () => {
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
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('render snap', async () => {
    sqleSuperRender(<SqlOptimizationModals />);
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'sqlOptimization/initModalStatus',
      payload: {
        modalStatus: {
          [ModalName.Sql_Optimization_Diff_Modal]: false,
          [ModalName.Sql_Optimization_Table_Structure_Modal]: false,
          [ModalName.Sql_Optimization_Result_Modal]: false,
          [ModalName.Sql_Optimization_Query_Plan_Flow_Modal]: false,
          [ModalName.Sql_Optimization_Query_Plan_Diff_Modal]: false
        }
      }
    });
  });
});
