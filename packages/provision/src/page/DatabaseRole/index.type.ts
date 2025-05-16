import { IAuthListDBRoleParams } from '@actiontech/shared/lib/api/provision/service/db_role/index.d';
import { PageInfoWithoutIndexAndSize } from '@actiontech/shared/lib/components/ActiontechTable';

export type IDatabaseRoleTableParams = PageInfoWithoutIndexAndSize<
  Required<IAuthListDBRoleParams>,
  'order_by' | 'filter_by_name' | 'project_uid'
>;
