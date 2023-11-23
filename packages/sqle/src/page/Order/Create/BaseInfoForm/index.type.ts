import { ICreateWorkflowV2Params } from '@actiontech/shared/lib/api/sqle/service/workflow/index.d';
import { FormInstance } from 'antd';

export type OrderBaseInfoFormFields = Pick<
  ICreateWorkflowV2Params,
  'desc' | 'workflow_subject'
>;

export type OrderBaseInfoFormProps = {
  form: FormInstance<OrderBaseInfoFormFields>;
};
