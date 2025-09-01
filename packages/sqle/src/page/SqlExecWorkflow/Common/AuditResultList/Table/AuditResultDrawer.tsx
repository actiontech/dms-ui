import { RobotOutlined } from '@actiontech/icons';
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
        <Space>
          {handleClickSqlRewritten && (
            <BasicButton
              icon={<RobotOutlined height={18} width={18} />}
              onClick={() => {
                handleClickSqlRewritten(auditResultRecord!);
                onClose();
              }}
            >
              {t('sqlRewrite.actionName')}
            </BasicButton>
          )}
          <BasicButton onClick={() => clickAnalyze(auditResultRecord?.number)}>
            {t('execWorkflow.audit.table.analyze')}
          </BasicButton>
        </Space>
      }
    />
  );
};
export default AuditResultDrawer;
