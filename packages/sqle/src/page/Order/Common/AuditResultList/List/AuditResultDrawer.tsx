import ReportDrawer from '../../../../../components/ReportDrawer';
import { AuditResultDrawerProps } from '../../../Create/AuditResult/index.type';
import { AuditResultDrawerTitleStyleWrapper } from './style';
import useAuditResultRuleInfo from '../../../hooks/useAuditResultRuleInfo';

const AuditResultDrawer: React.FC<AuditResultDrawerProps> = ({
  onClose,
  open,
  auditResultRecord,
  dbType
}) => {
  const { auditResultRuleInfo } = useAuditResultRuleInfo(
    auditResultRecord?.audit_result ?? [],
    dbType ?? ''
  );

  return (
    <ReportDrawer
      open={open}
      onClose={onClose}
      data={{
        auditResult: auditResultRuleInfo,
        sql: auditResultRecord?.exec_sql ?? '',
        sqlSourceFile: auditResultRecord?.sql_source_file ?? ''
      }}
      showSourceFile
      title={
        <AuditResultDrawerTitleStyleWrapper>
          <span className="audit-result-drawer-number">
            {auditResultRecord?.number ? `#${auditResultRecord.number}` : '-'}
          </span>
        </AuditResultDrawerTitleStyleWrapper>
      }
      showAnnotation
    />
  );
};

export default AuditResultDrawer;
