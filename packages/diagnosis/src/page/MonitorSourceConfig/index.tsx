import { useTranslation } from 'react-i18next';

const MonitorSourceConfig = () => {
  const { t } = useTranslation();
  return (
    <>
      <div>{t('monitorSourceConfig.title')}</div>
    </>
  );
};

export default MonitorSourceConfig;
