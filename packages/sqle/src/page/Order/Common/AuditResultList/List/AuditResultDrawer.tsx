import ReportDrawer from '../../../../../components/ReportDrawer';
import useAuditResultRuleInfo from '../../../../../components/ReportDrawer/useAuditResultRuleInfo';
import { AuditResultDrawerProps } from '../../../Create/AuditResult/index.type';
import { AuditResultDrawerTitleStyleWrapper } from './style';

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
        sqlSourceFile: auditResultRecord?.sql_source_file ?? '',
        sqlStartLine: auditResultRecord?.sql_start_line
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
