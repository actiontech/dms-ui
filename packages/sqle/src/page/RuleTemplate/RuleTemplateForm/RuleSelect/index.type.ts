import { IRuleResV1 } from '@actiontech/shared/lib/api/sqle/service/common';

export type RuleSelectProps = {
  listLoading: boolean;
  allRules: IRuleResV1[];
  activeRule: IRuleResV1[];
  updateActiveRule: (value: IRuleResV1[]) => void;
  dbType: string | undefined;
  formSubmitLoading?: boolean;
};
