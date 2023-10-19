import ReportDrawer from '../../../../../components/ReportDrawer';
import { AuditResultDrawerProps } from '../../../Create/AuditResult/index.type';
import { AuditResultDrawerTitleStyleWrapper } from './style';

const AuditResultDrawer: React.FC<AuditResultDrawerProps> = ({
  onClose,
  open,
  auditResultRecord
}) => {
  return (
    <ReportDrawer
      open={open}
      onClose={onClose}
      data={{
        auditResult: auditResultRecord?.audit_result ?? [],
        sql: auditResultRecord?.exec_sql ?? ''
      }}
      title={
        <AuditResultDrawerTitleStyleWrapper>
          <span className="audit-result-drawer-number">
            {auditResultRecord?.number ? `#${auditResultRecord.number}` : '-'}
          </span>
        </AuditResultDrawerTitleStyleWrapper>
      }
    />
  );
};

export default AuditResultDrawer;
