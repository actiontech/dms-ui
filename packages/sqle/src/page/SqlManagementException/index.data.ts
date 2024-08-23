import { t } from '../../locale';
import { BlacklistResV1TypeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';

export const SqlManagementExceptionMatchTypeDirection: {
  [key in BlacklistResV1TypeEnum]: string;
} = {
  [BlacklistResV1TypeEnum.sql]: t('sqlManagementException.matchType.sql'),
  [BlacklistResV1TypeEnum.fp_sql]: t(
    'sqlManagementException.matchType.fingerPrint'
  ),
  [BlacklistResV1TypeEnum.ip]: t('sqlManagementException.matchType.ip'),
  [BlacklistResV1TypeEnum.cidr]: t('sqlManagementException.matchType.cidr'),
  [BlacklistResV1TypeEnum.host]: t('sqlManagementException.matchType.host'),
  [BlacklistResV1TypeEnum.instance]: t(
    'sqlManagementException.matchType.instance'
  )
};

export const SqlManagementExceptionMatchTypeOptions: Array<{
  label: string;
  value: BlacklistResV1TypeEnum;
}> = [
  {
    label: SqlManagementExceptionMatchTypeDirection[BlacklistResV1TypeEnum.sql],
    value: BlacklistResV1TypeEnum.sql
  },
  {
    label:
      SqlManagementExceptionMatchTypeDirection[BlacklistResV1TypeEnum.fp_sql],
    value: BlacklistResV1TypeEnum.fp_sql
  },
  {
    label: SqlManagementExceptionMatchTypeDirection[BlacklistResV1TypeEnum.ip],
    value: BlacklistResV1TypeEnum.ip
  },
  {
    label:
      SqlManagementExceptionMatchTypeDirection[BlacklistResV1TypeEnum.cidr],
    value: BlacklistResV1TypeEnum.cidr
  },
  {
    label:
      SqlManagementExceptionMatchTypeDirection[BlacklistResV1TypeEnum.host],
    value: BlacklistResV1TypeEnum.host
  },
  {
    label:
      SqlManagementExceptionMatchTypeDirection[BlacklistResV1TypeEnum.instance],
    value: BlacklistResV1TypeEnum.instance
  }
];
