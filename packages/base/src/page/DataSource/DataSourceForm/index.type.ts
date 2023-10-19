import { FormInstance } from 'antd5';
import {
  BackendFormRequestParams,
  BackendFormValues
} from 'sqle/src/components/BackendForm';
import { MaintenanceTimeValue } from './MaintenanceTimePicker';
import {
  DBServiceDbTypeEnum,
  SQLQueryConfigAllowQueryWhenLessThanAuditLevelEnum
} from '@actiontech/shared/lib/api/base/service/common.enum';
import { IListDBService } from '@actiontech/shared/lib/api/base/service/common';

export type DataSourceFormField = {
  name: string;
  describe?: string;
  type: DBServiceDbTypeEnum;
  ip: string;
  port: number;
  user: string;
  password: string;
  business: string;
  maintenanceTime: MaintenanceTimeValue[];
  ruleTemplateId?: string;
  ruleTemplateName?: string;
  allowQueryWhenLessThanAuditLevel?: SQLQueryConfigAllowQueryWhenLessThanAuditLevelEnum;
  needAuditForSqlQuery?: boolean;
  params?: BackendFormValues;
  asyncParams?: BackendFormRequestParams[];
  needUpdatePassword?: boolean;
};

export type IDataSourceFormProps = {
  form: FormInstance<DataSourceFormField>;
  isUpdate?: boolean;
  defaultData?: IListDBService;
  submit: (values: DataSourceFormField) => Promise<void>;
};
