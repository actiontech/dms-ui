import {
  IPipelineDetail,
  IPipelineDetailData
} from '@actiontech/shared/lib/api/sqle/service/common';
import {
  pipelineNodeDetailObjectTypeEnum,
  pipelineNodeDetailAuditMethodEnum,
  pipelineNodeDetailTypeEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';

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

export const mockPipelineDetailData: IPipelineDetailData = {
  id: 1,
  name: 'pipeline1',
  address: '127.0.0.1',
  description: 'desc',
  node_count: 2,
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
