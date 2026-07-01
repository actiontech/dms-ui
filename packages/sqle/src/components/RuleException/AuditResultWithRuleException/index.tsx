import { Space } from 'antd';
import { SqlManageStatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { IAuditResultWithExemption } from '../../../page/RuleException/index.type';
import { ISqlManageRuleExceptionContext } from '../../../page/RuleException/index.data';
import AuditResultMessage from '../../AuditResultMessage';
import AddRuleExceptionButton, {
  OpenCreateSqlManagementExceptionParams
} from '../AddRuleExceptionButton';
import ExemptedRuleTag from '../ExemptedRuleTag';
import { AuditResultWithRuleExceptionStyleWrapper } from './style';

type AuditResultWithRuleExceptionProps = {
  auditResult?: IAuditResultWithExemption;
  sqlManageContext?: ISqlManageRuleExceptionContext;
  status?: SqlManageStatusEnum | string;
  onRefresh?: () => void;
  onOpenCreateException?: (
    params: OpenCreateSqlManagementExceptionParams
  ) => void;
};

const AuditResultWithRuleException: React.FC<
  AuditResultWithRuleExceptionProps
> = ({
  auditResult,
  sqlManageContext,
  status,
  onRefresh,
  onOpenCreateException
}) => {
  if (!auditResult) {
    return <AuditResultMessage />;
  }

  if (auditResult.is_exempted) {
    return (
      <Space align="start" size={8}>
        <AuditResultMessage auditResult={auditResult} />
        <ExemptedRuleTag exceptionId={auditResult.exception_id} />
      </Space>
    );
  }

  return (
    <AuditResultWithRuleExceptionStyleWrapper>
      <div className="audit-result-content">
        <AuditResultMessage auditResult={auditResult} />
      </div>
      <div className="audit-result-action">
        <AddRuleExceptionButton
          auditResult={auditResult}
          sqlManageContext={sqlManageContext}
          status={status}
          onSuccess={onRefresh}
          onOpenCreateException={onOpenCreateException}
        />
      </div>
    </AuditResultWithRuleExceptionStyleWrapper>
  );
};

export default AuditResultWithRuleException;
