import { useTranslation } from 'react-i18next';
import { Typography } from 'antd';
import BasicVersionModal from './BasicVersionModal';
import { VersionEnum } from '../../index.enum';

const SQLEVersionModalEE: React.FC<{
  open: boolean;
  setVersionModalClose: () => void;
}> = ({ open, setVersionModalClose }) => {
  const { t } = useTranslation();

  return (
    <BasicVersionModal
      open={open}
      setVersionModalClose={setVersionModalClose}
      width={720}
      versions={[VersionEnum.DMS, VersionEnum.SQLE]}
      desc={t('dmsSystem.version.sqle_desc')}
      feature={
        <Typography.Text className="whitespace-pre-line">
          {t('dmsSystem.version.sqle_feature')}
        </Typography.Text>
      }
    />
  );
};

export default SQLEVersionModalEE;
