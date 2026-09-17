import { RuleResV1LevelEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';

export interface IRuleTemplateForm {
  rule_name: string;
  desc: string;
  annotation: string;
  type: string;
  db_type: string;
  level?: RuleResV1LevelEnum;
  /** 仅 level=error 时有意义；P0 | P1 */
  error_priority?: string;
  params: Record<string, boolean | string>;
}
