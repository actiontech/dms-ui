// eslint-disable-next-line import/no-anonymous-default-export
export default {
  title: '用户使用情况',
  statDate: '统计日期',
  dateRange: '趋势区间',
  refresh: '刷新',
  summary: {
    dau: '日活跃用户',
    requestCount: '请求总数',
    avgRequestPerUser: '人均请求数',
    errorRate: '错误率',
    errorCount: '错误请求数',
    peakHour: '高峰时段',
    peakHourRequests: '高峰请求数'
  },
  dailyTrend: {
    title: '日活跃趋势',
    dau: '日活跃用户',
    requestCount: '请求数',
    errorCount: '错误数',
    emptyText: '所选区间暂无数据'
  },
  moduleDistribution: {
    title: '模块访问分布',
    requestCount: '请求数',
    percent: '占比',
    emptyText: '所选日期暂无模块访问数据'
  },
  hourlyDistribution: {
    title: '24 小时访问分布',
    hour: '时段',
    requestCount: '请求数',
    activeUsers: '活跃用户数',
    emptyText: '所选日期暂无时段数据'
  },
  userRanking: {
    title: '用户活跃排行',
    userName: '用户名',
    activeDays: '活跃天数',
    requestCount: '请求数',
    topModule: '最常用模块',
    lastActiveAt: '最近活跃时间',
    emptyText: '所选区间暂无用户活跃数据'
  }
};
