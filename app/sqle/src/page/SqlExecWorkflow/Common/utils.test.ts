import { cleanup } from '@testing-library/react';
import MockDate from 'mockdate';
import dayjs from 'dayjs';
import { checkTimeInWithMaintenanceTime } from './utils';

describe('sqle/ExecWorkflow/Common/utils', () => {
  beforeEach(() => {
    MockDate.set(dayjs('2023-12-18 12:34:00').valueOf());
  });

  afterEach(() => {
    jest.clearAllMocks();
    MockDate.reset();
    cleanup();
  });

  it('render checkTimeInWithMaintenanceTime', () => {
    const currentTime = dayjs();
    expect(checkTimeInWithMaintenanceTime(currentTime, [])).toBeTruthy();

    expect(
      checkTimeInWithMaintenanceTime(currentTime, [
        {
          maintenance_start_time: {},
          maintenance_stop_time: {}
        }
      ])
    ).toBeFalsy();
    expect(
      checkTimeInWithMaintenanceTime(currentTime, [
        {
          maintenance_start_time: {
            hour: 12
          },
          maintenance_stop_time: {
            hour: 12
          }
        }
      ])
    ).toBeTruthy();
    expect(
      checkTimeInWithMaintenanceTime(currentTime, [
        {
          maintenance_start_time: {
            hour: 12,
            minute: 30
          },
          maintenance_stop_time: {
            hour: 12,
            minute: 40
          }
        }
      ])
    ).toBeTruthy();
    expect(
      checkTimeInWithMaintenanceTime(currentTime, [
        {
          maintenance_start_time: {
            hour: 10
          },
          maintenance_stop_time: {
            hour: 12,
            minute: 40
          }
        }
      ])
    ).toBeTruthy();
    expect(
      checkTimeInWithMaintenanceTime(currentTime, [
        {
          maintenance_start_time: {
            hour: 12,
            minute: 34
          },
          maintenance_stop_time: {
            hour: 12
          }
        }
      ])
    ).toBeTruthy();
    expect(
      checkTimeInWithMaintenanceTime(currentTime, [
        {
          maintenance_start_time: {
            hour: 12
          },
          maintenance_stop_time: {
            hour: 13,
            minute: 34
          }
        }
      ])
    ).toBeTruthy();
    expect(
      checkTimeInWithMaintenanceTime(currentTime, [
        {
          maintenance_start_time: {
            hour: 10
          },
          maintenance_stop_time: {
            hour: 15
          }
        }
      ])
    ).toBeTruthy();
  });
});
