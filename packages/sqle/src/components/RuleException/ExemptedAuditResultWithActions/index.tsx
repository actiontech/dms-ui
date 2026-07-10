import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { BasicToolTips } from '@actiontech/shared';
import { ExceptionFileOutlined } from '@actiontech/icons';
import { ISkippedByRuleExceptionItem } from '@actiontech/shared/lib/api/sqle/service/common';
import AuditResultMessage from '../../AuditResultMessage';
import { AuditResultMessageProps } from '../../AuditResultMessage/index.type';
import { resolveSkippedRuleExceptionDisplayLevel } from '../../AuditResultMessage/auditLevelUtils';
import {
  buildSkippedRuleExceptionDisplayPayload,
  ExemptedAuditResultDisplayItem
} from '../../AuditResultMessage/auditResultDisplay';
import useRuleExceptionActions from '../useRuleExceptionActions';
import { AuditResultWithRuleExceptionStyleWrapper } from '../AuditResultWithRuleException/style';

type ExemptedAuditResultWithActionsProps = {
  skippedItem?: ExemptedAuditResultDisplayItem | ISkippedByRuleExceptionItem;
} & Pick<
  AuditResultMessageProps,
  | 'showAnnotation'
  | 'displayMode'
  | 'moreBtnLink'
  | 'isRuleDeleted'
  | 'defaultAnnotationExpanded'
>;

const ExemptedAuditResultWithActions: React.FC<
  ExemptedAuditResultWithActionsProps
> = ({
  skippedItem,
  showAnnotation,
  displayMode,
  moreBtnLink,
  isRuleDeleted,
  defaultAnnotationExpanded
}) => {
  const { t } = useTranslation();
  const { navigateToExceptionDetail } = useRuleExceptionActions();

  const displayAuditResult = useMemo(() => {
    if (!skippedItem) {
      return undefined;
    }

    const level = resolveSkippedRuleExceptionDisplayLevel(skippedItem);
    const payload = buildSkippedRuleExceptionDisplayPayload({
      ...skippedItem,
      level
    });

    return level === (skippedItem.level ?? '')
      ? payload
      : { ...payload, level };
  }, [skippedItem]);

  if (!skippedItem) {
    return <AuditResultMessage />;
  }

  const exceptionId = skippedItem.exception_id;
  const viewDetailDisabled = !exceptionId;

  return (
    <AuditResultWithRuleExceptionStyleWrapper>
      <div className="audit-result-content">
        <AuditResultMessage
          auditResult={displayAuditResult}
          showAnnotation={showAnnotation}
          displayMode={displayMode}
          moreBtnLink={moreBtnLink}
          isRuleDeleted={isRuleDeleted}
          defaultAnnotationExpanded={defaultAnnotationExpanded}
        />
      </div>
      <div className="audit-result-action">
        <BasicToolTips title={t('ruleException.skippedSection.viewDetail')}>
          <ExceptionFileOutlined
            width={16}
            height={16}
            color={viewDetailDisabled ? undefined : 'currentColor'}
            className={
              viewDetailDisabled ? undefined : 'pointer icon-view-detail'
            }
            onClick={(event) => {
              event.stopPropagation();
              if (!viewDetailDisabled) {
                navigateToExceptionDetail(exceptionId);
              }
            }}
          />
        </BasicToolTips>
      </div>
    </AuditResultWithRuleExceptionStyleWrapper>
  );
};

export default ExemptedAuditResultWithActions;
