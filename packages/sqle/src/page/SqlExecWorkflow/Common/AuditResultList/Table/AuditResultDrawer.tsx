import { useCallback, useMemo } from 'react';
import ReportDrawer from '../../../../../components/ReportDrawer';
import useAuditResultRuleInfo from '../../../../../components/ReportDrawer/useAuditResultRuleInfo';
import { AuditResultDrawerProps } from './index.type';
import { AuditResultDrawerTitleStyleWrapper } from './style';
import { BasicButton } from '@actiontech/shared';
import { useTranslation } from 'react-i18next';
import useWhitelistRedux from '../../../../Whitelist/hooks/useWhitelistRedux';
import {
  buildSqlManageRuleExceptionContext,
  toSqlAuditRuleExceptionRecord
} from '../../../../RuleException/index.data';
import { OpenCreateAuditWhitelistExceptionParams } from '../../../../../components/RuleException/AddRuleExceptionButton';

const AuditResultDrawer: React.FC<AuditResultDrawerProps> = ({
  onClose,
  open,
  auditResultRecord,
  dbType,
  clickAnalyze,
  ruleExceptionSourceContext
}) => {
  const { t } = useTranslation();
  const { openAuditWhitelistCreateWithPrefill } = useWhitelistRedux();
  const { auditResultRuleInfo, loading, enrichSkippedItem } =
    useAuditResultRuleInfo(
      auditResultRecord?.audit_result ?? [],
      dbType ?? '',
      auditResultRecord?.skipped_by_rule_exception
    );

  const sqlManageContext = useMemo(
    () =>
      buildSqlManageRuleExceptionContext(
        toSqlAuditRuleExceptionRecord(
          auditResultRecord,
          ruleExceptionSourceContext
        )
      ),
    [auditResultRecord, ruleExceptionSourceContext]
  );

  const handleOpenCreateException = useCallback(
    (params: OpenCreateAuditWhitelistExceptionParams) => {
      onClose();
      openAuditWhitelistCreateWithPrefill(
        toSqlAuditRuleExceptionRecord(
          auditResultRecord,
          ruleExceptionSourceContext
        ),
        { ruleName: params.auditResult?.rule_name }
      );
    },
    [
      auditResultRecord,
      onClose,
      openAuditWhitelistCreateWithPrefill,
      ruleExceptionSourceContext
    ]
  );

  return (
    <ReportDrawer
      open={open}
      onClose={onClose}
      data={{
        auditResult: auditResultRuleInfo,
        sql: auditResultRecord?.exec_sql ?? '',
        sqlSourceFile: auditResultRecord?.sql_source_file ?? '',
        sqlStartLine: auditResultRecord?.sql_start_line,
        auditStatus: auditResultRecord?.audit_status,
        skippedByRuleException: auditResultRecord?.skipped_by_rule_exception,
        auditLevel: auditResultRecord?.audit_level
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
      sqlManageContext={sqlManageContext}
      onOpenCreateException={
        sqlManageContext ? handleOpenCreateException : undefined
      }
      enrichSkippedItem={enrichSkippedItem}
      extra={
        <BasicButton onClick={() => clickAnalyze(auditResultRecord?.number)}>
          {t('execWorkflow.audit.table.analyze')}
        </BasicButton>
      }
    />
  );
};

export default AuditResultDrawer;
