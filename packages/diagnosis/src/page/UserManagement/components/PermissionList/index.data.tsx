import { ActiontechTableColumn } from '@actiontech/shared/lib/components/ActiontechTable/index.type';
import { t } from '../../../../locale';
import { IViewScope } from '../../../../api/common';
import { IV1ListExistingScopesParams } from '../../../../api/auth/index.d';
import {
  ActiontechTableFilterMeta,
  ActiontechTableFilterMetaValue
} from '@actiontech/shared/lib/components/ActiontechTable';

export const PermissionListColumns: ActiontechTableColumn<
  IViewScope,
  IV1ListExistingScopesParams
> = [
  {
    dataIndex: 'scope_desc',
    title: () => t('userManagement.operationPermissionName')
  }
];

export const ExtraFilterMeta: (
  hasDefaultFilterInfo?: boolean
) => ActiontechTableFilterMeta<
  IViewScope & {
    role_id?: string;
  },
  IV1ListExistingScopesParams
> = (hasDefaultFilterInfo?: boolean) => {
  return new Map<
    keyof (IViewScope & {
      role_id?: string;
    }),
    ActiontechTableFilterMetaValue<IV1ListExistingScopesParams>
  >([
    [
      'role_id',
      {
        filterCustomType: 'select',
        filterKey: 'role_id',
        filterLabel: t('userManagement.roleName'),
        checked: hasDefaultFilterInfo ?? false
      }
    ]
  ]);
};
