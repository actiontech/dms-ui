import { cleanup, act } from '@testing-library/react';
import SqlManagementExceptionModal from '../index';
import { superRender } from '@actiontech/shared/lib/testUtil/customRender';
import { useDispatch, useSelector } from 'react-redux';
import { ModalName } from '../../../../data/ModalName';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
    useDispatch: jest.fn()
  };
});

describe('slqe/SqlManagementException/Modal', () => {
  const dispatchSpy = jest.fn();
  beforeEach(() => {
    jest.useFakeTimers();
    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        sqlManagementException: { modalStatus: {} }
      })
    );
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
    mockUseCurrentProject();
    mockUseCurrentUser();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  test('should dispatch init modal status action', async () => {
    superRender(<SqlManagementExceptionModal />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'sqlManagementException/initModalStatus',
      payload: {
        modalStatus: {
          [ModalName.Create_Sql_Management_Exception]: false,
          [ModalName.Update_Sql_Management_Exception]: false
        }
      }
    });
  });
});
