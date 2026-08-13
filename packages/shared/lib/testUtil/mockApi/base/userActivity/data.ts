import { IUserActivitySummary } from '../../../../api/base/service/UserActivity/index.d';

export const mockUserActivitySummary: IUserActivitySummary = {
  dau: 3,
  request_count: 13,
  avg_request_per_user: 4.33,
  error_count: 1,
  error_rate: 1 / 13,
  peak_hour: 9,
  peak_hour_requests: 4
};

export const mockUserActivityDailyTrend = [
  {
    stat_date: '2026-06-20',
    dau: 2,
    request_count: 5,
    error_count: 0
  },
  {
    stat_date: '2026-06-21',
    dau: 2,
    request_count: 6,
    error_count: 0
  },
  {
    stat_date: '2026-06-22',
    dau: 3,
    request_count: 13,
    error_count: 1
  }
];

export const mockUserActivityModuleDistribution = [
  {
    module_code: 'WORKBENCH',
    module_name: 'SQL工作台',
    request_count: 4,
    percent: 4 / 13
  },
  {
    module_code: 'WORKFLOW',
    module_name: 'SQL工单',
    request_count: 2,
    percent: 2 / 13
  },
  {
    module_code: 'SQL_AUDIT',
    module_name: '快捷审核',
    request_count: 2,
    percent: 2 / 13
  }
];

export const mockUserActivityHourlyDistribution = Array.from(
  { length: 24 },
  (_, hour) => ({
    stat_hour: hour,
    request_count: hour === 9 ? 4 : hour < 3 ? 1 : 0,
    active_users: hour === 9 ? 2 : hour < 3 ? 1 : 0
  })
);

export const mockUserActivityUsers = [
  {
    user_uid: 'u1',
    user_name: 'admin',
    active_days: 3,
    request_count: 6,
    top_module_code: 'WORKBENCH',
    top_module_name: 'SQL工作台',
    last_active_at: '2026-06-22T09:30:00Z'
  },
  {
    user_uid: 'u2',
    user_name: 'tester',
    active_days: 2,
    request_count: 4,
    top_module_code: 'WORKFLOW',
    top_module_name: 'SQL工单',
    last_active_at: '2026-06-22T08:15:00Z'
  }
];
