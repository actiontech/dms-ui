import { FormInstance } from 'antd';
import SyncTaskForm from '.';
import { IGetDBServiceSyncTask } from '@actiontech/shared/lib/api/base/service/common';
import { BackendFormValues } from '@actiontech/shared';
import { SQLQueryConfigAllowQueryWhenLessThanAuditLevelEnum } from '@actiontech/shared/lib/api/base/service/common.enum';
import useTaskSource from '../../../hooks/useTaskSource';

export type SyncTaskFormFields = {
  name: string;
  source: string;
  url: string;
  instanceType: string;
  needSqlAuditService?: boolean;
  ruleTemplateId?: string;
  ruleTemplateName?: string;
  syncInterval: string;
  params: BackendFormValues;
  allowQueryWhenLessThanAuditLevel?: SQLQueryConfigAllowQueryWhenLessThanAuditLevelEnum;
  needAuditForSqlQuery?: boolean;
  workbenchTemplateId?: string;
  workbenchTemplateName?: string;
  dataExportRuleTemplateId?: string;
  dataExportRuleTemplateName?: string;
};

export type SyncTaskFormProps = {
  title: React.ReactNode;
  loading?: boolean;
  form: FormInstance<SyncTaskFormFields>;
  defaultValue?: IGetDBServiceSyncTask;
  taskSourceTips: Omit<
    ReturnType<typeof useTaskSource>,
    'updateTaskSourceList'
  >;
};

export default SyncTaskForm;
