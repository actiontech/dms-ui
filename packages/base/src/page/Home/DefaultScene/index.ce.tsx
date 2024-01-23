import { DEFAULT_PROJECT_ID } from '@actiontech/shared/lib/data/common';
import { useCurrentUser } from '@actiontech/shared/lib/global';
import { useNavigate } from 'react-router-dom';
import { DefaultSceneStepContainerWrapper } from '../style';
import StepItems from './components/StepItems';
import {
  AdminUserDevopsSteps,
  NormalUserDevopsSteps
} from './components/StepItems/index.data';

const CEDefaultScene: React.FC = () => {
  const { isAdmin } = useCurrentUser();
  const navigate = useNavigate();

  const steps = isAdmin
    ? AdminUserDevopsSteps({
        navigate,
        projectID: DEFAULT_PROJECT_ID
      })
    : NormalUserDevopsSteps({
        navigate,
        projectID: DEFAULT_PROJECT_ID
      });

  return (
    <>
      <DefaultSceneStepContainerWrapper>
        <StepItems steps={steps} />
      </DefaultSceneStepContainerWrapper>
    </>
  );
};

export default CEDefaultScene;
