import ReportDrawer from '../../../../../components/ReportDrawer';
import useAuditResultRuleInfo from '../../../../../components/ReportDrawer/useAuditResultRuleInfo';
import { AuditResultDrawerProps } from './index.type';
import { AuditResultDrawerTitleStyleWrapper } from './style';
import { BasicButton } from '@actiontech/shared';
import { useTranslation } from 'react-i18next';

const AuditResultDrawer: React.FC<AuditResultDrawerProps> = ({
  onClose,
  open,
  auditResultRecord,
  dbType,
  clickAnalyze
}) => {
  const { t } = useTranslation();
  const { auditResultRuleInfo, loading } = useAuditResultRuleInfo(
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
      loading={loading}
      extra={
        <BasicButton onClick={() => clickAnalyze(auditResultRecord?.number)}>
          {t('execWorkflow.audit.table.analyze')}
        </BasicButton>
      }
    />
  );
};

export default AuditResultDrawer;
