import {
  ViewDatabaseReplyStatusEnum,
  ViewServerReplyStatusEnum
} from '../../../api/common.enum';

export const searchServerMonitorListData = [
  {
    created_at: '2023-11-03T10:01:43.543+08:00',
    host: '172.20.134.1',
    id: '2',
    name: 'test12',
    password: '123',
    port: 22,
    status: ViewServerReplyStatusEnum.unhealthy,
    user: 'admin'
  }
];

export const serverMonitorListData = [
  {
    created_at: '2023-11-03T09:49:00.106+08:00',
    host: '172.20.134.1',
    id: '1',
    name: 'test',
    password: '123456',
    port: 22,
    status: ViewServerReplyStatusEnum.healthy,
    user: 'test'
  },
  ...searchServerMonitorListData,
  {
    created_at: '2023-11-03T10:02:51.132+08:00',
    host: '172.20.134.10',
    id: '3',
    name: 'udp',
    password: '123',
    port: 22,
    status: ViewServerReplyStatusEnum.unknown,
    user: 'test'
  }
];

export const databaseMonitorListData = [
  {
    created_at: '2023-11-03T10:02:51.132+08:00',
    monitor_type: 'MySQL',
    host: '172.20.134.1',
    monitor_name: 'first',
    port: 22,
    status: ViewDatabaseReplyStatusEnum.healthy,
    id: '1731574922989273088',
    username: 'root'
  },
  {
    created_at: '2023-11-03T10:02:51.132+08:00',
    monitor_type: 'MySQL',
    host: '172.20.134.2',
    monitor_name: 'second',
    port: 22,
    id: '1731574922989273089',
    username: 'root',
    status: ViewDatabaseReplyStatusEnum.unhealthy
  },
  {
    created_at: '2023-11-03T10:02:51.132+08:00',
    monitor_type: 'MySQL',
    host: '172.20.134.3',
    monitor_name: 'third',
    port: 22,
    id: '1731574922989273090',
    username: 'root',
    status: ViewDatabaseReplyStatusEnum.unknown
  }
];

export const monitorRoutineListData = [
  {
    desc: 'mysql status 监控',
    enable: true,
    id: '1731574922997661696',
    interval: 15,
    monitor_id: 1,
    monitor_name: 'mysql_status',
    via: 'show global status'
  },
  {
    desc: 'mysql 内存监控',
    enable: false,
    id: '1731574922997661697',
    interval: 15,
    monitor_id: 2,
    monitor_name: 'mysql_mem',
    via: '/proc/{mysql_pid}/status'
  }
];

export const monitorRoutineMetricsListData = [
  {
    desc: 'mysql状态值Com_*/mysql status value Com_',
    metric_key: 'mysql:server_status:commands'
  }
];
