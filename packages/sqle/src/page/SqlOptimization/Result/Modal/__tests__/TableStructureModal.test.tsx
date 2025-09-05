import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import {
  getBySelector,
  mockUseCurrentProject,
  mockUseCurrentUser
} from '@actiontech/shared/lib/testUtil';
import { useDispatch, useSelector } from 'react-redux';
import { fireEvent, screen } from '@testing-library/react';
import { ModalName } from '../../../../../data/ModalName';
import TableStructureModal from '../TableStructureModal';
import { optimizationDetailMockData } from '@actiontech/shared/lib/testUtil/mockApi/sqle/sqlOptimization/data';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
  useDispatch: jest.fn()
}));

describe('sqle/SqlOptimization/Result/Modal/TableStructureModal', () => {
  const mockDispatch = jest.fn();

  const mockStateWithOpenModal = {
    sqlOptimization: {
      modalStatus: {
        [ModalName.Sql_Optimization_Table_Structure_Modal]: true
      },
      tableStructureModal: {
        currentTableData: {
          tableStructure: optimizationDetailMockData.metadata,
          recommendedIndexes:
            'CREATE INDEX idx_students_create_at ON students(create_at);'
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
    const { baseElement } = superRender(<TableStructureModal />);

    expect(screen.getByText('查看表结构及最佳索引')).toBeInTheDocument();

    expect(baseElement).toMatchSnapshot();
  });

  it('should handle modal close functionality', () => {
    superRender(<TableStructureModal />);

    fireEvent.click(getBySelector('.ant-modal-close-x'));

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'sqlOptimization/updateModalStatus',
      payload: {
        modalName: ModalName.Sql_Optimization_Table_Structure_Modal,
        status: false
      }
    });
  });
});
