import { TestFeishuConfigurationReqV1AccountTypeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';

export type FormFields = {
  enabled: boolean;
  appKey: string;
  appSecret: string;
};

export type TestFormFields = {
  receiveType: TestFeishuConfigurationReqV1AccountTypeEnum;
  receivePhone: string;
  receiveEmail: string;
};
