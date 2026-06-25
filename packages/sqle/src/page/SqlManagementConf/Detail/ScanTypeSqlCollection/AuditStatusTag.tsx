import { useTranslation } from 'react-i18next';
import { ResultIconTagStyleWrapper } from '../../../../components/AuditResultMessage/style';
import { AUDITED, BEING_AUDITED } from './utils';

type AuditStatusTagProps = {
  status?: string;
};

const AuditStatusTag: React.FC<AuditStatusTagProps> = ({ status }) => {
  const { t } = useTranslation();

  if (status === BEING_AUDITED) {
    return (
      <ResultIconTagStyleWrapper size="small" color="geekblue">
        {t('components.auditResultMessage.auditing')}
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

  return <>{status || '-'}</>;
};

export default AuditStatusTag;
