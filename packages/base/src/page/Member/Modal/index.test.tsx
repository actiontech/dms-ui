import { renderWithReduxAndTheme } from '@actiontech/shared/lib/testUtil/customRender';
import { useDispatch } from 'react-redux';
import { cleanup } from '@testing-library/react';
import MemberModal from '.';
import { ModalName } from '../../../data/ModalName';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useDispatch: jest.fn()
  };
});

describe('base/Member/Modal', () => {
  const dispatchSpy = jest.fn();
  beforeEach(() => {
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
  });

  afterEach(() => {
    cleanup();
  });

  it('should dispatch init action', () => {
    renderWithReduxAndTheme(<MemberModal />);
    expect(dispatchSpy).toBeCalledTimes(1);
    expect(dispatchSpy).toBeCalledWith({
      payload: {
        modalStatus: {
          [ModalName.DMS_Add_Member]: false,
          [ModalName.DMS_Update_Member]: false,
          [ModalName.DMS_Add_Member_Group]: false,
          [ModalName.DMS_Update_Member_Group]: false
        }
      },
      type: 'member/initModalStatus'
    });
  });
});
