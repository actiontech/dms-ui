import { useDispatch, useSelector } from 'react-redux';
import monitorSourceConfig from '../../../../../../../testUtils/mockApi/monitorSourceConfig';
import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import AddDatabaseMonitor from './index';
import { superRender } from '../../../../../../../testUtils/customRender';
import {
  getAllBySelector,
  getBySelector
} from '@actiontech/shared/lib/testUtil/customQuery';
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

describe('test add database monitor', () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    jest.useFakeTimers();
    (useDispatch as jest.Mock).mockImplementation(() => mockDispatch);
    (useSelector as jest.Mock).mockImplementation((selector) => {
      return selector({
        monitorSourceConfig: {
          modalStatus: {
            [ModalName.Add_Database_Monitor]: true
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
            [ModalName.Add_Database_Monitor]: false
          }
        }
      });
    });
    const { container } = superRender(<AddDatabaseMonitor />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(container).toMatchInlineSnapshot('<div />');
  });

  it('should match snapshot when modal state is true ', async () => {
    const { baseElement } = superRender(<AddDatabaseMonitor />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('添加数据库监控源')).toBeInTheDocument();
    expect(screen.getByText('监控源名')).toBeInTheDocument();
    expect(screen.getByText('数据库IP')).toBeInTheDocument();
    expect(screen.getByText('数据库端口')).toBeInTheDocument();
  });

  it('close modal by click close button', async () => {
    const { baseElement } = superRender(<AddDatabaseMonitor />);
    await act(async () => jest.advanceTimersByTime(1000));
    expect(baseElement).toMatchSnapshot();

    fireEvent.click(screen.getByText('关 闭'));
    await act(async () => jest.advanceTimersByTime(1000));
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith({
      payload: {
        modalName: ModalName.Add_Database_Monitor,
        status: false
      },
      type: 'monitorSourceConfig/updateModalStatus'
    });
  });

  it('should send request when input correct fields info', async () => {
    const emitSpy = jest.spyOn(eventEmitter, 'emit');
    const requestAddDatabaseMonitor = monitorSourceConfig.addDatabaseMonitor();
    const { baseElement } = superRender(<AddDatabaseMonitor />);
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
    // monitor type
    fireEvent.mouseDown(getBySelector('#monitor_type'));
    const selectOptions = getAllBySelector('.ant-select-item-option');
    await act(async () => {
      fireEvent.click(selectOptions[0]);
      await act(async () => jest.advanceTimersByTime(300));
    });
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
    // port
    fireEvent.change(getBySelector('.ant-input-number-input-wrap #port'), {
      target: {
        value: 22
      }
    });
    await act(async () => jest.advanceTimersByTime(1000));
    expect(getBySelector('.ant-input-number-input-wrap #port')).toHaveValue(
      '22'
    );
    // username
    fireEvent.change(getBySelector('#username'), {
      target: {
        value: 'root'
      }
    });
    await act(async () => jest.advanceTimersByTime(1000));
    expect(getBySelector('#username')).toHaveValue('root');
    // password
    fireEvent.change(getBySelector('#password'), {
      target: {
        value: '123456'
      }
    });
    await act(async () => jest.advanceTimersByTime(1000));
    expect(getBySelector('#password')).toHaveValue('123456');
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.click(screen.getByText('提 交'));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestAddDatabaseMonitor).toHaveBeenCalled();
    expect(requestAddDatabaseMonitor).toHaveBeenCalledWith({
      dbs: [
        {
          monitor_type: 'MySQL',
          host: '172.20.134.1',
          monitor_name: 'test',
          port: 22,
          username: 'root',
          password: '123456'
        }
      ]
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(
      screen.queryByText('添加数据库监控源test成功！')
    ).toBeInTheDocument();
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith({
      payload: {
        modalName: ModalName.Add_Database_Monitor,
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
    const requestAddDatabaseMonitor = monitorSourceConfig.addDatabaseMonitor();
    requestAddDatabaseMonitor.mockImplementation(() =>
      createSpySuccessResponse({ code: 300, message: 'error' })
    );
    const { baseElement } = superRender(<AddDatabaseMonitor />);
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
    // monitor type
    fireEvent.mouseDown(getBySelector('#monitor_type'));
    const selectOptions = getAllBySelector('.ant-select-item-option');
    await act(async () => {
      fireEvent.click(selectOptions[0]);
      await act(async () => jest.advanceTimersByTime(300));
    });
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
    // port
    fireEvent.change(getBySelector('.ant-input-number-input-wrap #port'), {
      target: {
        value: 22
      }
    });
    await act(async () => jest.advanceTimersByTime(1000));
    expect(getBySelector('.ant-input-number-input-wrap #port')).toHaveValue(
      '22'
    );
    // username
    fireEvent.change(getBySelector('#username'), {
      target: {
        value: 'root'
      }
    });
    await act(async () => jest.advanceTimersByTime(1000));
    expect(getBySelector('#username')).toHaveValue('root');
    // password
    fireEvent.change(getBySelector('#password'), {
      target: {
        value: '123456'
      }
    });
    await act(async () => jest.advanceTimersByTime(1000));
    expect(getBySelector('#password')).toHaveValue('123456');
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.click(screen.getByText('提 交'));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestAddDatabaseMonitor).toHaveBeenCalled();
    expect(requestAddDatabaseMonitor).toHaveBeenCalledWith({
      dbs: [
        {
          monitor_type: 'MySQL',
          host: '172.20.134.1',
          monitor_name: 'test',
          port: 22,
          username: 'root',
          password: '123456'
        }
      ]
    });
    await act(async () => jest.advanceTimersByTime(3000));
  });
});
