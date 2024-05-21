import { IAuditTaskSQLResV2 } from '@actiontech/shared/lib/api/sqle/service/common';
import {
  ActiontechTableFilterMeta,
  ActiontechTableFilterMetaValue
} from '@actiontech/shared/lib/components/ActiontechTable';
import { t } from 'i18next';
import { GetAuditTaskSQLsPrams } from './index.type';

export const AuditTaskExtraFilterMeta: () => ActiontechTableFilterMeta<
  IAuditTaskSQLResV2 & {
    audit_level?: string;
  },
  GetAuditTaskSQLsPrams
> = () => {
  return new Map<
    keyof (IAuditTaskSQLResV2 & {
      audit_level?: string;
    }),
    ActiontechTableFilterMetaValue<GetAuditTaskSQLsPrams>
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
