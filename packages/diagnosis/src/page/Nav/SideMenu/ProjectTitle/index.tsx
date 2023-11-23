import { useNavigate } from 'react-router-dom';

const ProjectTitle: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => {
        navigate('/');
      }}
    >
      <div className="title">
        <span className="label label-primary">Action</span>
        <span className="label label-base">Diagnosis</span>
      </div>
    </div>
  );
};

export default ProjectTitle;
