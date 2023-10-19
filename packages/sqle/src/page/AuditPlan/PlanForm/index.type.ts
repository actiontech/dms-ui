import { FormInstance } from 'antd5';
import { FormItem } from '../../../components/BackendForm';
import { IAuditPlanResV1 } from '@actiontech/shared/lib/api/sqle/service/common';

export type PlanFormField = {
  name: string;
  dbType: string;
  cron: string;
  auditTaskType: string;
  databaseName?: string;
  schema?: string;
  ruleTemplateName?: string;
  params?: {
    [key: string]: string | boolean;
  };
  asyncParams?: FormItem[];
};

export type PlanFormProps = {
  projectName: string;
  title: string;
  form: FormInstance<PlanFormField>;
  submitLoading: boolean;
  submit: (data: PlanFormField) => Promise<void>;
  defaultValue?: IAuditPlanResV1;
};
