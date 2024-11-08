import { useNavigate } from 'react-router-dom';
import {
  AdminUserDevopsSteps,
  NormalUserDevopsSteps
} from './components/StepItems/index.data';
import { DefaultSceneStepContainerWrapper } from '../style';
import { useCurrentUser } from '@actiontech/shared/lib/global';
import useRecentlyOpenedProjects from '../../Nav/SideMenu/useRecentlyOpenedProjects';
import NotFoundProject from './components/NotFoundProject';
import { useState } from 'react';
import StepItems from './components/StepItems';
import useThemeStyleData from '../../../hooks/useThemeStyleData';
import { usePermission, PERMISSIONS } from '@actiontech/shared/lib/global';

const DefaultScene: React.FC = () => {
  const { bindProjects } = useCurrentUser();
  const navigate = useNavigate();
  const { baseTheme } = useThemeStyleData();
  const { checkActionPermission } = usePermission();

  const [
    openRulePageProjectSelectorModal,
    setOpenRulePageProjectSelectorModal
  ] = useState(false);
  const { currentProjectID, updateRecentlyProject } =
    useRecentlyOpenedProjects();

  const steps = checkActionPermission(
    PERMISSIONS.ACTIONS.BASE.HOME.ALL_OPERATIONS
  )
    ? AdminUserDevopsSteps({
        navigate,
        projectID: currentProjectID,
        setOpenRulePageProjectSelectorModal,
        iconColor: baseTheme.icon.home.common
      })
    : NormalUserDevopsSteps({
        navigate,
        projectID: currentProjectID,
        setOpenRulePageProjectSelectorModal,
        iconColor: baseTheme.icon.home.common
      });

  return (
    <>
      <DefaultSceneStepContainerWrapper>
        <StepItems steps={steps} />
      </DefaultSceneStepContainerWrapper>

      <NotFoundProject
        open={openRulePageProjectSelectorModal}
        setOpen={setOpenRulePageProjectSelectorModal}
        bindProjects={bindProjects}
        updateRecentlyProject={updateRecentlyProject}
      />
    </>
  );
};

export default DefaultScene;
