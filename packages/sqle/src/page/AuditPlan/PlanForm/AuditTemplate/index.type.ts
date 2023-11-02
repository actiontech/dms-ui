import { typeRuleItem } from '../../../../hooks/useRuleTemplate';

export interface IAuditTemplateProps {
  dbType: string;
  templateList: typeRuleItem[];
  getRuleTemplateListLoading: boolean;
}
