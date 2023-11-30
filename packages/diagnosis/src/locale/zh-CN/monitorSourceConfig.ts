// eslint-disable-next-line import/no-anonymous-default-export
export default {
  title: '监控源配置',
  monitorSourceName: '监控源名',
  monitorSourceType: '监控源类型',
  sourceType: {
    typeLabel: '监控源类型: {{type}}',
    serverMonitorSource: '服务器监控',
    databaseMonitorSource: '数据库监控'
  },
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
    databaseType: '数据库类型',
    creationTime: '创建时间',
    addDatabaseMonitorSource: '添加数据库监控源',
    deleteDatabaseMonitorSource: '确认删除数据库监控源{{name}}?',
    addDatabaseMonitorSourceTip: '添加数据库监控源{{name}}成功！',
    deleteDatabaseMonitorSourceTip: '删除数据库监控源{{name}}成功！'
  },
  status: {
    normal: '正常',
    abnormal: '异常',
    unknown: '未知',
    enable: '启用',
    disable: '禁用'
  },
  monitorConfig: {
    returnMonitorSource: '返回监控源配置',
    monitorItem: '监控项',
    monitorInterval: '监控周期(ms)',
    monitorVia: '监控命令',
    monitorDesc: '描述',
    checkMonitorConfig: '查看',
    monitorKey: '监控指标'
  }
};
