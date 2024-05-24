import { AuditTaskResV1AuditLevelEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { CustomSegmentedFilterProps } from '@actiontech/shared/lib/components/CustomSegmentedFilter/index.type';

export type AuditResultFilterContainerProps<
  T extends string | number | undefined = string
> = {
  className?: string;
  passRate?: number;
  score?: number;
  instanceSchemaName?: string;
  auditLevel?: AuditTaskResV1AuditLevelEnum;
} & Omit<CustomSegmentedFilterProps<T>, 'noStyle' | 'className'>;
