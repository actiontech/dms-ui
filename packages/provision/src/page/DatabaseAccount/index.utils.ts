import { IListDBAccount } from '@actiontech/shared/lib/api/provision/service/common';

export const accountNameRender = (account: IListDBAccount['account_info']) => {
  if (!account?.hostname) {
    return account?.user ?? '-';
  }
  return `${account?.user}@${account.hostname}`;
};
