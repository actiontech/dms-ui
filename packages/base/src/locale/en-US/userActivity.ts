// eslint-disable-next-line import/no-anonymous-default-export
export default {
  title: 'User activity',
  statDate: 'Stat date',
  dateRange: 'Trend range',
  refresh: 'Refresh',
  summary: {
    dau: 'Daily active users',
    requestCount: 'Total requests',
    avgRequestPerUser: 'Avg requests per user',
    errorRate: 'Error rate',
    errorCount: 'Error requests',
    peakHour: 'Peak hour',
    peakHourRequests: 'Peak hour requests'
  },
  dailyTrend: {
    title: 'Daily activity trend',
    dau: 'DAU',
    requestCount: 'Requests',
    errorCount: 'Errors',
    emptyText: 'No data in selected range'
  },
  moduleDistribution: {
    title: 'Module distribution',
    requestCount: 'Requests',
    percent: 'Share',
    emptyText: 'No module data for selected date'
  },
  hourlyDistribution: {
    title: '24-hour distribution',
    hour: 'Hour',
    requestCount: 'Requests',
    activeUsers: 'Active users',
    emptyText: 'No hourly data for selected date'
  },
  userRanking: {
    title: 'User activity ranking',
    userName: 'User',
    activeDays: 'Active days',
    requestCount: 'Requests',
    topModule: 'Top module',
    lastActiveAt: 'Last active',
    emptyText: 'No user activity in selected range'
  }
};
