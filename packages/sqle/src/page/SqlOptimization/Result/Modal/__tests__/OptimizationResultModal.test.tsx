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
import OptimizationResultModal from '../OptimizationResultModal';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
  useDispatch: jest.fn()
}));

describe('sqle/SqlOptimization/Result/Modal/OptimizationResultModal', () => {
  const mockDispatch = jest.fn();

  const defaultMockState = {
    sqlOptimization: {
      modalStatus: {},
      optimizationResultModal: {
        currentResultData: null
      }
    }
  };

  const mockStateWithOpenModal = {
    sqlOptimization: {
      modalStatus: {
        [ModalName.Sql_Optimization_Result_Modal]: true
      },
      optimizationResultModal: {
        currentResultData: optimizationDetailMockData.optimize?.steps?.[0] // 使用第一个优化步骤的数据
      }
    }
  };

  beforeEach(() => {
    mockUseCurrentProject();
    mockUseCurrentUser();
    (useDispatch as jest.Mock).mockImplementation(() => mockDispatch);
    jest.useFakeTimers();
    mockDispatch.mockClear();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('should render modal when closed', () => {
    (useSelector as jest.Mock).mockImplementation((selector) =>
      selector(defaultMockState)
    );

    const { baseElement } = superRender(<OptimizationResultModal />);

    expect(baseElement.querySelector('.ant-modal')).not.toBeInTheDocument();
  });

  it('should render modal when open with data', () => {
    (useSelector as jest.Mock).mockImplementation((selector) =>
      selector(mockStateWithOpenModal)
    );

    const { baseElement } = superRender(<OptimizationResultModal />);

    expect(screen.getByText('查看优化结果')).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
  });

  it('should render modal when open with data', () => {
    (useSelector as jest.Mock).mockImplementation((selector) =>
      selector(mockStateWithOpenModal)
    );

    superRender(<OptimizationResultModal />);

    fireEvent.click(getBySelector('.ant-modal-close-x'));

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'sqlOptimization/updateModalStatus',
      payload: {
        modalName: ModalName.Sql_Optimization_Result_Modal,
        status: false
      }
    });
  });
});
