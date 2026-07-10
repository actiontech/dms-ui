import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { BasicToolTips } from '@actiontech/shared';
import { ExceptionFileOutlined } from '@actiontech/icons';
import AuditResultMessage from '../../AuditResultMessage';
import useRuleExceptionActions from '../useRuleExceptionActions';
import { AuditResultWithRuleExceptionStyleWrapper } from '../AuditResultWithRuleException/style';

type FullSqlExemptedResultItemProps = {
  message?: string;
  exceptionId?: number;
  showViewDetailAction?: boolean;
};

const FullSqlExemptedResultItem: React.FC<FullSqlExemptedResultItemProps> = ({
  message = '',
  exceptionId,
  showViewDetailAction = false
}) => {
  const { t } = useTranslation();
  const { navigateToExceptionDetail } = useRuleExceptionActions();

  const displayAuditResult = useMemo(
    () => ({
      level: 'normal',
      message
    }),
    [message]
  );

  const viewDetailDisabled = !exceptionId;

  return (
    <AuditResultWithRuleExceptionStyleWrapper className="full-sql-exempted-result-item">
      <AuditResultMessage
        styleClass="result-item"
        auditResult={displayAuditResult}
      />
      {showViewDetailAction ? (
        <BasicToolTips
          title={
            viewDetailDisabled
              ? undefined
              : t('ruleException.skippedSection.viewDetail')
          }
        >
          <ExceptionFileOutlined
            width={16}
            height={16}
            className={viewDetailDisabled ? undefined : 'pointer'}
            onClick={
              viewDetailDisabled
                ? undefined
                : () => navigateToExceptionDetail(exceptionId)
            }
          />
        </BasicToolTips>
      ) : null}
    </AuditResultWithRuleExceptionStyleWrapper>
  );
};

export default FullSqlExemptedResultItem;
