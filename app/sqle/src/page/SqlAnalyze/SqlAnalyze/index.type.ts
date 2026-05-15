import { ISQLExplain } from '@actiontech/shared/lib/api/sqle/service/common';

export type SQLExecPlanItem = {
  id: string;
  hide: boolean;
} & ISQLExplain;
