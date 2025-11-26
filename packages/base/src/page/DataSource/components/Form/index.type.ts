import { FormInstance } from 'antd';
import {
  BackendFormRequestParams,
  BackendFormValues
} from '@actiontech/shared';
import { MaintenanceTimeValue } from './MaintenanceTimePicker';
import { SQLQueryConfigAllowQueryWhenLessThanAuditLevelEnum } from '@actiontech/shared/lib/api/base/service/common.enum';
import { IListDBServiceV2 } from '@actiontech/shared/lib/api/base/service/common';

export type DataSourceFormField = {
  name: string;
  describe?: string;
  type: string;
  ip: string;
  port: number;
  user: string;
  password: string;
  project: string;
  environmentTagId: string;
  maintenanceTime: MaintenanceTimeValue[];
  needSqlAuditService?: boolean;
  ruleTemplateId?: string;
  ruleTemplateName?: string;
  allowQueryWhenLessThanAuditLevel?: SQLQueryConfigAllowQueryWhenLessThanAuditLevelEnum;
  needAuditForSqlQuery?: boolean;
  workbenchTemplateId?: string;
  workbenchTemplateName?: string;
  allowExecuteNonDqlInWorkflow?: boolean;
  dataExportRuleTemplateId?: string;
  dataExportRuleTemplateName?: string;
  params?: BackendFormValues;
  asyncParams?: BackendFormRequestParams[];
  needUpdatePassword?: boolean;
  is_enable_masking?: boolean;
  enableBackup?: boolean;
  backupMaxRows?: number;
};

export type IDataSourceFormProps = {
  form: FormInstance<DataSourceFormField>;
  isUpdate?: boolean;
  defaultData?: IListDBServiceV2;
  submit: (values: DataSourceFormField) => Promise<void>;
};
