import { Space } from 'antd';
import { useTranslation } from 'react-i18next';
import { BasicToolTips } from '@actiontech/shared';
import { ExceptionFileOutlined, MinusCircleOutlined } from '@actiontech/icons';
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
  const {
    canWrite,
    removeRuleException,
    navigateToExceptionDetail,
    submitting
  } = useRuleExceptionActions({
    sqlManageContext,
    onSuccess: onRefresh
  });

  if (!auditResult) {
    return <AuditResultMessage />;
  }

  const exceptionId = auditResult.exception_id;
  const viewDetailDisabled = !exceptionId;
  const cancelDisabled = !exceptionId || submitting;

  return (
    <AuditResultWithRuleExceptionStyleWrapper>
      <div className="audit-result-content">
        <AuditResultMessage auditResult={auditResult} />
      </div>
      <div className="audit-result-action">
        <Space size={4}>
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
          {canWrite ? (
            <BasicToolTips title={t('ruleException.cancel.title')}>
              <MinusCircleOutlined
                width={16}
                height={16}
                fill={cancelDisabled ? undefined : 'currentColor'}
                className={
                  cancelDisabled ? undefined : 'pointer icon-cancel-exception'
                }
                onClick={(event) => {
                  event.stopPropagation();
                  if (!cancelDisabled && exceptionId) {
                    removeRuleException(exceptionId);
                  }
                }}
              />
            </BasicToolTips>
          ) : null}
        </Space>
      </div>
    </AuditResultWithRuleExceptionStyleWrapper>
  );
};

export default ExemptedAuditResultWithActions;
