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
  PartialHexagonFilled,
  MinusCircleFilled
} from '@actiontech/icons';
import { getAuditTaskSQLsV2FilterAuditStatusEnum } from '@actiontech/shared/lib/api/sqle/service/task/index.enum';
import { getAuditResultDisplayText } from './getAuditResultDisplayText';
import { resolveAuditLevelDisplayMeta } from './errorPriorityDisplay';

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
  defaultAnnotationExpanded = true,
  moreBtnLink,
  moreBtnPlacement = 'annotation',
  isRuleDeleted,
  auditStatus,
  displayMode = 'ruleDesc'
}: AuditResultMessageProps) => {
  const { t, i18n } = useTranslation();

  const showMoreInDescRow = moreBtnPlacement === 'descRow' && !!moreBtnLink;
  const showMoreInAnnotation =
    moreBtnPlacement === 'annotation' && !!moreBtnLink;
  const hasExpandableAnnotation =
    showAnnotation && (!!auditResult?.annotation || showMoreInAnnotation);

  const [visible, { toggle }] = useBoolean(defaultAnnotationExpanded);

  const levelDisplay = useMemo(() => {
    const meta = resolveAuditLevelDisplayMeta(
      auditResult?.level,
      auditResult?.error_priority
    );
    return {
      ...meta,
      label: t(meta.labelKey)
    };
  }, [auditResult?.error_priority, auditResult?.level, t]);

  const renderIcon = useMemo(() => {
    const { iconKey } = levelDisplay;
    if (iconKey === 'normal') {
      return <CheckCircleFilled width={20} height={20} />;
    }
    if (iconKey === 'notice') {
      return <InfoHexagonFilled width={20} height={20} />;
    }
    if (iconKey === 'warn') {
      return <WarningFilled width={20} height={20} />;
    }
    if (iconKey === 'error_P0') {
      return <CloseCircleFilled width={20} height={20} color="#C41D3A" />;
    }
    if (iconKey === 'error_P1') {
      return <MinusCircleFilled width={20} height={20} color="#FA8C16" />;
    }
    if (iconKey === 'error') {
      return <CloseCircleFilled width={20} height={20} />;
    }
    return null;
  }, [levelDisplay]);

  const renderMessage = useMemo(() => {
    const { level } = auditResult || {};
    const displayText = getAuditResultDisplayText(auditResult, t, {
      displayMode,
      i18nInstance: i18n
    });

    if (displayText) {
      return displayText;
    }

    if (passStatusLevelData.includes(level ?? '')) {
      return t('components.auditResultMessage.auditPassed');
    }

    return '';
  }, [auditResult, displayMode, i18n, t]);

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

  const isErrorLevel = (auditResult?.level ?? '').toLowerCase() === 'error';

  return (
    <AuditResultMessageWithAnnotationStyleWrapper
      className={classNames(styleClass, {
        'has-delete-rule-wrapper': isRuleDeleted
      })}
      expandable={hasExpandableAnnotation}
      data-error-priority={
        isErrorLevel ? levelDisplay.dataErrorPriority || 'ungraded' : undefined
      }
      data-icon-key={levelDisplay.iconKey}
    >
      <EmptyBox if={isRuleDeleted}>
        <Tag color="volcano" className="message-rule-disabled">
          {t('components.auditResultMessage.ruleDeleted')}
        </Tag>
      </EmptyBox>
      <AuditResultMessageStyleWrapper
        onClick={hasExpandableAnnotation ? toggle : undefined}
        className={classNames('audit-result-message', {
          [`audit-result-icon-${levelDisplay.iconKey}`]: true
        })}
      >
        <span
          className="icon-wrapper"
          data-error-priority={
            isErrorLevel
              ? levelDisplay.dataErrorPriority || 'ungraded'
              : undefined
          }
          data-icon-key={levelDisplay.iconKey}
          aria-label={levelDisplay.label}
          title={levelDisplay.label}
        >
          {renderIcon}
        </span>
        <EmptyBox if={isErrorLevel}>
          <span
            className={`audit-result-priority-label audit-result-priority-label-${levelDisplay.iconKey}`}
            data-error-priority={levelDisplay.dataErrorPriority || 'ungraded'}
          >
            {levelDisplay.label}
          </span>
        </EmptyBox>
        <span className="text-wrapper">{renderMessage}</span>
        {/* #if [ee] */}
        <EmptyBox if={showMoreInDescRow}>
          <Typography.Link
            className="desc-row-more-link"
            target="_blank"
            href={moreBtnLink}
            onClick={(event) => event.stopPropagation()}
          >
            {t('common.showMore')}
          </Typography.Link>
        </EmptyBox>
        {/* #endif */}
      </AuditResultMessageStyleWrapper>
      <EmptyBox
        if={
          showAnnotation &&
          visible &&
          (!!auditResult?.annotation || showMoreInAnnotation)
        }
      >
        <div className="annotation-wrapper">
          {auditResult?.annotation}
          {/* #if [ee] */}
          <EmptyBox if={showMoreInAnnotation}>
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
