import { CreateAuditWhitelistReqV1MatchTypeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { FormInstance } from 'antd';

export type WhitelistFormFields = {
  desc?: string;
  sql: string;
  matchType: CreateAuditWhitelistReqV1MatchTypeEnum;
};

export type WhitelistFormProps = {
  form: FormInstance<WhitelistFormFields>;
};
