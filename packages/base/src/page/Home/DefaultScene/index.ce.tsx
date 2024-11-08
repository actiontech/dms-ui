import { DEFAULT_PROJECT_ID } from '@actiontech/shared/lib/data/common';
import { useCurrentUser } from '@actiontech/shared/lib/global';
import { DefaultSceneStepContainerWrapper } from '../style';
import StepItems from './components/StepItems';
import {
  AdminUserDevopsSteps,
  NormalUserDevopsSteps
} from './components/StepItems/index.data';
import useThemeStyleData from '../../../hooks/useThemeStyleData';
import { useTypedNavigate } from '@actiontech/shared';

const CEDefaultScene: React.FC = () => {
  const { isAdmin } = useCurrentUser();
  const navigate = useTypedNavigate();
  const { baseTheme } = useThemeStyleData();

  const steps = isAdmin
    ? AdminUserDevopsSteps({
        navigate,
        projectID: DEFAULT_PROJECT_ID,
        iconColor: baseTheme.icon.home.common
      })
    : NormalUserDevopsSteps({
        navigate,
        projectID: DEFAULT_PROJECT_ID,
        iconColor: baseTheme.icon.home.common
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
