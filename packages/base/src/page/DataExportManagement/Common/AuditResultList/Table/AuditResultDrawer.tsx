import { AuditResultDrawerTitleStyleWrapper } from './style';
import ReportDrawer from 'sqle/src/components/ReportDrawer';
import { AuditResultDrawerProps } from './index.type';
import useAuditResultRuleInfo from 'sqle/src/components/ReportDrawer/useAuditResultRuleInfo';

const AuditResultDrawer: React.FC<AuditResultDrawerProps> = ({
  onClose,
  open,
  auditResultRecord
}) => {
  const { auditResultRuleInfo, loading } = useAuditResultRuleInfo(
    auditResultRecord?.audit_sql_result ?? [],
    auditResultRecord?.audit_sql_result?.[0].db_type
  );

  return (
    <ReportDrawer
      open={open}
      onClose={onClose}
      data={{
        auditResult: auditResultRuleInfo,
        sql: auditResultRecord?.sql ?? ''
      }}
      title={
        <AuditResultDrawerTitleStyleWrapper>
          <span className="audit-result-drawer-number">
            {auditResultRecord?.uid ? `#${auditResultRecord.uid}` : '-'}
          </span>
        </AuditResultDrawerTitleStyleWrapper>
      }
      showAnnotation
      loading={loading}
    />
  );
};

export default AuditResultDrawer;
