import { ViewServerReplyStatusEnum } from '../../../api/common.enum';

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

export const databaseMonitorListData = [];
