import {
  IAuditPlanMetaV1,
  IAuditPlanParamResV1
} from '@actiontech/shared/lib/api/sqle/service/common';
import { createContext } from 'react';
import { SqlManagementConfFormFields } from './index.type';

type SelectScanTypeParamsType = Array<Record<string, IAuditPlanParamResV1[]>>;

type ConfFormContextType = {
  submitLoading: boolean | null;
  scanTypeMetas: IAuditPlanMetaV1[] | null;
  getScanTypeMetaPending: boolean | null;
  selectedScanTypeParams: SelectScanTypeParamsType;
  defaultValue?: SqlManagementConfFormFields;
};

const ConfFormContext = createContext<ConfFormContextType | null>(null);

ConfFormContext.displayName = 'SQLManagementConfFormContext';

const ConfFormContextProvide = ConfFormContext.Provider;

export { ConfFormContext, ConfFormContextProvide };

export type { ConfFormContextType, SelectScanTypeParamsType };
