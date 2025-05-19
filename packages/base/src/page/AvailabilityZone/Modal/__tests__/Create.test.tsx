import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import { cleanup, fireEvent, act, screen } from '@testing-library/react';
import { ModalName } from '../../../../data/ModalName';
import CreateAvailabilityZoneModal from '../Create';
import EventEmitter from '../../../../utils/EventEmitter';
import EmitterKey from '../../../../data/EmitterKey';
import { useDispatch, useSelector } from 'react-redux';
import gateway from '@actiontech/shared/lib/testUtil/mockApi/base/gateway';
import MockDate from 'mockdate';
import dayjs from 'dayjs';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
  useSelector: jest.fn()
}));

describe('base/AvailabilityZone/Modal/Create', () => {
  let addGatewaySpy: jest.SpyInstance;
  const dispatchSpy = jest.fn();
  const currentTime = dayjs('2025-1-1 12:00:00');
  beforeEach(() => {
    MockDate.set(currentTime.valueOf());
    jest.useFakeTimers({ legacyFakeTimers: true });
    addGatewaySpy = gateway.addGateway();
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
    (useSelector as jest.Mock).mockImplementation((selector) => {
      return selector({
        availabilityZone: {
          modalStatus: {
            [ModalName.DMS_Create_Availability_zone]: true
          }
        }
      });
    });
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
    MockDate.reset();
  });

  it('should send create zone request when click submit button', async () => {
    const eventEmitSpy = jest.spyOn(EventEmitter, 'emit');
    const { baseElement } = superRender(<CreateAvailabilityZoneModal />);
    expect(baseElement).toMatchSnapshot();

    const nameInput = screen.getByLabelText('可用区名称');
    const addressInput = screen.getByLabelText('服务节点');

    fireEvent.change(nameInput, { target: { value: 'test-zone' } });
    fireEvent.change(addressInput, { target: { value: '127.0.0.1' } });

    const submitButton = screen.getByText('提 交');
    fireEvent.click(submitButton);

    await act(async () => jest.advanceTimersByTime(0));

    expect(addGatewaySpy).toHaveBeenCalled();
    expect(addGatewaySpy).toHaveBeenCalledWith({
      add_gateway: {
        gateway_name: 'test-zone',
        gateway_address: '127.0.0.1',
        gateway_id: currentTime.format('YYYYMMDDHHmmssSSS')
      }
    });

    await act(async () => jest.advanceTimersByTime(3000));

    expect(screen.getByText('创建成功')).toBeInTheDocument();
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
        modalName: ModalName.DMS_Create_Availability_zone,
        status: false
      }
    });
  });

  it('should close modal when click close button', async () => {
    superRender(<CreateAvailabilityZoneModal />);

    fireEvent.click(screen.getByText('关 闭'));
    await act(async () => jest.advanceTimersByTime(1000));

    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'availabilityZone/updateModalStatus',
      payload: {
        modalName: ModalName.DMS_Create_Availability_zone,
        status: false
      }
    });
  });
});
