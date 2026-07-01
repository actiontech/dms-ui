import { IAuditResult } from '@actiontech/shared/lib/api/sqle/service/common';
import { AuditResultDisplayMode } from './getAuditResultDisplayText';
import { IAuditResultWithExemption } from '../../page/RuleException/index.type';

/**
 * Swagger 类型 `IAuditResult` 之外、业务侧常用的补丁字段。
 * 统一定义在此处避免在多个组件里重复手工拼接。
 */
export type AuditResultExtra = {
  annotation?: string;
  desc?: string;
  i18n_audit_result_info?: Record<
    string,
    {
      message?: string;
      error_info?: string;
    }
  >;
  is_exempted?: boolean;
  exception_id?: number | null;
};

export type IAuditResultWithExtra = IAuditResult &
  AuditResultExtra &
  IAuditResultWithExemption;

export type AuditResultMessageMoreBtnPlacement = 'annotation' | 'descRow';

export type AuditResultMessageProps = {
  auditResult?: IAuditResultWithExtra;
  styleClass?: string;
  showAnnotation?: boolean;
  moreBtnLink?: string;
  moreBtnPlacement?: AuditResultMessageMoreBtnPlacement;
  isRuleDeleted?: boolean;
  auditStatus?: string;
  displayMode?: AuditResultDisplayMode;
};

export type AuditResultInfoItem = {
  level: string;
  executionFailed: boolean;
};

export type ResultIconRenderProps = {
  iconLevels?: string[];
  auditResultInfo?: AuditResultInfoItem[];
};
