import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import {
  getBySelector,
  mockUseCurrentProject,
  mockUseCurrentUser
} from '@actiontech/shared/lib/testUtil';
import { useDispatch, useSelector } from 'react-redux';
import { fireEvent, screen } from '@testing-library/react';
import { ModalName } from '../../../../../data/ModalName';
import SqlDiffModal from '../SqlDiffModal';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
  useDispatch: jest.fn()
}));

describe('sqle/SqlOptimization/Result/Modal/SqlDiffModal', () => {
  const mockDispatch = jest.fn();

  const mockStateWithOpenModal = {
    sqlOptimization: {
      modalStatus: {
        [ModalName.Sql_Optimization_Diff_Modal]: true
      },
      diffModal: {
        currentDiffData: {
          originalSql: 'SELECT * FROM users',
          optimizedSql: 'SELECT * FROM users WHERE active = 1'
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
    (useSelector as jest.Mock).mockImplementation((selector) =>
      selector(mockStateWithOpenModal)
    );
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('should render modal when open with data', () => {
    const { baseElement } = superRender(<SqlDiffModal />);

    expect(screen.getByText('比较 SQL 优化前后的差异')).toBeInTheDocument();

    expect(baseElement).toMatchSnapshot();
  });

  it('should handle modal close functionality', () => {
    superRender(<SqlDiffModal />);

    fireEvent.click(getBySelector('.ant-modal-close-x'));

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'sqlOptimization/updateModalStatus',
      payload: {
        modalName: ModalName.Sql_Optimization_Diff_Modal,
        status: false
      }
    });
  });
});
