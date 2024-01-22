import { useNavigate } from 'react-router-dom';
import useSystemConfig from '../../../../hooks/useSystemConfig';

const ProjectTitle: React.FC = () => {
  const navigate = useNavigate();
  const { renderWebTitle } = useSystemConfig();

  return (
    <div
      onClick={() => {
        navigate('/');
      }}
    >
      {renderWebTitle()}
    </div>
  );
};

export default ProjectTitle;
