import { useTranslation } from 'react-i18next';
import { ResultIconTagStyleWrapper } from '../../../../components/AuditResultMessage/style';
import { AUDITED, PENDING } from './utils';

type AuditStatusTagProps = {
  status?: string;
};

const AuditStatusTag: React.FC<AuditStatusTagProps> = ({ status }) => {
  const { t } = useTranslation();

  if (status === PENDING) {
    return (
      <ResultIconTagStyleWrapper size="small" color="orange">
        {t('managementConf.detail.scanTypeSqlCollection.column.pendingAudit')}
      </ResultIconTagStyleWrapper>
    );
  }

  if (status === AUDITED) {
    return (
      <ResultIconTagStyleWrapper size="small" color="green">
        {t('managementConf.detail.scanTypeSqlCollection.column.audited')}
      </ResultIconTagStyleWrapper>
    );
  }

  return <>-</>;
};

export default AuditStatusTag;
