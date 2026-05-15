import { IGateway, IUidWithName } from '../../../../api/base/service/common';

export const mockGatewayListData: IGateway[] = [
  {
    gateway_id: '1',
    gateway_name: 'test',
    gateway_address: '127.0.0.1',
    gateway_desc: 'test'
  },
  {
    gateway_id: '2',
    gateway_name: 'test2',
    gateway_address: '127.0.0.2',
    gateway_desc: 'test2'
  }
];

export const mockGatewayTipsData: IUidWithName[] = [
  {
    uid: '1',
    name: 'test'
  },
  {
    uid: '2',
    name: 'test2'
  }
];
