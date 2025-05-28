import { useDispatch, useSelector } from 'react-redux';
import monitorSourceConfig from '../../../../../../../testUtils/mockApi/monitorSourceConfig';
import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import UpdateDatabaseMonitor from './index';
import { diagnosisSuperRender } from '../../../../../../../testUtils/superRender';
import {
  getAllBySelector,
  getBySelector
} from '@actiontech/shared/lib/testUtil/customQuery';
import { ModalName } from '../../../../../../../data/ModalName';
import eventEmitter from '../../../../../../../utils/EventEmitter';
import EmitterKey from '../../../../../../../data/EmitterKey';
import { databaseMonitorListData } from '../../../../../../../testUtils/mockApi/monitorSourceConfig/data';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
    useDispatch: jest.fn()
  };
});

describe('test update database monitor', () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    jest.useFakeTimers();
    (useDispatch as jest.Mock).mockImplementation(() => mockDispatch);
    (useSelector as jest.Mock).mockImplementation((selector) => {
      return selector({
        monitorSourceConfig: {
          modalStatus: {
            [ModalName.Update_Database_Monitor]: true
          },
          selectDatabaseMonitor: databaseMonitorListData[0]
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
            [ModalName.Update_Database_Monitor]: false
          }
        }
      });
    });
    const { container } = diagnosisSuperRender(<UpdateDatabaseMonitor />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(container).toMatchInlineSnapshot('<div />');
  });

  it('should match snapshot when modal state is true ', async () => {
    const { baseElement } = diagnosisSuperRender(<UpdateDatabaseMonitor />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('修改数据库监控源')).toBeInTheDocument();
    expect(screen.getByText('监控源名')).toBeInTheDocument();
    expect(screen.getByText('数据库IP')).toBeInTheDocument();
    expect(screen.getByText('数据库端口')).toBeInTheDocument();
  });

  it('should render select Data and update new data', async () => {
    const emitSpy = jest.spyOn(eventEmitter, 'emit');
    const requestUpdateDatabaseMonitor =
      monitorSourceConfig.updateDatabaseMonitor();
    const { baseElement } = diagnosisSuperRender(<UpdateDatabaseMonitor />);
    await act(async () => jest.advanceTimersByTime(1000));
    expect(baseElement).toMatchSnapshot();
    // monitor name
    expect(getAllBySelector('.basic-input-wrapper')?.[0]).toHaveValue('first');
    expect(getAllBySelector('.basic-input-wrapper')?.[0]).toHaveClass(
      'ant-input-disabled'
    );
    // monitor type
    expect(getAllBySelector('.ant-select-selection-item')?.[0]).toHaveAttribute(
      'title',
      'MySQL'
    );
    // host
    expect(getAllBySelector('.basic-input-wrapper')?.[1]).toHaveValue(
      '172.20.134.1'
    );
    // port
    expect(getBySelector('.ant-input-number-input-wrap #port')).toHaveValue(
      '22'
    );
    // username
    expect(getBySelector('#username')).toHaveValue('root');
    fireEvent.change(getBySelector('#username'), {
      target: {
        value: 'root123'
      }
    });
    await act(async () => jest.advanceTimersByTime(1000));
    expect(getBySelector('#username')).toHaveValue('root123');
    // password
    expect(getBySelector('#password')).toHaveValue('');
    fireEvent.change(getBySelector('#password'), {
      target: {
        value: '123456789'
      }
    });
    await act(async () => jest.advanceTimersByTime(1000));
    expect(getBySelector('#password')).toHaveValue('123456789');
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.click(screen.getByText('提 交'));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestUpdateDatabaseMonitor).toHaveBeenCalled();
    expect(requestUpdateDatabaseMonitor).toHaveBeenCalledWith({
      username: 'root123',
      password: '123456789',
      id: '1731574922989273088'
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(
      screen.queryByText('修改数据库监控源first成功！')
    ).toBeInTheDocument();
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith({
      payload: {
        modalName: ModalName.Update_Database_Monitor,
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

  it('send update request failed', async () => {
    const requestUpdateDatabaseMonitor =
      monitorSourceConfig.updateDatabaseMonitor();
    requestUpdateDatabaseMonitor.mockImplementation(() =>
      createSpySuccessResponse({ code: 300, message: 'error' })
    );
    const { baseElement } = diagnosisSuperRender(<UpdateDatabaseMonitor />);
    await act(async () => jest.advanceTimersByTime(1000));
    expect(baseElement).toMatchSnapshot();
    // monitor name
    expect(getAllBySelector('.basic-input-wrapper')?.[0]).toHaveValue('first');
    // monitor type
    expect(getAllBySelector('.ant-select-selection-item')?.[0]).toHaveAttribute(
      'title',
      'MySQL'
    );
    // host
    expect(getAllBySelector('.basic-input-wrapper')?.[1]).toHaveValue(
      '172.20.134.1'
    );
    // port
    expect(getBySelector('.ant-input-number-input-wrap #port')).toHaveValue(
      '22'
    );
    // username
    expect(getBySelector('#username')).toHaveValue('root');
    // password
    expect(getBySelector('#password')).toHaveValue('');
    fireEvent.change(getBySelector('#password'), {
      target: {
        value: '123456789'
      }
    });
    await act(async () => jest.advanceTimersByTime(1000));
    expect(getBySelector('#password')).toHaveValue('123456789');
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.click(screen.getByText('提 交'));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestUpdateDatabaseMonitor).toHaveBeenCalled();
    expect(requestUpdateDatabaseMonitor).toHaveBeenCalledWith({
      username: 'root',
      password: '123456789',
      id: '1731574922989273088'
    });
    await act(async () => jest.advanceTimersByTime(3000));
  });
});
