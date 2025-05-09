import { PageInfoWithoutIndexAndSize } from '@actiontech/shared';
import { IAuthListDBAccountParams } from '@actiontech/shared/lib/api/provision/service/db_account/index.d';

export type DatabaseAccountListFilterParamType = PageInfoWithoutIndexAndSize<
  IAuthListDBAccountParams & {
    page_index: number;
  },
  'project_uid'
>;
