import VersionComparison from '@actiontech/shared/lib/components/EnterpriseFeatureDisplay/components/VersionComparison';
import BasicVersionModal from './BasicVersionModal';
import { useTranslation } from 'react-i18next';
import { VersionEnum } from '../../index.enum';

const SQLEVersionModalCE: React.FC<{
  open: boolean;
  setVersionModalClose: () => void;
}> = ({ open, setVersionModalClose }) => {
  const { t } = useTranslation();

  return (
    <BasicVersionModal
      open={open}
      setVersionModalClose={setVersionModalClose}
      versions={[VersionEnum.DMS, VersionEnum.SQLE]}
      desc={t('dmsSystem.version.sqle_desc')}
      feature={<VersionComparison />}
    />
  );
};

export default SQLEVersionModalCE;
