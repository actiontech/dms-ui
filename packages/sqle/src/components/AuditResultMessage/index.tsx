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
  CloseCircleFilled,
  PartialHexagonFilled
} from '@actiontech/icons';
import { getAuditTaskSQLsV2FilterAuditStatusEnum } from '@actiontech/shared/lib/api/sqle/service/task/index.enum';

const passStatusLevelData = ['normal', 'UNKNOWN'];

const isSqlTaskAuditInProgress = (auditStatus?: string) =>
  auditStatus === getAuditTaskSQLsV2FilterAuditStatusEnum.initialized ||
  auditStatus === getAuditTaskSQLsV2FilterAuditStatusEnum.doing;

const hasMeaningfulAuditContent = (
  auditResult?: AuditResultMessageProps['auditResult']
) => {
  if (!auditResult) {
    return false;
  }
  const { message, level, annotation, rule_name } = auditResult;
  if (message) {
    return true;
  }
  if (level !== undefined && level !== '') {
    return true;
  }
  if (annotation) {
    return true;
  }
  if (rule_name) {
    return true;
  }
  return false;
};

const AuditResultMessage = ({
  auditResult,
  styleClass,
  showAnnotation,
  moreBtnLink,
  isRuleDeleted,
  auditStatus
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

  const auditPendingCopy = useMemo(() => {
    if (auditStatus === getAuditTaskSQLsV2FilterAuditStatusEnum.initialized) {
      return t('audit.auditStatus.initialized');
    }
    return t('audit.auditStatus.doing');
  }, [auditStatus, t]);

  if (!hasMeaningfulAuditContent(auditResult)) {
    if (isSqlTaskAuditInProgress(auditStatus)) {
      return (
        <AuditResultMessageStyleWrapper className={classNames([styleClass])}>
          <span className="icon-wrapper">
            <PartialHexagonFilled />
          </span>
          <span className="text-wrapper">{auditPendingCopy}</span>
        </AuditResultMessageStyleWrapper>
      );
    }
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
  }

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
          (!!auditResult?.annotation || !!moreBtnLink)
        }
      >
        <div className="annotation-wrapper">
          {auditResult?.annotation}
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
