// #if [demo || ce]
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
      {/* #if [demo || ce] */}
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
