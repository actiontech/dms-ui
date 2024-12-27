import { useDispatch, useSelector } from 'react-redux';
import monitorSourceConfig from '../../../../../../../testUtils/mockApi/monitorSourceConfig';
import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import AddServerMonitor from './index';
import { superRender } from '../../../../../../../testUtils/customRender';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import { ModalName } from '../../../../../../../data/ModalName';
import eventEmitter from '../../../../../../../utils/EventEmitter';
import EmitterKey from '../../../../../../../data/EmitterKey';
import {
  createSpyFailResponse,
  createSpySuccessResponse
} from '@actiontech/shared/lib/testUtil/mockApi';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
    useDispatch: jest.fn()
  };
});

describe('test add server monitor', () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    jest.useFakeTimers();
    (useDispatch as jest.Mock).mockImplementation(() => mockDispatch);
    (useSelector as jest.Mock).mockImplementation((selector) => {
      return selector({
        monitorSourceConfig: {
          modalStatus: {
            [ModalName.Add_Server_Monitor]: true
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
            [ModalName.Add_Server_Monitor]: false
          }
        }
      });
    });
    const { container } = superRender(<AddServerMonitor />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(container).toMatchInlineSnapshot('<div />');
  });

  it('should match snapshot when modal state is true ', async () => {
    const { baseElement } = superRender(<AddServerMonitor />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('添加服务器监控源')).toBeInTheDocument();
    expect(screen.getByText('监控源名')).toBeInTheDocument();
    expect(screen.getByText('主机IP')).toBeInTheDocument();
  });

  it('close modal by click close button', async () => {
    const { baseElement } = superRender(<AddServerMonitor />);
    await act(async () => jest.advanceTimersByTime(1000));
    expect(baseElement).toMatchSnapshot();

    fireEvent.click(screen.getByText('关 闭'));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith({
      payload: {
        modalName: ModalName.Add_Server_Monitor,
        status: false
      },
      type: 'monitorSourceConfig/updateModalStatus'
    });
  });

  it('should send request when input correct fields info', async () => {
    const emitSpy = jest.spyOn(eventEmitter, 'emit');
    const requestAddServerMonitor = monitorSourceConfig.addServerMonitor();
    const { baseElement } = superRender(<AddServerMonitor />);
    await act(async () => jest.advanceTimersByTime(1000));
    expect(baseElement).toMatchSnapshot();
    // host
    await act(async () => {
      fireEvent.change(
        getBySelector('.ant-form-item-control-input-content #host'),
        {
          target: {
            value: '172.20.134.1'
          }
        }
      );
      await act(async () => jest.advanceTimersByTime(1000));
    });
    await act(async () => {
      fireEvent.blur(
        getBySelector('.ant-form-item-control-input-content #host')
      );
      await act(async () => jest.advanceTimersByTime(300));
    });
    expect(
      getBySelector('.ant-form-item-control-input-content #host')
    ).toHaveValue('172.20.134.1');
    // ssh port
    await act(async () => {
      fireEvent.change(getBySelector('.ant-input-number-input-wrap #port'), {
        target: {
          value: 22
        }
      });
      await act(async () => jest.advanceTimersByTime(1000));
    });
    expect(getBySelector('.ant-input-number-input-wrap #port')).toHaveValue(
      '22'
    );
    // ssh user
    await act(async () => {
      fireEvent.change(
        getBySelector('.ant-form-item-control-input-content #user'),
        {
          target: {
            value: 'root'
          }
        }
      );
      await act(async () => jest.advanceTimersByTime(1000));
    });
    expect(
      getBySelector('.ant-form-item-control-input-content #user')
    ).toHaveValue('root');
    // ssh password
    await act(async () => jest.advanceTimersByTime(1000));
    await act(async () => {
      fireEvent.change(
        getBySelector('.ant-form-item-control-input-content #password'),
        {
          target: {
            value: '123'
          }
        }
      );
      await act(async () => jest.advanceTimersByTime(1000));
    });
    expect(
      getBySelector('.ant-form-item-control-input-content #password')
    ).toHaveValue('123');
    // monitor name
    await act(async () => {
      fireEvent.focus(
        getBySelector('.ant-form-item-control-input-content #name')
      );
      await act(async () => jest.advanceTimersByTime(300));
    });
    await act(async () => jest.advanceTimersByTime(1000));
    await act(async () => jest.advanceTimersByTime(1000));
    await act(async () => jest.advanceTimersByTime(1000));
    expect(
      getBySelector('.ant-form-item-control-input-content #name')
    ).toHaveValue('host1');
    fireEvent.change(
      getBySelector('.ant-form-item-control-input-content #name'),
      {
        target: {
          value: 'test'
        }
      }
    );
    expect(
      getBySelector('.ant-form-item-control-input-content #name')
    ).toHaveValue('test');
    await act(async () => jest.advanceTimersByTime(3000));

    await fireEvent.click(screen.getByText('提 交'));
    await act(async () => jest.advanceTimersByTime(1000));
    expect(requestAddServerMonitor).toHaveBeenCalled();
    expect(requestAddServerMonitor).toHaveBeenCalledWith({
      servers: [
        {
          host: '172.20.134.1',
          name: 'test',
          password: '123',
          port: 22,
          user: 'root'
        }
      ]
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(
      screen.queryByText('添加服务器监控源test成功！')
    ).toBeInTheDocument();
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith({
      payload: {
        modalName: ModalName.Add_Server_Monitor,
        status: false
      },
      type: 'monitorSourceConfig/updateModalStatus'
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(emitSpy).toHaveBeenCalledTimes(1);
    expect(emitSpy).toHaveBeenCalledWith(
      EmitterKey.Refresh_Monitor_Source_Config
    );
  }, 40000);

  it('should send request failed', async () => {
    const requestAddServerMonitor = monitorSourceConfig.addServerMonitor();
    requestAddServerMonitor.mockImplementation(() =>
      createSpySuccessResponse({ code: 300, message: 'error' })
    );
    const { baseElement } = superRender(<AddServerMonitor />);
    await act(async () => jest.advanceTimersByTime(1000));
    expect(baseElement).toMatchSnapshot();
    // host
    await act(async () => {
      fireEvent.change(
        getBySelector('.ant-form-item-control-input-content #host'),
        {
          target: {
            value: '172.20.134.1'
          }
        }
      );
      await act(async () => jest.advanceTimersByTime(1000));
    });
    await act(async () => {
      fireEvent.blur(
        getBySelector('.ant-form-item-control-input-content #host')
      );
      await act(async () => jest.advanceTimersByTime(300));
    });
    expect(
      getBySelector('.ant-form-item-control-input-content #host')
    ).toHaveValue('172.20.134.1');
    // ssh port
    await act(async () => {
      fireEvent.change(getBySelector('.ant-input-number-input-wrap #port'), {
        target: {
          value: 22
        }
      });
      await act(async () => jest.advanceTimersByTime(1000));
    });
    expect(getBySelector('.ant-input-number-input-wrap #port')).toHaveValue(
      '22'
    );
    // ssh user
    await act(async () => {
      fireEvent.change(
        getBySelector('.ant-form-item-control-input-content #user'),
        {
          target: {
            value: 'root'
          }
        }
      );
      await act(async () => jest.advanceTimersByTime(1000));
    });
    expect(
      getBySelector('.ant-form-item-control-input-content #user')
    ).toHaveValue('root');
    // ssh password
    await act(async () => jest.advanceTimersByTime(1000));
    await act(async () => {
      fireEvent.change(
        getBySelector('.ant-form-item-control-input-content #password'),
        {
          target: {
            value: '123'
          }
        }
      );
      await act(async () => jest.advanceTimersByTime(1000));
    });
    expect(
      getBySelector('.ant-form-item-control-input-content #password')
    ).toHaveValue('123');
    // monitor name
    await act(async () => {
      fireEvent.focus(
        getBySelector('.ant-form-item-control-input-content #name')
      );
      await act(async () => jest.advanceTimersByTime(300));
    });
    await act(async () => jest.advanceTimersByTime(1000));
    await act(async () => jest.advanceTimersByTime(1000));
    await act(async () => jest.advanceTimersByTime(1000));
    expect(
      getBySelector('.ant-form-item-control-input-content #name')
    ).toHaveValue('host1');
    await act(async () => jest.advanceTimersByTime(3000));

    await fireEvent.click(screen.getByText('提 交'));
    await act(async () => jest.advanceTimersByTime(1000));
    expect(requestAddServerMonitor).toHaveBeenCalled();
    expect(requestAddServerMonitor).toHaveBeenCalledWith({
      servers: [
        {
          host: '172.20.134.1',
          name: 'host1',
          password: '123',
          port: 22,
          user: 'root'
        }
      ]
    });
    await act(async () => jest.advanceTimersByTime(3000));
  }, 40000);

  it('show error info when get host name failed', async () => {
    const requestGetHostName = monitorSourceConfig.getServerMonitorHostName();
    requestGetHostName.mockImplementation(() =>
      createSpyFailResponse({
        message: 'error'
      })
    );
    const { baseElement } = superRender(<AddServerMonitor />);
    await act(async () => jest.advanceTimersByTime(1000));
    expect(baseElement).toMatchSnapshot();
    // host
    fireEvent.change(
      getBySelector('.ant-form-item-control-input-content #host'),
      {
        target: {
          value: '172.20.134.1'
        }
      }
    );
    await act(async () => jest.advanceTimersByTime(1000));
    expect(
      getBySelector('.ant-form-item-control-input-content #host')
    ).toHaveValue('172.20.134.1');
    // ssh port
    fireEvent.change(getBySelector('.ant-input-number-input-wrap #port'), {
      target: {
        value: 22
      }
    });
    await act(async () => jest.advanceTimersByTime(1000));
    expect(getBySelector('.ant-input-number-input-wrap #port')).toHaveValue(
      '22'
    );
    // ssh user
    fireEvent.change(
      getBySelector('.ant-form-item-control-input-content #user'),
      {
        target: {
          value: 'root'
        }
      }
    );
    await act(async () => jest.advanceTimersByTime(1000));
    expect(
      getBySelector('.ant-form-item-control-input-content #user')
    ).toHaveValue('root');
    // ssh password
    await act(async () => jest.advanceTimersByTime(1000));
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
    // monitor name
    await act(async () => {
      jest.advanceTimersByTime(1000);
      fireEvent.focus(
        getBySelector('.ant-form-item-control-input-content #name')
      );
    });
    expect(requestGetHostName).toHaveBeenCalled();
    await act(async () => jest.advanceTimersByTime(1000));
    await act(async () => jest.advanceTimersByTime(1000));
    await act(async () => jest.advanceTimersByTime(1000));
    expect(
      screen.getByText('未连接上目标服务器，请检查配置是否正确！')
    ).toBeInTheDocument();

    fireEvent.click(screen.getByText('关 闭'));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith({
      payload: {
        modalName: ModalName.Add_Server_Monitor,
        status: false
      },
      type: 'monitorSourceConfig/updateModalStatus'
    });
  });
});
