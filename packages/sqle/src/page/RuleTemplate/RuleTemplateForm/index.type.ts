import { FormInstance } from 'antd';
import { RuleTemplateBaseInfoFields } from './BaseInfoForm/index.type';
import {
  IRuleProjectTemplateDetailResV1,
  IRuleResV1
} from '@actiontech/shared/lib/api/sqle/service/common';
import { ReactNode } from 'react';
import { RuleFilterFieldsType } from '../../../components/RuleList';

export type RuleTemplateFormProps = {
  mode: 'import' | 'update' | 'create';
  title: string | ReactNode;
  step: number;
  form: FormInstance<RuleTemplateBaseInfoFields>;
  defaultData?: IRuleProjectTemplateDetailResV1;
  dbType: string;
  projectName: string;
  ruleListLoading: boolean;
  activeRule: IRuleResV1[];
  allRules: IRuleResV1[];
  filteredRule: IRuleResV1[];
  updateActiveRule: (value: IRuleResV1[]) => void;
  updateFilteredRule: (value: IRuleResV1[]) => void;
  baseInfoFormSubmitLoading?: boolean;
  submitLoading: boolean;
  baseInfoSubmit: () => void;
  submit: () => void;
  children?: ReactNode;
  ruleFilterForm: FormInstance<RuleFilterFieldsType>;
  filterCategoryTags?: string;
};
