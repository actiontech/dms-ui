import DefaultScene from './DefaultScene';
import { PageHeader } from '@actiontech/shared';
import { useTranslation } from 'react-i18next';

const Home: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageHeader title={t('dmsHome.pageTitle')} />
      <section>
        <DefaultScene />
      </section>
    </>
  );
};

export default Home;
