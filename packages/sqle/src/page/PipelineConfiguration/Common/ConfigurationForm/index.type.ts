import { IPipelineNodeDetail } from '@actiontech/shared/lib/api/sqle/service/common';
import { FormInstance } from 'antd';
import { ICreatePipelineReqV1 } from '@actiontech/shared/lib/api/sqle/service/common';

export type PipelineConfigurationFormFields = {
  address: string;
  description: string;
  name: string;
};

export type PipelineNodeType = Omit<
  IPipelineNodeDetail,
  'id' | 'integration_info'
> & {
  id: string;
};

export type PipelineFormType = Omit<ICreatePipelineReqV1, 'nodes'> & {
  nodes: PipelineNodeType[];
};

export type PipelineNodeFieldProps = {
  value?: Array<PipelineNodeType>;
  onChange?: (value: Array<PipelineNodeType>) => void;
};

export type PipelineNodeModalProps = {
  visible: boolean;
  editNodeId?: string;
  onCancel: () => void;
  onSubmit: () => void;
  form: FormInstance<PipelineNodeType>;
  nodeNameList: string[];
};
