import { ActiontechTableColumn } from '@actiontech/shared/lib/components/ActiontechTable/index.type';
import { t } from '../../../../locale';
import { IViewScope } from '../../../../api/common';
import { IV1ListExistingScopesParams } from '../../../../api/auth/index.d';

export const PermissionListColumns: ActiontechTableColumn<
  IViewScope,
  IV1ListExistingScopesParams
> = [
  {
    dataIndex: 'scope_desc',
    title: () => t('userManagement.operationPermissionName')
  }
];
