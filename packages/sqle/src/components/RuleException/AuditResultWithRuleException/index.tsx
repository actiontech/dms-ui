import { IAuditResult } from '@actiontech/shared/lib/api/sqle/service/common';
import { SqlManageStatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { ISqlManageRuleExceptionContext } from '../../../page/RuleException/index.data';
import AuditResultMessage from '../../AuditResultMessage';
import { AuditResultMessageProps } from '../../AuditResultMessage/index.type';
import AddRuleExceptionButton, {
  OpenCreateAuditWhitelistExceptionParams
} from '../AddRuleExceptionButton';
import { AuditResultWithRuleExceptionStyleWrapper } from './style';

type AuditResultWithRuleExceptionProps = {
  auditResult?: IAuditResult;
  sqlManageContext?: ISqlManageRuleExceptionContext;
  status?: SqlManageStatusEnum | string;
  onRefresh?: () => void;
  onOpenCreateException?: (
    params: OpenCreateAuditWhitelistExceptionParams
  ) => void;
} & Pick<
  AuditResultMessageProps,
  | 'showAnnotation'
  | 'displayMode'
  | 'moreBtnLink'
  | 'isRuleDeleted'
  | 'defaultAnnotationExpanded'
>;

const AuditResultWithRuleException: React.FC<
  AuditResultWithRuleExceptionProps
> = ({
  auditResult,
  sqlManageContext,
  status,
  onRefresh,
  onOpenCreateException,
  showAnnotation,
  displayMode,
  moreBtnLink,
  isRuleDeleted,
  defaultAnnotationExpanded
}) => {
  if (!auditResult) {
    return <AuditResultMessage />;
  }

  return (
    <AuditResultWithRuleExceptionStyleWrapper>
      <div className="audit-result-content">
        <AuditResultMessage
          auditResult={auditResult}
          showAnnotation={showAnnotation}
          displayMode={displayMode}
          moreBtnLink={moreBtnLink}
          isRuleDeleted={isRuleDeleted}
          defaultAnnotationExpanded={defaultAnnotationExpanded}
        />
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
