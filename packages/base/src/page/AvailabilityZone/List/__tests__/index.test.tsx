import { cleanup, screen, act, fireEvent } from '@testing-library/react';
import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import AvailabilityZoneList from '../index';
import { queryBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import gateway from '../../../../testUtils/mockApi/gateway';
import { mockGatewayListData } from '../../../../testUtils/mockApi/gateway/data';
import { useDispatch, useSelector } from 'react-redux';
import { ModalName } from '../../../../data/ModalName';
import EventEmitter from '../../../../utils/EventEmitter';
import EmitterKey from '../../../../data/EmitterKey';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import {
  createSpyErrorResponse,
  createSpySuccessResponse
} from '@actiontech/shared/lib/testUtil/mockApi';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useDispatch: jest.fn(),
    useSelector: jest.fn()
  };
});

describe('base/AvailabilityZoneList', () => {
  let gatewayListSpy: jest.SpyInstance;
  let deleteGatewaySpy: jest.SpyInstance;
  const dispatchSpy = jest.fn();

  beforeEach(() => {
    jest.useFakeTimers();
    mockUseCurrentUser();
    gatewayListSpy = gateway.listGateways();
    deleteGatewaySpy = gateway.deleteGateway();
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
    (useSelector as jest.Mock).mockImplementation((selector) => {
      return selector({
        availabilityZone: {
          modalStatus: {
            [ModalName.DMS_Create_Availability_zone]: false,
            [ModalName.DMS_Update_Availability_zone]: false
          }
        },
        permission: {
          moduleFeatureSupport: {},
          userOperationPermissions: null
        }
      });
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    cleanup();
  });

  it('render availability zone table', async () => {
    const { baseElement } = superRender(<AvailabilityZoneList />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(gatewayListSpy).toHaveBeenCalledTimes(1);
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('test')).toBeInTheDocument();
    expect(screen.getByText('test2')).toBeInTheDocument();
    expect(
      screen.getByText(`共 ${mockGatewayListData.length} 条数据`)
    ).toBeInTheDocument();
    expect(screen.getAllByText('删 除')).toHaveLength(2);
    expect(screen.getAllByText('编 辑')).toHaveLength(2);
  });

  it('should render empty tips when request not success', async () => {
    gatewayListSpy.mockClear();
    gatewayListSpy.mockImplementation(() =>
      createSpyErrorResponse({ data: [] })
    );
    const { baseElement } = superRender(<AvailabilityZoneList />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    const element = queryBySelector('.ant-table-placeholder', baseElement);
    expect(element).toBeInTheDocument();
  });

  it('should refresh availability zone table when emit "Refresh_Availability_Zone_Page" event', async () => {
    superRender(<AvailabilityZoneList />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(gatewayListSpy).toHaveBeenCalledTimes(1);
    await act(async () =>
      EventEmitter.emit(EmitterKey.Refresh_Availability_Zone_Page)
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(gatewayListSpy).toHaveBeenCalledTimes(2);
  });

  it('should send delete availability zone request', async () => {
    gatewayListSpy.mockClear();
    gatewayListSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: [mockGatewayListData[0]],
        total_nums: 1
      })
    );
    const zoneName = mockGatewayListData[0].gateway_name;

    superRender(<AvailabilityZoneList />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(gatewayListSpy).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByText('删 除'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(
      screen.getByText(`确定要删除可用区:${zoneName}?`)
    ).toBeInTheDocument();
    fireEvent.click(screen.getByText('确 认'));
    await act(async () => jest.advanceTimersByTime(3300));
    expect(deleteGatewaySpy).toHaveBeenCalledTimes(1);
    expect(deleteGatewaySpy).toHaveBeenCalledWith({
      gateway_id: mockGatewayListData[0].gateway_id
    });
    expect(screen.getByText('删除成功')).toBeInTheDocument();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(gatewayListSpy).toHaveBeenCalled();
  });

  it('should dispatch action when edit availability zone', async () => {
    gatewayListSpy.mockClear();
    gatewayListSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: [mockGatewayListData[0]],
        total_nums: 1
      })
    );
    superRender(<AvailabilityZoneList />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(gatewayListSpy).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByText('编 辑'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(dispatchSpy).toHaveBeenCalledTimes(3);
    expect(dispatchSpy).toHaveBeenNthCalledWith(2, {
      type: 'availabilityZone/updateModalStatus',
      payload: {
        modalName: ModalName.DMS_Update_Availability_zone,
        status: true
      }
    });
    expect(dispatchSpy).toHaveBeenNthCalledWith(3, {
      type: 'availabilityZone/updateSelectAvailabilityZone',
      payload: {
        availabilityZone: mockGatewayListData[0]
      }
    });
  });

  it('should dispatch action when create new availability zone', async () => {
    superRender(<AvailabilityZoneList />);
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(screen.getByText('新建可用区'));
    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'availabilityZone/updateModalStatus',
      payload: {
        modalName: ModalName.DMS_Create_Availability_zone,
        status: true
      }
    });
  });
});
