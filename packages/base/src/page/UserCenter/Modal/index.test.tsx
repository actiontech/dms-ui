import { renderWithReduxAndTheme } from '@actiontech/shared/lib/testUtil/customRender';
import { useDispatch } from 'react-redux';
import { cleanup } from '@testing-library/react';
import UserManageModal from '.';
import { ModalName } from '../../../data/ModalName';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useDispatch: jest.fn()
  };
});

describe('base/UserCenter/UserManageModal', () => {
  const dispatchSpy = jest.fn();
  beforeEach(() => {
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
  });

  afterEach(() => {
    cleanup();
  });

  it('should dispatch init action', () => {
    renderWithReduxAndTheme(<UserManageModal />);
    expect(dispatchSpy).toBeCalledTimes(1);
    expect(dispatchSpy).toBeCalledWith({
      payload: {
        modalStatus: {
          [ModalName.DMS_Add_User]: false,
          [ModalName.DMS_Update_User]: false,
          [ModalName.DMS_Add_Role]: false,
          [ModalName.DMS_Update_Role]: false
        }
      },
      type: 'userCenter/initModalStatus'
    });
  });
});
