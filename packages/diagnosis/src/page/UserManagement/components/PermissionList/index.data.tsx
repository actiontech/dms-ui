import { ActiontechTableColumn } from '@actiontech/shared/lib/components/ActiontechTable/index.type';
import { t } from '../../../../locale';
import { IViewScope } from '../../../../api/common';

export const PermissionListColumns: ActiontechTableColumn<IViewScope> = [
  {
    dataIndex: 'scope_desc',
    title: () => t('userManagement.operationPermissionName')
  }
];
