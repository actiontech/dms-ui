import { useDispatch } from 'react-redux';
import { act, cleanup } from '@testing-library/react';
import { diagnosisSuperRender } from '../../../../../../testUtils/superRender';
import { ModalName } from '../../../../../../data/ModalName';
import UserModal from './index';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useDispatch: jest.fn()
  };
});

describe('diagnosis/test user list modal', () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    jest.useFakeTimers();
    (useDispatch as jest.Mock).mockImplementation(() => mockDispatch);
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
    mockDispatch.mockClear();
    cleanup();
  });

  it('init user list modal status data', async () => {
    const { container } = diagnosisSuperRender(<UserModal />, undefined, {
      initStore: {
        userManagement: {
          modalStatus: {}
        }
      }
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(container).toMatchInlineSnapshot('<div />');
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith({
      payload: {
        modalStatus: {
          [ModalName.Add_User]: false,
          [ModalName.Update_User]: false
        }
      },
      type: 'userManagement/initModalStatus'
    });
  });
});
