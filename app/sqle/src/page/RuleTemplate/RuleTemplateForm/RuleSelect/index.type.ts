import { IRuleResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import { FormInstance } from 'antd';
import { RuleFilterFieldsType } from '../../../../components/RuleList';

export type RuleSelectProps = {
  listLoading: boolean;
  allRules: IRuleResV1[];
  activeRule: IRuleResV1[];
  filteredRule: IRuleResV1[];
  updateActiveRule: (value: IRuleResV1[]) => void;
  updateFilteredRule: (value: IRuleResV1[]) => void;
  dbType: string | undefined;
  formSubmitLoading?: boolean;
  ruleFilterForm: FormInstance<RuleFilterFieldsType>;
  filterCategoryTags?: string;
};
