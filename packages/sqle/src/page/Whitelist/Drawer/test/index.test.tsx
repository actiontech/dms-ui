import { cleanup, act } from '@testing-library/react';
import WhitelistDrawer from '../index';
import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
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

describe('slqe/Whitelist/Drawer', () => {
  const dispatchSpy = jest.fn();
  beforeEach(() => {
    jest.useFakeTimers();
    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        whitelist: { modalStatus: { [ModalName.Add_Whitelist]: false } }
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
    superRender(<WhitelistDrawer />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'whitelist/initModalStatus',
      payload: {
        modalStatus: {
          [ModalName.Add_Whitelist]: false,
          [ModalName.Update_Whitelist]: false
        }
      }
    });
  });
});
