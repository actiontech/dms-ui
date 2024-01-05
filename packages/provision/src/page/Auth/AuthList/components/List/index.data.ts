import { AuthListAuthorizationFilterByStatusEnum } from '@actiontech/shared/lib/api/provision/service/auth/index.enum';
import { I18nKey } from '../../../../../locale';

export const AuthStatusDictionary: {
  [k in AuthListAuthorizationFilterByStatusEnum]: I18nKey;
} = {
  [AuthListAuthorizationFilterByStatusEnum.effective]: 'auth.columns.effective',
  [AuthListAuthorizationFilterByStatusEnum.expired]: 'auth.columns.invalid',
  [AuthListAuthorizationFilterByStatusEnum.expiring]: 'auth.columns.expiring'
};
