import ReportDrawer from '../../../../../components/ReportDrawer';
import { AuditResultDrawerProps } from '../../../Create/AuditResult/index.type';
import { AuditResultDrawerTitleStyleWrapper } from './style';
import useAuditResultRuleInfo from '../../../hooks/useAuditResultRuleInfo';
import { useMemo } from 'react';

const AuditResultDrawer: React.FC<AuditResultDrawerProps> = ({
  onClose,
  open,
  auditResultRecord,
  dbType
}) => {
  const { ruleInfo } = useAuditResultRuleInfo(
    auditResultRecord?.audit_result ?? [],
    dbType ?? ''
  );

  const result = useMemo(() => {
    return (
      auditResultRecord?.audit_result?.map((item) => {
        return {
          annotation:
            ruleInfo?.find(
              (i) => i.rule_name === item.rule_name && i.db_type === dbType
            )?.annotation ?? '',
          ...item
        };
      }) ?? []
    );
  }, [ruleInfo, dbType, auditResultRecord?.audit_result]);

  return (
    <ReportDrawer
      open={open}
      onClose={onClose}
      data={{
        auditResult: result,
        sql: auditResultRecord?.exec_sql ?? ''
      }}
      title={
        <AuditResultDrawerTitleStyleWrapper>
          <span className="audit-result-drawer-number">
            {auditResultRecord?.number ? `#${auditResultRecord.number}` : '-'}
          </span>
        </AuditResultDrawerTitleStyleWrapper>
      }
      dbType={dbType}
      showAnnotation
    />
  );
};

export default AuditResultDrawer;
