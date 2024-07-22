import { typeRuleItem } from '../../../../../../hooks/useRuleTemplate';

export interface IAuditTemplateProps {
  templateList: typeRuleItem[];
  loading: boolean;
  prefixPath: string;
  submitLoading: boolean;
}
