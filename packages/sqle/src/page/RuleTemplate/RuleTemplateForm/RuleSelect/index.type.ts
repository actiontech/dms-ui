import { IRuleResV1 } from '@actiontech/shared/lib/api/sqle/service/common';

export type RuleSelectProps = {
  listLoading: boolean;
  allRules: IRuleResV1[];
  activeRule: IRuleResV1[];
  filteredRule: IRuleResV1[];
  updateActiveRule: (value: IRuleResV1[]) => void;
  updateFilteredRule: (value: IRuleResV1[]) => void;
  dbType: string | undefined;
  formSubmitLoading?: boolean;
};
