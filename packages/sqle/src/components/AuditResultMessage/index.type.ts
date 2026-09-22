import { IAuditResult } from '@actiontech/shared/lib/api/sqle/service/common';
import { AuditResultDisplayMode } from './getAuditResultDisplayText';

/**
 * Swagger 类型 `IAuditResult` 之外、业务侧常用的补丁字段。
 * 统一定义在此处避免在多个组件里重复手工拼接。
 */
export type AuditResultExtra = {
  annotation?: string;
  desc?: string;
  /**
   * 结果项错误优先级（正交于 level；swagger 未再生前由此扩展）。
   * 取值 P0 / P1 / 空；仅 level=error 时有展示意义。
   */
  error_priority?: string;
  i18n_audit_result_info?: Record<
    string,
    {
      message?: string;
      error_info?: string;
    }
  >;
  /** Only for skipped-by-exception display payloads (not on audit_result). */
  exception_id?: number | null;
};

export type IAuditResultWithExtra = IAuditResult & AuditResultExtra;

export type AuditResultMessageMoreBtnPlacement = 'annotation' | 'descRow';

export type AuditResultMessageProps = {
  auditResult?: IAuditResultWithExtra;
  styleClass?: string;
  showAnnotation?: boolean;
  defaultAnnotationExpanded?: boolean;
  moreBtnLink?: string;
  moreBtnPlacement?: AuditResultMessageMoreBtnPlacement;
  isRuleDeleted?: boolean;
  auditStatus?: string;
  displayMode?: AuditResultDisplayMode;
};

export type AuditResultInfoItem = {
  level: string;
  executionFailed: boolean;
  /** 与 level 正交；error+P0 / error+P1 须可区分展示 */
  error_priority?: string;
};

export type ResultIconRenderProps = {
  iconLevels?: string[];
  auditResultInfo?: AuditResultInfoItem[];
};
