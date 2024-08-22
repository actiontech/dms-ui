import { useDispatch, useSelector } from 'react-redux';
import { act, cleanup } from '@testing-library/react';
import { superRender } from '../../../../../testUtils/customRender';
import { ModalName } from '../../../../../data/ModalName';
import SqlManagementModal from './index';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
    useDispatch: jest.fn()
  };
});

describe('test init sql manage modal', () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    mockUseCurrentUser();
    jest.useFakeTimers();
    (useDispatch as jest.Mock).mockImplementation(() => mockDispatch);
    (useSelector as jest.Mock).mockImplementation((selector) => {
      return selector({
        sqlManagement: {
          modalStatus: {}
        },
        whitelist: { modalStatus: { [ModalName.Add_Whitelist]: false } },
        sqlManagementException: {
          modalStatus: { [ModalName.Create_Sql_Management_Exception]: false }
        }
      });
    });
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
    mockDispatch.mockClear();
    cleanup();
  });

  it('init modal status data', async () => {
    const { container } = superRender(<SqlManagementModal />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(container).toMatchInlineSnapshot('<div />');
    expect(mockDispatch).toHaveBeenCalledTimes(3);
    expect(mockDispatch).toHaveBeenCalledWith({
      payload: {
        modalStatus: {
          [ModalName.Assignment_Member_Single]: false,
          [ModalName.Assignment_Member_Batch]: false,
          [ModalName.Change_Status_Single]: false,
          [ModalName.View_Audit_Result_Drawer]: false
        }
      },
      type: 'sqlManagement/initModalStatus'
    });
  });
});
