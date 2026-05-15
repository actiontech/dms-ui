import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import { useDispatch } from 'react-redux';
import { cleanup } from '@testing-library/react';
import Modals from '../Modals';
import { ModalName } from '../../../data/ModalName';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useDispatch: jest.fn()
  };
});

describe('base/Member/Modals', () => {
  const dispatchSpy = jest.fn();
  beforeEach(() => {
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
  });

  afterEach(() => {
    cleanup();
  });

  it('should dispatch init action', () => {
    superRender(<Modals />);
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith({
      payload: {
        modalStatus: {
          [ModalName.DMS_Add_Member]: false,
          [ModalName.DMS_Update_Member]: false,
          [ModalName.DMS_Add_Member_Group]: false,
          [ModalName.DMS_Update_Member_Group]: false,
          [ModalName.DMS_Manage_Member_Group]: false
        }
      },
      type: 'member/initModalStatus'
    });
  });
});
