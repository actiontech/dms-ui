import type { FC, ReactNode } from 'react';
import { Space } from 'antd';
import {
  WarningFilled,
  InfoHexagonFilled,
  CloseCircleFilled
} from '@actiontech/icons';

/** 与 AuditLevelSummary / 列表「当前审核结果」列同源 */
export const AUDIT_LEVEL_ICON_MAP: Record<
  string,
  FC<{ width?: number; height?: number }>
> = {
  error: CloseCircleFilled,
  warn: WarningFilled,
  notice: InfoHexagonFilled
};

export type AuditLevelIconProps = {
  level?: string;
  width?: number;
  height?: number;
};

const AuditLevelIcon = ({
  level,
  width = 14,
  height = 14
}: AuditLevelIconProps) => {
  if (!level) {
    return null;
  }
  const Icon = AUDIT_LEVEL_ICON_MAP[level];
  if (!Icon) {
    return null;
  }
  return (
    <span className={`audit-level-icon audit-level-icon-${level}`}>
      <Icon width={width} height={height} />
    </span>
  );
};

export const AuditLevelRuleOptionLabel = ({
  level,
  text
}: {
  level?: string;
  text?: ReactNode;
}) => (
  <Space size={6}>
    <AuditLevelIcon level={level} />
    <span>{text}</span>
  </Space>
);

export default AuditLevelIcon;
