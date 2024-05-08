import { IAuditTaskSQLResV2 } from '@actiontech/shared/lib/api/sqle/service/common';
import {
  ActiontechTableFilterMeta,
  ActiontechTableFilterMetaValue
} from '@actiontech/shared/lib/components/ActiontechTable';
import { GetAuditTaskPrams } from './index.type';
import { t } from '../../../locale';

export const OVERVIEW_TAB_KEY = 'OVERVIEW_TAB_KEY';

export const AuditTaskExtraFilterMeta: () => ActiontechTableFilterMeta<
  IAuditTaskSQLResV2 & {
    audit_level?: string;
  },
  GetAuditTaskPrams
> = () => {
  return new Map<
    keyof (IAuditTaskSQLResV2 & {
      audit_level?: string;
    }),
    ActiontechTableFilterMetaValue<GetAuditTaskPrams>
  >([
    [
      'audit_level',
      {
        filterCustomType: 'select',
        filterKey: 'filter_audit_level',
        filterLabel: t('audit.filterForm.highestAuditLevel')
      }
    ]
  ]);
};
