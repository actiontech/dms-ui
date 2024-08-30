import { FormInstance } from 'antd';
import { CreateBlacklistReqV1TypeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';

type SqlManagementExceptionMatchType = {
  [key in CreateBlacklistReqV1TypeEnum]?: string;
};

export type SqlManagementExceptionFormFieldType = {
  type: CreateBlacklistReqV1TypeEnum;
  desc?: string;
} & Omit<SqlManagementExceptionMatchType, 'fp_sql'>;

export type SqlManagementExceptionFormProps = {
  form: FormInstance<SqlManagementExceptionFormFieldType>;
  isUpdate?: boolean;
};
