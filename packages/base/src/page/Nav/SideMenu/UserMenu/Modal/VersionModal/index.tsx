// #if [demo || ce]
import SQLModalCE from './SQLModalCE';
// #else
import SQLEModalEE from './SQLEModalEE';
// #endif

const VersionModal: React.FC<{
  open: boolean;
  setVersionModalClose: () => void;
}> = ({ open, setVersionModalClose }) => {
  return (
    <>
      {/* #if [demo || ce] */}
      <SQLModalCE open={open} setVersionModalClose={setVersionModalClose} />
      {/* #else */}
      <SQLEModalEE open={open} setVersionModalClose={setVersionModalClose} />
      {/* #endif */}
    </>
  );
};

export default VersionModal;
