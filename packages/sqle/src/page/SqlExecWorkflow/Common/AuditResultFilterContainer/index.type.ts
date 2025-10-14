import {
  CustomSegmentedFilterBaseValue,
  CustomSegmentedFilterProps
} from '@actiontech/dms-kit';
import { AuditTaskResV1AuditLevelEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';

export type AuditResultFilterContainerProps<
  T extends CustomSegmentedFilterBaseValue = string
> = {
  className?: string;
  passRate?: number;
  score?: number;
  instanceSchemaName?: string;
  auditLevel?: AuditTaskResV1AuditLevelEnum;
} & Omit<CustomSegmentedFilterProps<T>, 'noStyle' | 'className'>;
