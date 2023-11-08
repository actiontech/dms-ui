// eslint-disable-next-line import/no-anonymous-default-export
export default {
  title: '监控源配置',
  monitorSourceName: '监控源名',
  monitorSourceType: '监控源类型',
  serverMonitor: {
    serverMonitorSource: '服务器监控源',
    serverIp: '主机IP',
    sshPort: 'SSH端口',
    sshUser: 'SSH用户名',
    sshPassword: 'SSH用户密码',
    creationTime: '创建时间',
    addServerMonitorSource: '添加服务器监控源',
    updateServerMonitorSource: '修改服务器监控源',
    addServerMonitorSourceTip: '添加服务器监控源{{name}}成功！',
    updateServerMonitorSourceTip: '修改服务器监控源{{name}}成功！'
  },
  databaseMonitor: {
    databaseMonitorSource: '数据库监控源',
    dataSourceName: '数据源名',
    databaseIp: '数据库IP',
    databasePort: '数据库端口',
    addDatabaseMonitorSource: '添加数据库监控源',
    updateDatabaseMonitorSource: '修改数据库监控源',
    addDatabaseMonitorSourceTip: '添加数据库监控源{{name}}成功！',
    updateDatabaseMonitorSourceTip: '添加数据库监控源{{name}}成功！'
  },
  status: {
    normal: '正常',
    abnormal: '异常',
    unknown: '未知'
  }
};
