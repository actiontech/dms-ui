import { TestFeishuConfigurationAccountTypeEnum } from '@actiontech/shared/lib/api/base/service/common.enum';

export type FormFields = {
  enabled: boolean;
  appKey: string;
  appSecret: string;
};

export type TestFormFields = {
  receiveType: TestFeishuConfigurationAccountTypeEnum;
  receivePhone: string;
  receiveEmail: string;
};
