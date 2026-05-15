// #if [ee]
import EEIndexProjectDetail from './index.ee';
// #elif [ce]
import CEIndexProjectDetail from './index.ce';
// #endif

const ProjectDetail: React.FC = () => {
  return (
    <>
      {/* #if [ee] */}
      <EEIndexProjectDetail />
      {/* #elif [ce] */}
      <CEIndexProjectDetail />
      {/* #endif */}
    </>
  );
};

export default ProjectDetail;
