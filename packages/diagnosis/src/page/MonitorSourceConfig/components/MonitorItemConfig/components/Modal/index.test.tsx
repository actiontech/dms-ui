import { useDispatch, useSelector } from 'react-redux';
import { act, cleanup } from '@testing-library/react';
import { diagnosisSuperRender } from '../../../../../../testUtils/superRender';
import { ModalName } from '../../../../../../data/ModalName';
import DatabaseMonitorModal from './index';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
    useDispatch: jest.fn()
  };
});

describe('test init monitor item config modal', () => {
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

  it('init check monitor config modal status data', async () => {
    const { container } = diagnosisSuperRender(<DatabaseMonitorModal />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(container).toMatchInlineSnapshot('<div />');
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith({
      payload: {
        modalStatus: {
          [ModalName.Check_Monitor_Config]: false
        }
      },
      type: 'monitorSourceConfig/initModalStatus'
    });
  });
});
