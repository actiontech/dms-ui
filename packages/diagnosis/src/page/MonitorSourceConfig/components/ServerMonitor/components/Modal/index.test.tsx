import { useDispatch, useSelector } from 'react-redux';
import { act, cleanup } from '@testing-library/react';
import { superRender } from '@actiontech/shared/lib/testUtil/customRender';
import { SupportTheme } from '@actiontech/shared/lib/enum';
import { ModalName } from '../../../../../../data/ModalName';
import ServerMonitorModal from './index';

const mockReduxData = {
  user: {
    token: 'AAh32ffdswt',
    theme: SupportTheme.LIGHT,
    bindProjects: [
      {
        project_id: '1',
        is_manager: true,
        project_name: 'default'
      }
    ]
  },
  project: {
    currentProjectArchive: false
  }
};
jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
    useDispatch: jest.fn()
  };
});

describe('test update server monitor', () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    jest.useFakeTimers();
    (useDispatch as jest.Mock).mockImplementation(() => mockDispatch);
    (useSelector as jest.Mock).mockImplementation((selector) => {
      return selector({
        ...mockReduxData,
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

  it('init modal status data', async () => {
    const { container } = superRender(<ServerMonitorModal />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(container).toMatchInlineSnapshot('<div />');
    expect(mockDispatch).toBeCalledTimes(1);
    expect(mockDispatch).toBeCalledWith({
      payload: {
        modalStatus: {
          [ModalName.Add_Server_Monitor]: false,
          [ModalName.Update_Server_Monitor]: false
        }
      },
      type: 'monitorSourceConfig/initModalStatus'
    });
  });
});
