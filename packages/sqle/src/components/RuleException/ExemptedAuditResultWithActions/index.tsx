import { useTranslation } from 'react-i18next';
import { BasicToolTips } from '@actiontech/shared';
import { ExceptionFileOutlined } from '@actiontech/icons';
import { IAuditResultWithExemption } from '../../../page/RuleException/index.type';
import { ISqlManageRuleExceptionContext } from '../../../page/RuleException/index.data';
import AuditResultMessage from '../../AuditResultMessage';
import useRuleExceptionActions from '../useRuleExceptionActions';
import { AuditResultWithRuleExceptionStyleWrapper } from '../AuditResultWithRuleException/style';

type ExemptedAuditResultWithActionsProps = {
  auditResult?: IAuditResultWithExemption;
  sqlManageContext?: ISqlManageRuleExceptionContext;
  onRefresh?: () => void;
};

const ExemptedAuditResultWithActions: React.FC<
  ExemptedAuditResultWithActionsProps
> = ({ auditResult, sqlManageContext, onRefresh }) => {
  const { t } = useTranslation();
  const { navigateToExceptionDetail } = useRuleExceptionActions({
    sqlManageContext,
    onSuccess: onRefresh
  });

  if (!auditResult) {
    return <AuditResultMessage />;
  }

  const exceptionId = auditResult.exception_id;
  const viewDetailDisabled = !exceptionId;

  return (
    <AuditResultWithRuleExceptionStyleWrapper>
      <div className="audit-result-content">
        <AuditResultMessage auditResult={auditResult} />
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
