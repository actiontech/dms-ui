import { RuleResV1LevelEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';

export interface IRuleTemplateForm {
  rule_name: string;
  desc: string;
  annotation: string;
  type: string;
  db_type: string;
  level?: RuleResV1LevelEnum;
  params: Record<string, boolean | string>;
}
