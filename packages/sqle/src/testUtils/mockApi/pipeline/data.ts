import { IPipelineDetail } from '@actiontech/shared/lib/api/sqle/service/common';

export const mockPipelineListData: IPipelineDetail[] = [
  {
    id: 1,
    name: 'pipeline1',
    address: '127.0.0.1',
    description: 'desc',
    node_count: 2
  },
  {
    id: 2,
    name: 'pipeline1',
    node_count: 2
  }
];
