import {
  IPipelineDetail,
  IPipelineDetailData
} from '../../../../api/sqle/service/common';
import {
  pipelineNodeDetailObjectTypeEnum,
  pipelineNodeDetailAuditMethodEnum,
  pipelineNodeDetailTypeEnum
} from '../../../../api/sqle/service/common.enum';

export const mockPipelineListData: IPipelineDetail[] = [
  {
    id: 1,
    name: 'pipeline1',
    address: '127.0.0.1',
    description: 'desc',
    node_count: 2,
    data_sources: ['mysql', 'postgresql', 'mysql-1', 'mysql-2']
  },
  {
    id: 2,
    name: 'pipeline2',
    node_count: 2,
    data_sources: ['mysql']
  },
  {
    id: 3,
    name: 'pipeline3',
    node_count: 2,
    data_sources: []
  },
  {
    id: 4,
    name: 'pipeline4',
    node_count: 2
  }
];

export const mockPipelineDetailData: IPipelineDetailData = {
  id: 1,
  name: 'pipeline1',
  address: '127.0.0.1',
  description: 'desc',
  node_count: 2,
  data_sources: ['mysql', 'postgresql', 'mysql-1', 'mysql-2'],
  nodes: [
    {
      audit_method: pipelineNodeDetailAuditMethodEnum.offline,
      instance_type: 'mysql',
      name: 'node1',
      object_path: '/opt/sqle',
      object_type: pipelineNodeDetailObjectTypeEnum.sql,
      rule_template_name: 'default_MySQL1',
      type: pipelineNodeDetailTypeEnum.audit,
      id: 1,
      integration_info: 'test\n#启动命令#\ninfo'
    }
  ]
};
