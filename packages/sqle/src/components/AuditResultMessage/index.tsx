import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import classNames from 'classnames';
import { AuditResultMessageProps } from './index.type';
import {
  IconStatusSuccess,
  IconStatusTip,
  IconStatusWarning,
  IconStatusError
} from '../../icon/AuditPlan';
import {
  AuditResultMessageStyleWrapper,
  AuditResultMessageWithAnnotationStyleWrapper
} from './style';
import { EmptyBox } from '@actiontech/shared';
import { useBoolean } from 'ahooks';
import { Tag, Typography } from 'antd';

const passStatusLevelData = ['normal', 'UNKNOWN'];

const AuditResultMessage = ({
  auditResult,
  styleClass,
  showAnnotation,
  moreBtnLink,
  isRuleDeleted
}: AuditResultMessageProps) => {
  const { t } = useTranslation();
  const [visible, { set }] = useBoolean(true);

  const renderIcon = useMemo(() => {
    const { level } = auditResult || {};
    if (!level || passStatusLevelData.includes(level)) {
      return <IconStatusSuccess />;
    }
    if (level === 'notice') {
      return <IconStatusTip />;
    }
    if (level === 'warn') {
      return <IconStatusWarning />;
    }
    if (level === 'error') {
      return <IconStatusError />;
    }
  }, [auditResult]);

  const renderMessage = useMemo(() => {
    const { level, message } = auditResult || {};
    if (message) return message;
    if (passStatusLevelData.includes(level ?? ''))
      return t('auditPlan.report.status_pass_text');
    return '';
  }, [auditResult, t]);

  if (!auditResult || JSON.stringify(auditResult) === '{}')
    return (
      <AuditResultMessageStyleWrapper className={classNames([styleClass])}>
        <span className="icon-wrapper">
          <IconStatusSuccess />
        </span>
        <span className="text-wrapper">{t('order.operator.sqlReview')}</span>
      </AuditResultMessageStyleWrapper>
    );

  return (
    <AuditResultMessageWithAnnotationStyleWrapper
      className={classNames(styleClass, {
        'has-delete-rule-wrapper': isRuleDeleted
      })}
      showAnnotation={showAnnotation}
    >
      <EmptyBox if={isRuleDeleted}>
        <Tag color="volcano" className="message-rule-disabled">
          {t('sqlAudit.result.deleteRuleTip')}
        </Tag>
      </EmptyBox>
      <AuditResultMessageStyleWrapper onClick={() => set(!visible)}>
        <span className="icon-wrapper">{renderIcon}</span>
        <span className="text-wrapper">{renderMessage}</span>
      </AuditResultMessageStyleWrapper>
      <EmptyBox
        if={
          showAnnotation &&
          visible &&
          (!!auditResult.annotation || !!moreBtnLink)
        }
      >
        <div className="annotation-wrapper">
          {auditResult.annotation}
          {/* #if [ee] */}
          <EmptyBox if={!!moreBtnLink}>
            <Typography.Link target="_blank" href={moreBtnLink}>
              {t('common.showMore')}
            </Typography.Link>
          </EmptyBox>
          {/* #endif */}
        </div>
      </EmptyBox>
    </AuditResultMessageWithAnnotationStyleWrapper>
  );
};

export default AuditResultMessage;
