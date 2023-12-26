import VersionComparison from '@actiontech/shared/lib/components/EnterpriseFeatureDisplay/components/VersionComparison';
import SQLEContent from '../SQLEContent';
import BasicVersionModal from '../BasicVersionModal';

const SQLModalCE: React.FC<{
  open: boolean;
  setVersionModalClose: () => void;
}> = ({ open, setVersionModalClose }) => {
  return (
    <BasicVersionModal open={open} setVersionModalClose={setVersionModalClose}>
      <SQLEContent open={open}>
        <VersionComparison />
      </SQLEContent>
    </BasicVersionModal>
  );
};

export default SQLModalCE;
