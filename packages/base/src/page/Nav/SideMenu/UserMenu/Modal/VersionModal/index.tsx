// #if [!sqle]
import DMSVersionModal from './index.dms';
// #elif [demo || ce]
import SQLEVersionModalCE from './index.sqle.ce';
// #else
import SQLEVersionModalEE from './index.sqle.ee';
// #endif

const VersionModal: React.FC<{
  open: boolean;
  setVersionModalClose: () => void;
}> = ({ open, setVersionModalClose }) => {
  return (
    <>
      {/* #if [!sqle] */}
      <DMSVersionModal
        open={open}
        setVersionModalClose={setVersionModalClose}
      />
      {/* #elif [demo || ce] */}
      <SQLEVersionModalCE
        open={open}
        setVersionModalClose={setVersionModalClose}
      />
      {/* #else */}
      <SQLEVersionModalEE
        open={open}
        setVersionModalClose={setVersionModalClose}
      />
      {/* #endif */}
    </>
  );
};

export default VersionModal;
