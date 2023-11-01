import { ViewServerReplyStatusEnum } from '@actiontech/shared/lib/api/diagnosis/service/common.enum';

export const serverMonitorListData = [
  {
    createdAt: '2023-11-01 16:00:00',
    host: '172.20.134.1',
    name: 'test',
    password: '123',
    port: 22,
    status: ViewServerReplyStatusEnum.healthy,
    user: 'root'
  },
  {
    createdAt: '2023-11-01 16:00:00',
    host: '172.20.134.2',
    name: 'test12',
    password: '123',
    port: 22,
    status: ViewServerReplyStatusEnum.unhealthy,
    user: 'root'
  },
  {
    createdAt: '2023-11-01 16:00:00',
    host: '172.20.134.3',
    name: 'test34',
    password: '123',
    port: 22,
    status: ViewServerReplyStatusEnum.unknown,
    user: 'root'
  }
];

export const databaseMonitorListData = [];
