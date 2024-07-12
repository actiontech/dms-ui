import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import classNames from 'classnames';
import { AuditResultMessageProps } from './index.type';
import {
  AuditResultMessageStyleWrapper,
  AuditResultMessageWithAnnotationStyleWrapper
} from './style';
import { EmptyBox } from '@actiontech/shared';
import { useBoolean } from 'ahooks';
import { Tag, Typography } from 'antd';
import {
  CheckCircleFilled,
  WarningFilled,
  InfoHexagonFilled,
  CloseCircleFilled
} from '@actiontech/icons';

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
      return <CheckCircleFilled width={20} height={20} />;
    }
    if (level === 'notice') {
      return <InfoHexagonFilled width={20} height={20} />;
    }
    if (level === 'warn') {
      return <WarningFilled width={20} height={20} />;
    }
    if (level === 'error') {
      return <CloseCircleFilled width={20} height={20} />;
    }
  }, [auditResult]);

  const renderMessage = useMemo(() => {
    const { level, message } = auditResult || {};
    if (message) return message;
    if (passStatusLevelData.includes(level ?? ''))
      return t('components.auditResultMessage.auditPassed');
    return '';
  }, [auditResult, t]);

  if (!auditResult || JSON.stringify(auditResult) === '{}')
    return (
      <AuditResultMessageStyleWrapper className={classNames([styleClass])}>
        <span className="icon-wrapper">
          <CheckCircleFilled width={20} height={20} />
        </span>
        <span className="text-wrapper">
          {t('components.auditResultMessage.auditPassed')}
        </span>
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
          {t('components.auditResultMessage.ruleDeleted')}
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
