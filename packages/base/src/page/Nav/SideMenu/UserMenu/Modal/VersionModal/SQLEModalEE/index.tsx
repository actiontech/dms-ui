import { useTranslation } from 'react-i18next';
import SQLEContent from '../SQLEContent';
import { Typography } from 'antd';
import BasicVersionModal from '../BasicVersionModal';

const SQLEModalEE: React.FC<{
  open: boolean;
  setVersionModalClose: () => void;
}> = ({ open, setVersionModalClose }) => {
  const { t } = useTranslation();

  return (
    <BasicVersionModal
      open={open}
      setVersionModalClose={setVersionModalClose}
      width={720}
    >
      <SQLEContent open={open}>
        <Typography.Text className="whitespace-pre-line">
          {t('dmsSystem.version.sqle_feature')}
        </Typography.Text>
      </SQLEContent>
    </BasicVersionModal>
  );
};

export default SQLEModalEE;
