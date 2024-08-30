import {
  pipelineNodeBaseTypeEnum,
  pipelineNodeDetailObjectTypeEnum,
  pipelineNodeDetailAuditMethodEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { t } from '../../../../locale/index';

export const PipelineNodeTypeDictionary: {
  [key in pipelineNodeBaseTypeEnum]: string;
} = {
  [pipelineNodeBaseTypeEnum.audit]: t(
    'pipelineConfiguration.form.node.typeDictionary.audit'
  ),
  [pipelineNodeBaseTypeEnum.release]: t(
    'pipelineConfiguration.form.node.typeDictionary.release'
  )
};

export const PipelineNodeObjectTypeDictionary: {
  [key in pipelineNodeDetailObjectTypeEnum]: string;
} = {
  [pipelineNodeDetailObjectTypeEnum.mybatis]: t(
    'pipelineConfiguration.form.node.auditObjectTypeDictionary.mybatis'
  ),
  [pipelineNodeDetailObjectTypeEnum.sql]: t(
    'pipelineConfiguration.form.node.auditObjectTypeDictionary.sql'
  )
};

export const PipelineNodeAuditMethodDictionary: {
  [key in pipelineNodeDetailAuditMethodEnum]: string;
} = {
  [pipelineNodeDetailAuditMethodEnum.offline]: t(
    'pipelineConfiguration.form.node.auditMethodDictionary.offline'
  ),
  [pipelineNodeDetailAuditMethodEnum.online]: t(
    'pipelineConfiguration.form.node.auditMethodDictionary.online'
  )
};

export const PipelineNodeTypeOptions: Array<{
  label: string;
  value: pipelineNodeBaseTypeEnum;
}> = [
  {
    label: PipelineNodeTypeDictionary[pipelineNodeBaseTypeEnum.audit],
    value: pipelineNodeBaseTypeEnum.audit
  }
  // 一期不处理上线类型
  // {
  //   label: PipelineNodeTypeDictionary[pipelineNodeBaseTypeEnum.release],
  //   value: pipelineNodeBaseTypeEnum.release
  // }
];

export const PipelineNodeObjectTypeOptions: Array<{
  label: string;
  value: pipelineNodeDetailObjectTypeEnum;
}> = [
  {
    label:
      PipelineNodeObjectTypeDictionary[
        pipelineNodeDetailObjectTypeEnum.mybatis
      ],
    value: pipelineNodeDetailObjectTypeEnum.mybatis
  },
  {
    label:
      PipelineNodeObjectTypeDictionary[pipelineNodeDetailObjectTypeEnum.sql],
    value: pipelineNodeDetailObjectTypeEnum.sql
  }
];

export const PipelineNodeAuditMethodOptions: Array<{
  label: string;
  value: pipelineNodeDetailAuditMethodEnum;
}> = [
  {
    label:
      PipelineNodeAuditMethodDictionary[
        pipelineNodeDetailAuditMethodEnum.offline
      ],
    value: pipelineNodeDetailAuditMethodEnum.offline
  },
  {
    label:
      PipelineNodeAuditMethodDictionary[
        pipelineNodeDetailAuditMethodEnum.online
      ],
    value: pipelineNodeDetailAuditMethodEnum.online
  }
];
