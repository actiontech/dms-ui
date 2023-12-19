import {
  ActiontechTableFilterMeta,
  ActiontechTableFilterMetaValue
} from '@actiontech/shared/lib/components/ActiontechTable';
import { IViewScope } from '../../../../api/common';
import { t } from '../../../../locale';
import { IV1ListExistingScopesParams } from '../../../../api/auth/index.d';

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
