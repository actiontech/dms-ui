import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import { useDispatch } from 'react-redux';
import { cleanup } from '@testing-library/react';
import UserManageDrawer from '.';
import { ModalName } from '../../../data/ModalName';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useDispatch: jest.fn()
  };
});

describe('base/UserCenter/UserManageDrawer', () => {
  const dispatchSpy = jest.fn();
  beforeEach(() => {
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
  });

  afterEach(() => {
    cleanup();
  });

  it('should dispatch init action', () => {
    superRender(<UserManageDrawer />);
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith({
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
