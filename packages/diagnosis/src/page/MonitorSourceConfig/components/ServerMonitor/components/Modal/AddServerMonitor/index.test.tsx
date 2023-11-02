import { useDispatch, useSelector } from 'react-redux';
import monitorSourceConfig from '../../../../../../../testUtils/mockApi/monitorSourceConfig';
import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import AddServerMonitor from './index';
import { superRender } from '@actiontech/shared/lib/testUtil/customRender';
import {
  getAllBySelector,
  getBySelector
} from '@actiontech/shared/lib/testUtil/customQuery';
import { ModalName } from '../../../../../../../data/ModalName';
import { SupportTheme } from '@actiontech/shared/lib/enum';
import eventEmitter from '../../../../../../../utils/EventEmitter';
import EmitterKey from '../../../../../../../data/EmitterKey';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';

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
    mockUseCurrentProject();
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

  it('should show error when no data input ', async () => {
    const { baseElement } = superRender(<AddServerMonitor />);
    await act(async () => jest.advanceTimersByTime(1000));
    fireEvent.click(screen.getByText('提 交'));
    await act(async () => jest.advanceTimersByTime(300));
    await screen.findByText('必须填写监控源名');
    expect(screen.queryByText('必须填写监控源名')).toBeInTheDocument();
    expect(screen.queryByText('必须填写主机IP')).toBeInTheDocument();
    expect(screen.queryByText('必须填写SSH端口')).toBeInTheDocument();
    expect(screen.queryByText('必须填写SSH用户名')).toBeInTheDocument();
    expect(screen.queryByText('必须填写SSH用户密码')).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();

    fireEvent.click(screen.getByText('关 闭'));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(mockDispatch).toBeCalledTimes(1);
    expect(mockDispatch).toBeCalledWith({
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
    // monitor name
    fireEvent.change(getAllBySelector('.basic-input-wrapper')?.[0], {
      target: {
        value: 'test'
      }
    });
    await act(async () => jest.advanceTimersByTime(1000));
    expect(getAllBySelector('.basic-input-wrapper')?.[0]).toHaveValue('test');
    // host
    fireEvent.change(getAllBySelector('.basic-input-wrapper')?.[1], {
      target: {
        value: '172.20.134.1'
      }
    });
    await act(async () => jest.advanceTimersByTime(1000));
    expect(getAllBySelector('.basic-input-wrapper')?.[1]).toHaveValue(
      '172.20.134.1'
    );
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
    fireEvent.change(getAllBySelector('.basic-input-wrapper')?.[2], {
      target: {
        value: 'root'
      }
    });
    await act(async () => jest.advanceTimersByTime(1000));
    expect(getAllBySelector('.basic-input-wrapper')?.[2]).toHaveValue('root');
    // ssh password
    await act(async () => jest.advanceTimersByTime(1000));
    fireEvent.change(getBySelector('.basic-input-wrapper #password'), {
      target: {
        value: '123'
      }
    });
    await act(async () => jest.advanceTimersByTime(1000));
    expect(getBySelector('.basic-input-wrapper #password')).toHaveValue('123');
    fireEvent.blur(getBySelector('.basic-input-wrapper #password'));
    await act(async () => jest.advanceTimersByTime(3000));

    await fireEvent.click(screen.getByText('提 交'));
    await act(async () => jest.advanceTimersByTime(1000));
    expect(requestAddServerMonitor).toBeCalled();
    expect(requestAddServerMonitor).toBeCalledWith({
      servers: [
        {
          host: '172.20.134.1',
          name: 'test',
          password: '123',
          port: 22,
          user: 'root'
        }
      ],
      project_uid: '700300'
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(
      screen.queryByText('添加服务器监控源test成功！')
    ).toBeInTheDocument();
    expect(mockDispatch).toBeCalledTimes(1);
    expect(mockDispatch).toBeCalledWith({
      payload: {
        modalName: ModalName.Add_Server_Monitor,
        status: false
      },
      type: 'monitorSourceConfig/updateModalStatus'
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(emitSpy).toBeCalledTimes(1);
    expect(emitSpy).toBeCalledWith(EmitterKey.Refresh_Server_Monitor);
  }, 40000);
});
