import {
  IAuditPlanResV1,
  IAuditPlanParamResV1
} from '@actiontech/shared/lib/api/sqle/service/common';
import { FormInstance } from 'antd5';

export interface ITaskDetail {
  dbType: string;
  form: FormInstance;
  defaultValue?: IAuditPlanResV1;
  updateCurrentTypeParams?: (params?: IAuditPlanParamResV1[]) => void;
}
