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

const DefaultScene: React.FC = () => {
  const { isAdmin, bindProjects } = useCurrentUser();
  const navigate = useNavigate();

  const [
    openRulePageProjectSelectorModal,
    setOpenRulePageProjectSelectorModal
  ] = useState(false);
  const { currentProjectID, updateRecentlyProject } =
    useRecentlyOpenedProjects();

  const steps = isAdmin
    ? AdminUserDevopsSteps({
        navigate,
        projectID: currentProjectID,
        setOpenRulePageProjectSelectorModal
      })
    : NormalUserDevopsSteps({
        navigate,
        projectID: currentProjectID,
        setOpenRulePageProjectSelectorModal
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
