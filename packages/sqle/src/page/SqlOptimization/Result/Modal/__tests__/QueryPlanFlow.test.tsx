import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import {
  getBySelector,
  mockUseCurrentProject,
  mockUseCurrentUser
} from '@actiontech/shared/lib/testUtil';
import { useDispatch, useSelector } from 'react-redux';
import { fireEvent, screen } from '@testing-library/react';
import { optimizationDetailMockData } from '@actiontech/shared/lib/testUtil/mockApi/sqle/sqlOptimization/data';
import { ModalName } from '../../../../../data/ModalName';
import QueryPlanFlowModal from '../QueryPlanFlowModal';
import { mockReactFlow } from '@actiontech/shared/lib/testUtil/mockModule/mockReactFlow';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
  useDispatch: jest.fn()
}));

describe('sqle/SqlOptimization/Result/Modal/QueryPlanFlowModal', () => {
  const mockDispatch = jest.fn();

  const mockStateWithOpenModal = {
    sqlOptimization: {
      modalStatus: {
        [ModalName.Sql_Optimization_Query_Plan_Flow_Modal]: true
      },
      queryPlanFlowModal: {
        currentQueryPlanData:
          optimizationDetailMockData.optimize?.steps?.[0]?.query_plan
            ?.query_plan_desc || []
      }
    }
  };

  beforeEach(() => {
    mockUseCurrentProject();
    mockUseCurrentUser();
    (useDispatch as jest.Mock).mockImplementation(() => mockDispatch);
    jest.useFakeTimers();
    mockDispatch.mockClear();
    mockReactFlow();
    (useSelector as jest.Mock).mockImplementation((selector) =>
      selector(mockStateWithOpenModal)
    );
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('should render modal when open with data', () => {
    const { baseElement } = superRender(<QueryPlanFlowModal />);

    expect(screen.getByText('优化后的执行计划')).toBeInTheDocument();

    expect(baseElement).toMatchSnapshot();
  });

  it('should handle modal close functionality', () => {
    superRender(<QueryPlanFlowModal />);

    fireEvent.click(getBySelector('.ant-modal-close-x'));

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'sqlOptimization/updateModalStatus',
      payload: {
        modalName: ModalName.Sql_Optimization_Query_Plan_Flow_Modal,
        status: false
      }
    });
  });
});
