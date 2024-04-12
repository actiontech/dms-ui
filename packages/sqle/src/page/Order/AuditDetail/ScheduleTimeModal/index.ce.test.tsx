/**
 * @test_version ce
 */

import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { ScheduleTimeModalProps } from './index.type';
import { ignoreComponentCustomAttr } from '@actiontech/shared/lib/testUtil/common';
import MockDate from 'mockdate';
import configuration from '../../../../testUtils/mockApi/configuration';
import ScheduleTimeModal from '.';
import { superRender } from '../../../../testUtils/customRender';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';

describe('test ScheduleTimeModal ce', () => {
  const closeScheduleModalFn = jest.fn();
  let submitFn = jest.fn();
  let getWechatAuditConfigSpy: jest.SpyInstance;
  ignoreComponentCustomAttr();

  beforeEach(() => {
    getWechatAuditConfigSpy = configuration.getWechatAuditConfiguration();
    jest.useFakeTimers({ legacyFakeTimers: true });

    MockDate.set(new Date('2024-12-18T00:00:00Z').getTime());
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
    MockDate.reset();
  });
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

  it('should not render enable wechat notification confirmation', async () => {
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
    expect(getWechatAuditConfigSpy).not.toHaveBeenCalled();
    expect(baseElement).toMatchSnapshot();
    expect(
      screen.queryByText('上线前是否发送通知进行确认')
    ).not.toBeInTheDocument();
    const submitBtn = screen.getAllByText('定时上线')[1];
    expect(submitBtn.closest('button')).not.toBeDisabled();
    fireEvent.click(submitBtn);
    await act(async () => jest.advanceTimersByTime(300));
    expect(submitFn).toHaveBeenCalledTimes(1);
    expect(submitFn).toHaveBeenCalledWith('2024-12-29T06:06:06+08:00');
  });
});
