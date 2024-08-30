import { IPipelineNodeDetail } from '@actiontech/shared/lib/api/sqle/service/common';
import { FormInstance } from 'antd';

export type PipelineConfigurationFormFields = {
  address: string;
  description: string;
  name: string;
};

export type PipelineNodeFieldProps = {
  value?: IPipelineNodeDetail[];
  onChange?: (value: IPipelineNodeDetail[]) => void;
};

export type PipelineNodeModalProps = {
  visible: boolean;
  editNodeId?: number;
  onCancel: () => void;
  onSubmit: () => void;
  form: FormInstance<IPipelineNodeDetail>;
  nodeNameList: string[];
};
