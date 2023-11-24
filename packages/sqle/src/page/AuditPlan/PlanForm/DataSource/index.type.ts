import { FormInstance } from 'antd';
import { PlanFormField } from '../index.type';
import { IAuditPlanResV1 } from '@actiontech/shared/lib/api/sqle/service/common';

export type DataSourceProps = {
  form: FormInstance<PlanFormField>;
  dataSource: string;
  defaultValue?: IAuditPlanResV1;
  dbTypeChange?: (dbType: string) => void;
  dataSourceChange?: (dataSource: string) => void;
  projectName: string;
};
