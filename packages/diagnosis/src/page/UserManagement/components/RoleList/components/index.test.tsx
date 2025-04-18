import { useDispatch } from 'react-redux';
import { act, cleanup } from '@testing-library/react';
import { superRender } from '../../../../../testUtils/customRender';
import { ModalName } from '../../../../../data/ModalName';
import RoleModal from './index';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useDispatch: jest.fn()
  };
});

describe('diagnosis/test role list modal', () => {
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

  it('init role list modal status data', async () => {
    const { container } = superRender(<RoleModal />, undefined, {
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
          [ModalName.Add_Role]: false,
          [ModalName.Update_Role]: false
        }
      },
      type: 'userManagement/initModalStatus'
    });
  });
});
