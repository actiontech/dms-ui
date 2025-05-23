import { PageHeader } from '@actiontech/shared';
import { useTranslation } from 'react-i18next';
import ExpirationAccountList from './ExpirationAccount';

const DatabaseAccountPassword = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageHeader title={t('passwordSecurityPolicy.advent.title')} />

      <ExpirationAccountList />
    </>
  );
};

export default DatabaseAccountPassword;
