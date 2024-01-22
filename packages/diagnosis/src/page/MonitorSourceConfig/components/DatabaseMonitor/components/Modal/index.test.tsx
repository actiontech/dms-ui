import { useDispatch, useSelector } from 'react-redux';
import { act, cleanup } from '@testing-library/react';
import { superRender } from '../../../../../../testUtils/customRender';
import { ModalName } from '../../../../../../data/ModalName';
import DatabaseMonitorModal from './index';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
    useDispatch: jest.fn()
  };
});

describe('test database monitor modal', () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    jest.useFakeTimers();
    (useDispatch as jest.Mock).mockImplementation(() => mockDispatch);
    (useSelector as jest.Mock).mockImplementation((selector) => {
      return selector({
        monitorSourceConfig: {
          modalStatus: {}
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

  it('init database monitor modal status data', async () => {
    const { container } = superRender(<DatabaseMonitorModal />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(container).toMatchInlineSnapshot('<div />');
    expect(mockDispatch).toBeCalledTimes(1);
    expect(mockDispatch).toBeCalledWith({
      payload: {
        modalStatus: {
          [ModalName.Add_Database_Monitor]: false,
          [ModalName.Update_Database_Monitor]: false
        }
      },
      type: 'monitorSourceConfig/initModalStatus'
    });
  });
});
