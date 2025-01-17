import { DEFAULT_PROJECT_ID } from '@actiontech/shared/lib/data/common';
import { PERMISSIONS, usePermission } from '@actiontech/shared/lib/features';
import { DefaultSceneStepContainerWrapper } from '../style';
import StepItems from './components/StepItems';
import {
  AdminUserDevopsSteps,
  NormalUserDevopsSteps
} from './components/StepItems/index.data';
import useThemeStyleData from '../../../hooks/useThemeStyleData';
import { useTypedNavigate } from '@actiontech/shared';

const CEDefaultScene: React.FC = () => {
  const navigate = useTypedNavigate();

  const { baseTheme } = useThemeStyleData();
  const { checkActionPermission } = usePermission();

  const steps = checkActionPermission(
    PERMISSIONS.ACTIONS.BASE.HOME.ALL_OPERATIONS
  )
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
