import { useDispatch, useSelector } from 'react-redux';
import monitorSourceConfig from '../../../../../../../testUtils/mockApi/monitorSourceConfig';
import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import UpdateServerMonitor from './index';
import { serverMonitorListData } from '../../../../../../../testUtils/mockApi/monitorSourceConfig/data';
import { superRender } from '../../../../../../../testUtils/customRender';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import { ModalName } from '../../../../../../../data/ModalName';
import eventEmitter from '../../../../../../../utils/EventEmitter';
import EmitterKey from '../../../../../../../data/EmitterKey';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';

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
        monitorSourceConfig: {
          selectServerMonitorData: serverMonitorListData[0],
          modalStatus: {
            [ModalName.Update_Server_Monitor]: true
          }
        }
      });
    });
    monitorSourceConfig.mockAllApi();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
    mockDispatch.mockClear();
    cleanup();
  });

  it('should match no modal when modal status is false', async () => {
    (useSelector as jest.Mock).mockImplementation((selector) => {
      return selector({
        monitorSourceConfig: {
          modalStatus: {
            [ModalName.Update_Server_Monitor]: false
          }
        }
      });
    });
    const { container } = superRender(<UpdateServerMonitor />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(container).toMatchInlineSnapshot('<div />');
  });

  it('should match snapshot when modal state is true ', async () => {
    const { baseElement } = superRender(<UpdateServerMonitor />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('修改服务器监控源')).toBeInTheDocument();
    expect(screen.getByText('监控源名')).toBeInTheDocument();
    expect(screen.getByText('主机IP')).toBeInTheDocument();
  });

  it('should init data for updateServerMonitor', async () => {
    const { baseElement } = superRender(<UpdateServerMonitor />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    // // monitor name
    expect(
      getBySelector('.ant-form-item-control-input-content #name')
    ).toHaveValue('test');
    expect(
      getBySelector('.ant-form-item-control-input-content #name')
    ).toHaveClass('ant-input-disabled');
    // host
    expect(
      getBySelector('.ant-form-item-control-input-content #host')
    ).toHaveValue('172.20.134.1');
    expect(
      getBySelector('.ant-form-item-control-input-content #host')
    ).toHaveClass('ant-input-disabled');
    // ssh port
    expect(getBySelector('.ant-input-number-input-wrap #port')).toHaveValue(
      '22'
    );
    // ssh user
    expect(
      getBySelector('.ant-form-item-control-input-content #user')
    ).toHaveValue('test');
  });

  it('should show error when not input password', async () => {
    const { baseElement } = superRender(<UpdateServerMonitor />);
    await act(async () => jest.advanceTimersByTime(1000));
    expect(baseElement).toMatchSnapshot();

    fireEvent.click(screen.getByText('关 闭'));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith({
      payload: {
        modalName: ModalName.Update_Server_Monitor,
        status: false
      },
      type: 'monitorSourceConfig/updateModalStatus'
    });
  });

  it('should send request when input correct fields info', async () => {
    const emitSpy = jest.spyOn(eventEmitter, 'emit');
    const requestUpdateServerMonitor =
      monitorSourceConfig.updateServerMonitor();
    const { baseElement } = superRender(<UpdateServerMonitor />);
    await act(async () => jest.advanceTimersByTime(1000));
    expect(baseElement).toMatchSnapshot();
    // user
    fireEvent.change(
      getBySelector('.ant-form-item-control-input-content #user'),
      {
        target: {
          value: 'test12'
        }
      }
    );
    await act(async () => jest.advanceTimersByTime(1000));
    expect(
      getBySelector('.ant-form-item-control-input-content #user')
    ).toHaveValue('test12');
    // password
    fireEvent.change(
      getBySelector('.ant-form-item-control-input-content #password'),
      {
        target: {
          value: '123'
        }
      }
    );
    await act(async () => jest.advanceTimersByTime(1000));
    expect(
      getBySelector('.ant-form-item-control-input-content #password')
    ).toHaveValue('123');
    await act(async () => jest.advanceTimersByTime(3000));

    await fireEvent.click(screen.getByText('提 交'));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestUpdateServerMonitor).toHaveBeenCalled();
    expect(requestUpdateServerMonitor).toHaveBeenCalledWith({
      server: {
        host: '172.20.134.1',
        name: 'test',
        password: '123',
        port: 22,
        user: 'test12'
      },
      id: '1'
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(
      screen.queryByText('修改服务器监控源test成功！')
    ).toBeInTheDocument();
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith({
      payload: {
        modalName: ModalName.Update_Server_Monitor,
        status: false
      },
      type: 'monitorSourceConfig/updateModalStatus'
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(emitSpy).toHaveBeenCalledTimes(1);
    expect(emitSpy).toHaveBeenCalledWith(
      EmitterKey.Refresh_Monitor_Source_Config
    );
  });

  it('should send request failed', async () => {
    const requestUpdateServerMonitor =
      monitorSourceConfig.updateServerMonitor();
    requestUpdateServerMonitor.mockImplementation(() =>
      createSpySuccessResponse({ code: 300, message: 'error' })
    );
    const { baseElement } = superRender(<UpdateServerMonitor />);
    await act(async () => jest.advanceTimersByTime(1000));
    expect(baseElement).toMatchSnapshot();
    // user
    fireEvent.change(
      getBySelector('.ant-form-item-control-input-content #user'),
      {
        target: {
          value: 'test12'
        }
      }
    );
    await act(async () => jest.advanceTimersByTime(1000));
    expect(
      getBySelector('.ant-form-item-control-input-content #user')
    ).toHaveValue('test12');
    // password
    fireEvent.change(
      getBySelector('.ant-form-item-control-input-content #password'),
      {
        target: {
          value: '123'
        }
      }
    );
    await act(async () => jest.advanceTimersByTime(1000));
    expect(
      getBySelector('.ant-form-item-control-input-content #password')
    ).toHaveValue('123');
    await act(async () => jest.advanceTimersByTime(3000));

    await fireEvent.click(screen.getByText('提 交'));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestUpdateServerMonitor).toHaveBeenCalled();
    expect(requestUpdateServerMonitor).toHaveBeenCalledWith({
      server: {
        host: '172.20.134.1',
        name: 'test',
        password: '123',
        port: 22,
        user: 'test12'
      },
      id: '1'
    });
    await act(async () => jest.advanceTimersByTime(3000));
  });
});
