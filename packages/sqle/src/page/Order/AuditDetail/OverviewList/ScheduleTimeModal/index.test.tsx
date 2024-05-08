import ScheduleTimeModal from '.';
import { ScheduleTimeModalProps } from './index.type';
import { superRender } from '../../../../../testUtils/customRender';
import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import MockDate from 'mockdate';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import { ignoreComponentCustomAttr } from '@actiontech/shared/lib/testUtil/common';
import configuration from '../../../../../testUtils/mockApi/configuration';
import { UpdateWorkflowScheduleReqV2NotifyTypeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import order from '../../../../../testUtils/mockApi/order';

describe('sqle/Order/AuditDetail/ScheduleTimeModal', () => {
  const closeScheduleModalFn = jest.fn();
  const submitFn = jest.fn();
  let getWechatAuditConfigSpy: jest.SpyInstance;
  let getFeishuAuditConfigSpy: jest.SpyInstance;

  const customRender = (
    params: Pick<ScheduleTimeModalProps, 'open' | 'maintenanceTime'>
  ) => {
    return superRender(
      <ScheduleTimeModal
        {...params}
        closeScheduleModal={closeScheduleModalFn}
        submit={submitFn}
      />
    );
  };

  ignoreComponentCustomAttr();

  beforeEach(() => {
    getWechatAuditConfigSpy = configuration.getWechatAuditConfiguration();
    getFeishuAuditConfigSpy = configuration.getFeishuAuditConfiguration();
    order.getScheduledTaskDefaultOption();
    jest.useFakeTimers({ legacyFakeTimers: true });

    MockDate.set(new Date('2024-12-18T00:00:00Z').getTime());
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
    MockDate.reset();
  });

  it('render snap when open is false', () => {
    const { baseElement } = customRender({ open: false });
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when open is true', async () => {
    const { baseElement } = customRender({ open: true });

    await act(async () => jest.advanceTimersByTime(500));
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('取 消')).toBeInTheDocument();
    fireEvent.click(screen.getByText('取 消'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(closeScheduleModalFn).toHaveBeenCalled();
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when has maintenanceTime 1', async () => {
    const { baseElement } = customRender({
      open: true,
      maintenanceTime: [
        {
          maintenance_start_time: {
            hour: 1,
            minute: 20
          },
          maintenance_stop_time: {
            hour: 7,
            minute: 0
          }
        }
      ]
    });
    await act(async () => jest.advanceTimersByTime(500));
    const timeInput = getBySelector(
      '.ant-picker-input input#schedule_time',
      baseElement
    );

    fireEvent.click(timeInput);
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.click(
      getBySelector('.ant-picker-date-panel td[title="2024-12-18"]')
    );
  });

  it('render snap when has maintenanceTime 2', async () => {
    const { baseElement } = customRender({
      open: true,
      maintenanceTime: [
        {
          maintenance_start_time: {
            hour: 5,
            minute: 20
          },
          maintenance_stop_time: {
            hour: 5,
            minute: 40
          }
        }
      ]
    });
    await act(async () => jest.advanceTimersByTime(500));
    const timeInput = getBySelector(
      '.ant-picker-input input#schedule_time',
      baseElement
    );

    fireEvent.click(timeInput);
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.click(
      getBySelector('.ant-picker-date-panel td[title="2024-12-18"]')
    );
  });

  it('render snap when has maintenanceTime 3', async () => {
    const { baseElement } = customRender({
      open: true,
      maintenanceTime: [
        {
          maintenance_start_time: {
            hour: 5,
            minute: 20
          }
        },
        {
          maintenance_stop_time: {
            hour: 5,
            minute: 40
          }
        }
      ]
    });
    await act(async () => jest.advanceTimersByTime(500));
    const timeInput = getBySelector(
      '.ant-picker-input input#schedule_time',
      baseElement
    );

    fireEvent.click(timeInput);
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.click(
      getBySelector('.ant-picker-date-panel td[title="2024-12-18"]')
    );
  });

  it('render snap when has maintenanceTime 4', async () => {
    MockDate.set(new Date('2024-12-18T00:00:00Z').getTime());
    const { baseElement } = customRender({
      open: true,
      maintenanceTime: [
        {
          maintenance_start_time: {
            hour: 2,
            minute: 20
          },
          maintenance_stop_time: {
            hour: 7,
            minute: 0
          }
        },
        {
          maintenance_start_time: {
            hour: 5,
            minute: 20
          }
        },
        {
          maintenance_stop_time: {
            hour: 5,
            minute: 40
          }
        }
      ]
    });
    await act(async () => jest.advanceTimersByTime(500));
    const timeInput = getBySelector(
      '.ant-picker-input input#schedule_time',
      baseElement
    );

    fireEvent.click(timeInput);
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.click(
      getBySelector('.ant-picker-date-panel td[title="2024-12-18"]')
    );
  });

  it('render submit btn', async () => {
    submitFn.mockImplementation(() => new Promise((r) => r(1)));
    const { baseElement } = customRender({
      open: true
    });

    const timeInput = getBySelector(
      '.ant-picker-input input#schedule_time',
      baseElement
    );
    fireEvent.click(timeInput);
    await act(async () => jest.advanceTimersByTime(300));
    const dateEle = screen.getAllByText('29')[0];
    fireEvent.click(dateEle);
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.click(screen.getAllByText('06')[0]);
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.click(screen.getAllByText('06')[1]);
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.click(screen.getAllByText('06')[2]);
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.click(screen.getByText('OK'));
    await act(async () => jest.advanceTimersByTime(300));

    const submitBtn = screen.getAllByText('定时上线')[1];
    fireEvent.click(submitBtn);
    await act(async () => jest.advanceTimersByTime(300));
    expect(submitFn).toHaveBeenCalledTimes(1);
    expect(submitFn).toHaveBeenCalledWith(
      '2024-12-29T06:06:06+08:00',
      false,
      undefined
    );
    expect(
      screen.queryByText('上线前是否发送通知进行确认')
    ).toBeInTheDocument();
    fireEvent.click(getBySelector('#notification_confirmation'));
    expect(getWechatAuditConfigSpy).toHaveBeenCalledTimes(1);
    expect(getFeishuAuditConfigSpy).toHaveBeenCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(submitBtn.closest('button')).toBeDisabled();

    expect(baseElement).toMatchSnapshot();
  });

  it('should render notification method when enable wechat audit config', async () => {
    submitFn.mockImplementation(() => new Promise((r) => r(1)));

    getWechatAuditConfigSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: {
          corp_id: '',
          is_wechat_notification_enabled: true
        }
      })
    );

    getFeishuAuditConfigSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: {
          is_feishu_notification_enabled: true
        }
      })
    );

    const { baseElement } = customRender({
      open: true
    });

    const timeInput = getBySelector(
      '.ant-picker-input input#schedule_time',
      baseElement
    );
    fireEvent.click(timeInput);
    await act(async () => jest.advanceTimersByTime(300));
    const dateEle = screen.getAllByText('29')[0];
    fireEvent.click(dateEle);
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.click(screen.getAllByText('06')[0]);
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.click(screen.getAllByText('06')[1]);
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.click(screen.getAllByText('06')[2]);
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.click(screen.getByText('OK'));
    await act(async () => jest.advanceTimersByTime(300));

    fireEvent.click(getBySelector('#notification_confirmation'));
    expect(getWechatAuditConfigSpy).toHaveBeenCalledTimes(1);
    expect(getFeishuAuditConfigSpy).toHaveBeenCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();

    fireEvent.click(screen.getByText('企业微信'));
    fireEvent.click(screen.getByText('飞书'));

    const submitBtn = screen.getAllByText('定时上线')[1];
    expect(submitBtn.closest('button')).not.toBeDisabled();

    fireEvent.click(submitBtn);
    await act(async () => jest.advanceTimersByTime(300));
    expect(submitFn).toHaveBeenCalledTimes(1);
    expect(submitFn).toHaveBeenCalledWith(
      '2024-12-29T06:06:06+08:00',
      true,
      UpdateWorkflowScheduleReqV2NotifyTypeEnum.feishu
    );
  });
});
