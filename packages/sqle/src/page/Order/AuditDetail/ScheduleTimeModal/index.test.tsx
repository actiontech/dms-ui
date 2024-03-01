import ScheduleTimeModal from '.';
import { ScheduleTimeModalProps } from './index.type';

import { renderWithTheme } from '../../../../testUtils/customRender';
import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import MockDate from 'mockdate';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';

describe('sqle/Order/AuditDetail/ScheduleTimeModal', () => {
  const closeScheduleModalFn = jest.fn();
  let submitFn = jest.fn();

  const customRender = (
    params: Pick<ScheduleTimeModalProps, 'open' | 'maintenanceTime'>
  ) => {
    return renderWithTheme(
      <ScheduleTimeModal
        {...params}
        closeScheduleModal={closeScheduleModalFn}
        submit={submitFn}
      />
    );
  };

  beforeEach(() => {
    jest.useFakeTimers();
    // date picker : custom attr [hideSuperIcon]
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    (console.error as jest.Mock).mockRestore();
    cleanup();
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

  it('render snap when has maintenanceTime', async () => {
    const { baseElement } = customRender({
      open: true,
      maintenanceTime: [
        {
          maintenance_start_time: {
            hour: 1,
            minute: 20
          },
          maintenance_stop_time: {
            hour: 2,
            minute: 0
          }
        },
        {
          maintenance_start_time: {
            hour: 5,
            minute: 20
          }
        }
      ]
    });
    await act(async () => jest.advanceTimersByTime(500));
    expect(baseElement).toMatchSnapshot();

    const timeInput = getBySelector(
      '.ant-picker-input input#schedule_time',
      baseElement
    );
    fireEvent.input(timeInput, {
      target: {
        value: '2023-12-18 12:00:00'
      }
    });
    await act(async () => jest.advanceTimersByTime(500));
    fireEvent.blur(timeInput);
    await act(async () => jest.advanceTimersByTime(300));

    expect(screen.getAllByText('定时上线').length).toBe(2);
    expect(baseElement).toMatchSnapshot();
  });

  it('render submit btn', async () => {
    MockDate.set(new Date('2024-12-18T00:00:00Z').getTime());
    submitFn.mockImplementation(() => new Promise(() => 1));
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
    fireEvent.click(screen.getByText('OK'));
    await act(async () => jest.advanceTimersByTime(300));

    const submitBtn = screen.getAllByText('定时上线')[1];
    fireEvent.click(submitBtn);
    await act(async () => jest.advanceTimersByTime(300));
    expect(submitFn).toHaveBeenCalled();
    expect(submitFn).toHaveBeenCalledWith('2024-12-29T00:00:00+08:00');
    MockDate.reset();
  });
});
