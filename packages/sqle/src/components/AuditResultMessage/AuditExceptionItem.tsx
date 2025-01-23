import { BasicTypographyEllipsis } from '@actiontech/shared';
import { AuditExceptionItemProps } from './index.type';
import { AuditExceptionItemStyleWrapper } from './style';
import { WarningFilled } from '@actiontech/icons';

const AuditExceptionItem: React.FC<AuditExceptionItemProps> = ({
  auditExceptionResult
}) => {
  return (
    <AuditExceptionItemStyleWrapper className="exception-item">
      <div className="exception-item-rule-desc-wrapper">
        <span className="exception-item-rule-desc-icon">
          <WarningFilled width={20} height={20} />
        </span>
        <span className="exception-item-rule-desc-text">
          {auditExceptionResult.message}
        </span>
      </div>

      <BasicTypographyEllipsis
        className="exception-item-message-wrapper"
        textCont={auditExceptionResult.error_info ?? ''}
      />
    </AuditExceptionItemStyleWrapper>
  );
};

export default AuditExceptionItem;
