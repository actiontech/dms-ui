import { AuditTaskResV1AuditLevelEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';

export type AuditResultFilterOptionsType<T> = {
  value: T;
  label: string;
  // num?: number;
};

export type AuditResultFilterContainerProps<T> = {
  filterOptions: Array<AuditResultFilterOptionsType<T>>;
  passRate?: number;
  score?: number;
  instanceSchemaName?: string;
  filterValue: T;
  filterValueChange: (value: T) => void;
  auditLevel?: AuditTaskResV1AuditLevelEnum;
  bordered?: boolean;
};
