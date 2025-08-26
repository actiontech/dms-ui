import DefaultScene from './DefaultScene';
import { PageHeader } from '@actiontech/dms-kit';
import { useTranslation } from 'react-i18next';
import CEDefaultScene from './DefaultScene/index.ce';
const Home: React.FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <PageHeader title={t('dmsHome.pageTitle')} />
      {/* #if [ee] */}
      <DefaultScene />
      {/* #elif [ce] */}
      <CEDefaultScene />
      {/* #endif */}
    </>
  );
};
export default Home;
