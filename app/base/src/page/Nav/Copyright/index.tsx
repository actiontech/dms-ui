import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

const CopyrightInformation: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="copyright-information">
      {t('dmsMenu.copyRight', {
        year: dayjs().get('year')
      })}
    </div>
  );
};

export default CopyrightInformation;
