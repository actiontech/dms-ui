import VersionComparison from '@actiontech/shared/lib/components/EnterpriseFeatureDisplay/components/VersionComparison';
import SQLEVersionContent from './SQLEVersionContent';
import BasicVersionModal from './BasicVersionModal';

const SQLModalCE: React.FC<{
  open: boolean;
  setVersionModalClose: () => void;
}> = ({ open, setVersionModalClose }) => {
  return (
    <BasicVersionModal open={open} setVersionModalClose={setVersionModalClose}>
      <SQLEVersionContent open={open}>
        <VersionComparison />
      </SQLEVersionContent>
    </BasicVersionModal>
  );
};

export default SQLModalCE;
