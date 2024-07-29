import { CustomSegmentedFilterProps } from '@actiontech/shared/lib/components/CustomSegmentedFilter/index.type';

export type SqlStatusFilterContainerProps = {
  auditAction: () => void;
  lastAuditTime: string;
} & CustomSegmentedFilterProps<string>;
