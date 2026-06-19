import ReportDrawer from '../../../../../components/ReportDrawer';
import useAuditResultRuleInfo from '../../../../../components/ReportDrawer/useAuditResultRuleInfo';
import { AuditResultDrawerProps } from './index.type';
import { AuditResultDrawerTitleStyleWrapper } from './style';
import { BasicButton } from '@actiontech/dms-kit';
import { useTranslation } from 'react-i18next';
import { Space } from 'antd';

const AuditResultDrawer: React.FC<AuditResultDrawerProps> = ({
  onClose,
  open,
  auditResultRecord,
  dbType,
  projectID,
  projectName,
  instanceName,
  canCreateRuleException,
  onRuleExceptionCreated,
  clickAnalyze,
  handleClickSqlRewritten
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
        skippedAuditResult: auditResultRecord?.skipped_audit_result,
        sql: auditResultRecord?.exec_sql ?? '',
        sqlSourceFile: auditResultRecord?.sql_source_file ?? '',
        sqlStartLine: auditResultRecord?.sql_start_line,
        auditStatus: auditResultRecord?.audit_status
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
      ruleExceptionContext={
        projectName && canCreateRuleException
          ? {
              projectName,
              projectID,
              instanceName,
              dbType,
              sqlFingerprint:
                auditResultRecord?.sql_fingerprint ??
                auditResultRecord?.audit_fingerprint ??
                auditResultRecord?.exec_sql
            }
          : undefined
      }
      canCreateRuleException={canCreateRuleException}
      onRuleExceptionCreated={onRuleExceptionCreated}
      extra={
        <Space>
          <BasicButton onClick={() => clickAnalyze(auditResultRecord?.number)}>
            {t('execWorkflow.audit.table.analyze')}
          </BasicButton>
          {handleClickSqlRewritten ? (
            <BasicButton
              onClick={() => handleClickSqlRewritten(auditResultRecord)}
            >
              {t('execWorkflow.audit.table.aiFix')}
            </BasicButton>
          ) : null}
        </Space>
      }
    />
  );
};

export default AuditResultDrawer;
