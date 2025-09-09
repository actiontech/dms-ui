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
import QueryPlanDiffModal from '../QueryPlanDiffModal';
import { mockReactFlow } from '@actiontech/shared/lib/testUtil/mockModule/mockReactFlow';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
  useDispatch: jest.fn()
}));

describe('sqle/SqlOptimization/Result/Modal/QueryPlanDiffModal', () => {
  const mockDispatch = jest.fn();

  const mockStateWithOpenModal = {
    sqlOptimization: {
      modalStatus: {
        [ModalName.Sql_Optimization_Query_Plan_Diff_Modal]: true
      },
      queryPlanDiffModal: {
        currentQueryPlanDiffData: {
          originalQueryPlan:
            optimizationDetailMockData.origin_query_plan?.query_plan_desc || [],
          optimizedQueryPlan:
            optimizationDetailMockData.optimize?.steps?.[0]?.query_plan
              ?.query_plan_desc || []
        }
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
    const { baseElement } = superRender(<QueryPlanDiffModal />);

    expect(screen.getByText('比较执行计划优化前后的差异')).toBeInTheDocument();

    expect(screen.getByText('原执行计划')).toBeInTheDocument();

    expect(screen.getByText('最终优化后')).toBeInTheDocument();

    const planSections = document.querySelectorAll('.plan-section');
    expect(planSections).toHaveLength(2);

    expect(baseElement).toMatchSnapshot();
  });

  it('should handle fullscreen functionality for original plan', () => {
    superRender(<QueryPlanDiffModal />);

    const originalFullscreenBtn = screen.getAllByTitle('全屏显示')[0];
    fireEvent.click(originalFullscreenBtn);

    const planSections = document.querySelectorAll('.plan-section');
    const optimizedSection = planSections[1];
    expect(optimizedSection).toHaveStyle('display: none');

    expect(screen.getByTitle('退出全屏')).toBeInTheDocument();
  });

  it('should exit fullscreen when clicking exit button', () => {
    superRender(<QueryPlanDiffModal />);

    const fullscreenBtn = screen.getAllByTitle('全屏显示')[0];
    fireEvent.click(fullscreenBtn);

    const exitFullscreenBtn = screen.getByTitle('退出全屏');
    fireEvent.click(exitFullscreenBtn);

    const planSections = document.querySelectorAll('.plan-section');
    const originalSection = planSections[0];
    const optimizedSection = planSections[1];

    expect(originalSection).not.toHaveStyle('display: none');
    expect(optimizedSection).not.toHaveStyle('display: none');
  });

  it('should handle modal close functionality', () => {
    superRender(<QueryPlanDiffModal />);

    fireEvent.click(getBySelector('.ant-modal-close-x'));

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'sqlOptimization/updateModalStatus',
      payload: {
        modalName: ModalName.Sql_Optimization_Query_Plan_Diff_Modal,
        status: false
      }
    });
  });
});
