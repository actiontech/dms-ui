import { FormInstance } from 'antd5';
import SyncTaskForm from './SyncTaskForm';
import { IListDatabaseSourceService } from '@actiontech/shared/lib/api/base/service/common';

export type SyncTaskFormFields = {
  name: string;
  source: string;
  version: string;
  url: string;
  instanceType: string;
  needSqlAuditService?: boolean;
  ruleTemplateId?: string;
  ruleTemplateName?: string;
  syncInterval: string;
};

export type SyncTaskFormProps = {
  title: React.ReactNode;
  loading?: boolean;
  form: FormInstance<SyncTaskFormFields>;
  defaultValue?: IListDatabaseSourceService;
  projectName: string;
};

export default SyncTaskForm;
