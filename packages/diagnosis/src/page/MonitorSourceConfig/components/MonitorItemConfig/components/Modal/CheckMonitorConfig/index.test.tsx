import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import CheckMonitorConfig from './';
import monitorSourceConfig from '../../../../../../../testUtils/mockApi/monitorSourceConfig';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import { useDispatch, useSelector } from 'react-redux';
import { superRender } from '../../../../../../../testUtils/customRender';
import { ModalName } from '../../../../../../../data/ModalName';
import { monitorRoutineListData } from '../../../../../../../testUtils/mockApi/monitorSourceConfig/data';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
  useDispatch: jest.fn()
}));

describe('test check monitor config modal', () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    (useDispatch as jest.Mock).mockReturnValue(mockDispatch);
    (useSelector as jest.Mock).mockImplementation((selector) => {
      return selector({
        monitorSourceConfig: {
          modalStatus: { [ModalName.Check_Monitor_Config]: true },
          selectMonitorConfigDta: monitorRoutineListData[0]
        }
      });
    });
    jest.useFakeTimers();
    monitorSourceConfig.mockAllApi();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllTimers();
    jest.clearAllMocks();
    cleanup();
  });

  it('should match no modal when modal status is false', async () => {
    (useSelector as jest.Mock).mockImplementation((selector) => {
      return selector({
        monitorSourceConfig: {
          modalStatus: {
            [ModalName.Check_Monitor_Config]: false
          }
        }
      });
    });
    const { container } = superRender(<CheckMonitorConfig />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(container).toMatchInlineSnapshot('<div />');
  });

  it('should match snapshot when modal state is true ', async () => {
    const { baseElement } = superRender(<CheckMonitorConfig />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(screen.getAllByText('监控指标')?.[0]).toBeInTheDocument();
    expect(screen.getByText('描述')).toBeInTheDocument();
  });

  it('should render normal table', async () => {
    const request = monitorSourceConfig.getMonitorRoutineMetrics();
    const { baseElement } = superRender(<CheckMonitorConfig />);
    await act(async () => jest.advanceTimersByTime(3300));
    expect(request).toBeCalled();
    await act(async () => jest.advanceTimersByTime(3300));
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('共 1 条数据')).toBeInTheDocument();
    expect(
      screen.getAllByText('mysql:server_status:commands')?.[0]
    ).toBeInTheDocument();
    expect(
      screen.getAllByText('mysql状态值Com_*/mysql status value Com_')?.[0]
    ).toBeInTheDocument();
  });

  it('should close model when click close icon', async () => {
    const request = monitorSourceConfig.getMonitorRoutineMetrics();
    const { baseElement } = superRender(<CheckMonitorConfig />);
    await act(async () => jest.advanceTimersByTime(3300));
    expect(request).toBeCalled();
    await act(async () => jest.advanceTimersByTime(3300));
    expect(baseElement).toMatchSnapshot();

    mockDispatch.mockClear();
    fireEvent.click(getBySelector('.ant-modal-close'));
    expect(mockDispatch).toBeCalledTimes(2);
    expect(mockDispatch).toBeCalledWith({
      payload: {
        modalName: ModalName.Check_Monitor_Config,
        status: false
      },
      type: 'monitorSourceConfig/updateModalStatus'
    });
    expect(mockDispatch).toBeCalledTimes(2);
    expect(mockDispatch).toBeCalledWith({
      payload: null,
      type: 'monitorSourceConfig/updateSelectMonitorConfigData'
    });
  });

  it('should refresh table when change pagination info', async () => {
    const request = monitorSourceConfig.getMonitorRoutineMetrics();
    const { baseElement } = superRender(<CheckMonitorConfig />);
    await act(async () => jest.advanceTimersByTime(3300));
    expect(request).toBeCalled();
    await act(async () => jest.advanceTimersByTime(3300));
    expect(baseElement).toMatchSnapshot();
    fireEvent.mouseDown(getBySelector('.ant-select-selection-search input'));
    await act(async () => jest.advanceTimersByTime(3300));
    expect(screen.getByText('10 条/页')).toBeInTheDocument();
    fireEvent.click(screen.getByText('10 条/页'));
    await act(async () => jest.advanceTimersByTime(3300));
    expect(request).toBeCalled();
    expect(screen.getByText('共 1 条数据')).toBeInTheDocument();
  });

  it('render empty table when request return error', async () => {
    const request = monitorSourceConfig.getMonitorRoutineMetrics();
    request.mockImplementation(() =>
      createSpySuccessResponse({ code: 500, message: 'error' })
    );
    const { baseElement } = superRender(<CheckMonitorConfig />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
  });
});
