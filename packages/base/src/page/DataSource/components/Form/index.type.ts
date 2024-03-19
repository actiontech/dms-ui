import { FormInstance } from 'antd';
import {
  BackendFormRequestParams,
  BackendFormValues
} from 'sqle/src/components/BackendForm';
import { MaintenanceTimeValue } from './MaintenanceTimePicker';
import { SQLQueryConfigAllowQueryWhenLessThanAuditLevelEnum } from '@actiontech/shared/lib/api/base/service/common.enum';
import { IListDBService } from '@actiontech/shared/lib/api/base/service/common';

export type DataSourceFormField = {
  name: string;
  describe?: string;
  type: string;
  ip: string;
  port: number;
  user: string;
  password: string;
  business: string;
  maintenanceTime: MaintenanceTimeValue[];
  needSqlAuditService?: boolean;
  ruleTemplateId?: string;
  ruleTemplateName?: string;
  allowQueryWhenLessThanAuditLevel?: SQLQueryConfigAllowQueryWhenLessThanAuditLevelEnum;
  needAuditForSqlQuery?: boolean;
  params?: BackendFormValues;
  asyncParams?: BackendFormRequestParams[];
  needUpdatePassword?: boolean;
  is_enable_masking?: boolean;
};

export type IDataSourceFormProps = {
  form: FormInstance<DataSourceFormField>;
  isUpdate?: boolean;
  defaultData?: IListDBService;
  submit: (values: DataSourceFormField) => Promise<void>;
};
