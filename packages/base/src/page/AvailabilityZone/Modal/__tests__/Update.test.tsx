import { superRender } from '@actiontech/shared/lib/testUtil/customRender';
import { cleanup, fireEvent, act, screen } from '@testing-library/react';
import { ModalName } from '../../../../data/ModalName';
import UpdateAvailabilityZoneModal from '../Update';
import EventEmitter from '../../../../utils/EventEmitter';
import EmitterKey from '../../../../data/EmitterKey';
import { useDispatch, useSelector } from 'react-redux';
import gateway from '../../../../testUtils/mockApi/gateway';
import { mockGatewayListData } from '../../../../testUtils/mockApi/gateway/data';
import { message } from 'antd';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
  useSelector: jest.fn()
}));

describe('base/AvailabilityZone/Modal/Update', () => {
  let updateGatewaySpy: jest.SpyInstance;
  const dispatchSpy = jest.fn();
  const selectedZone = mockGatewayListData[0];

  beforeEach(() => {
    jest.useFakeTimers();
    updateGatewaySpy = gateway.updateGateway();
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
    (useSelector as jest.Mock).mockImplementation((selector) => {
      return selector({
        availabilityZone: {
          modalStatus: {
            [ModalName.DMS_Update_Availability_zone]: true
          },
          selectAvailabilityZone: selectedZone
        }
      });
    });
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('should set form values from selected zone', async () => {
    const { baseElement } = superRender(<UpdateAvailabilityZoneModal />);
    await act(async () => jest.advanceTimersByTime(0));

    const nameInput = screen.getByLabelText('可用区名称') as HTMLInputElement;
    const addressInput = screen.getByLabelText('服务节点') as HTMLInputElement;

    expect(nameInput.value).toBe(selectedZone.gateway_name);
    expect(addressInput.value).toBe(selectedZone.gateway_address);
    expect(baseElement).toMatchSnapshot();
  });

  it('should send update zone request when click submit button', async () => {
    const eventEmitSpy = jest.spyOn(EventEmitter, 'emit');
    superRender(<UpdateAvailabilityZoneModal />);
    await act(async () => jest.advanceTimersByTime(0));

    const nameInput = screen.getByLabelText('可用区名称');
    const addressInput = screen.getByLabelText('服务节点');

    fireEvent.change(nameInput, { target: { value: 'updated-zone' } });
    fireEvent.change(addressInput, { target: { value: '127.0.0.2' } });

    const submitButton = screen.getByText('提 交');
    fireEvent.click(submitButton);

    await act(async () => jest.advanceTimersByTime(0));

    expect(updateGatewaySpy).toHaveBeenCalled();
    expect(updateGatewaySpy).toHaveBeenCalledWith({
      gateway_id: selectedZone.gateway_id,
      update_gateway: {
        gateway_name: 'updated-zone',
        gateway_address: '127.0.0.2'
      }
    });
    await act(async () => jest.advanceTimersByTime(3000));

    expect(screen.getByText('更新成功')).toBeInTheDocument();
    expect(eventEmitSpy).toHaveBeenCalledTimes(2);
    expect(eventEmitSpy).toHaveBeenCalledWith(
      EmitterKey.Refresh_Availability_Zone_Page
    );
    expect(eventEmitSpy).toHaveBeenCalledWith(
      EmitterKey.Refresh_Availability_Zone_Selector
    );
    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'availabilityZone/updateModalStatus',
      payload: {
        modalName: ModalName.DMS_Update_Availability_zone,
        status: false
      }
    });
  });

  it('should close modal when click close button', async () => {
    superRender(<UpdateAvailabilityZoneModal />);

    fireEvent.click(screen.getByText('关 闭'));
    await act(async () => jest.advanceTimersByTime(1000));

    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'availabilityZone/updateModalStatus',
      payload: {
        modalName: ModalName.DMS_Update_Availability_zone,
        status: false
      }
    });
  });
});
