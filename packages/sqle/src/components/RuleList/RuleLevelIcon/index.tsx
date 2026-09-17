import React from 'react';
import { t } from 'i18next';
import {
  AuditOutlined,
  InfoCircleOutlined,
  WarningOutlined
} from '@ant-design/icons';
import { Tooltip, Space, Typography } from 'antd';
import { RuleResV1LevelEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import {
  getAuditLevelDisplayLabel,
  resolveAuditLevelDisplayMeta,
  resolveRuleConfigErrorPriority
} from '../../AuditResultMessage/errorPriorityDisplay';

import './index.less';

export type typeRuleLevelIcon = {
  ruleLevel?: string;
  /** 正交错误优先级；仅 level=error 时有意义 */
  errorPriority?: string | null;
  iconFontSize?: number;
  onlyShowIcon?: boolean;
};

const RuleLevelIcon: React.FC<typeRuleLevelIcon> = ({
  ruleLevel = RuleResV1LevelEnum.normal,
  errorPriority,
  iconFontSize = 25,
  onlyShowIcon = false
}) => {
  let icon: React.ReactNode;
  const configPriority = resolveRuleConfigErrorPriority(
    ruleLevel,
    errorPriority
  );
  const displayMeta = resolveAuditLevelDisplayMeta(ruleLevel, configPriority);
  const text = getAuditLevelDisplayLabel(
    t,
    ruleLevel,
    configPriority || undefined
  );

  switch (ruleLevel) {
    case RuleResV1LevelEnum.notice:
      icon = (
        <InfoCircleOutlined
          style={{ fontSize: iconFontSize, color: '#3282e6' }}
        />
      );
      break;
    case RuleResV1LevelEnum.warn:
      icon = (
        <WarningOutlined style={{ fontSize: iconFontSize, color: '#ff8c00' }} />
      );
      break;
    case RuleResV1LevelEnum.error:
      icon = (
        <InfoCircleOutlined
          style={{ fontSize: iconFontSize, color: '#f00000' }}
        />
      );
      break;
    default:
      icon = <AuditOutlined style={{ fontSize: iconFontSize }} />;
  }

  const labelText =
    ruleLevel === RuleResV1LevelEnum.error ? text : t(displayMeta.labelKey);

  return onlyShowIcon ? (
    icon
  ) : (
    <Tooltip
      overlay={t<string>('rule.ruleLevelIcon.toolTipsTitle', {
        text: labelText
      })}
      placement="topLeft"
    >
      <Space
        direction="vertical"
        size={1}
        className="sqle-rule-icon"
        align="center"
        data-error-priority={
          ruleLevel === RuleResV1LevelEnum.error
            ? configPriority || undefined
            : undefined
        }
      >
        <div>{icon}</div>
        <Typography.Text type="secondary">{labelText}</Typography.Text>
      </Space>
    </Tooltip>
  );
};

export default RuleLevelIcon;
