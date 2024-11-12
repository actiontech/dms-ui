import { useLocation } from 'react-router-dom';
import ProjectSelectorModal from './ProjectSelectorModal';
import { useCurrentUser } from '@actiontech/shared/lib/global';
import { useMemo, useState } from 'react';
import { SelectProps } from 'antd';
import { ProjectSelectorLabelStyleWrapper } from '../../../Nav/SideMenu/ProjectSelector/style';
import { FlagFilled } from '@actiontech/icons';
import { useTypedNavigate } from '@actiontech/shared';

const NotFoundRecentlyProject: React.FC<{
  currentProjectID?: string;
  updateRecentlyProject: (id: string, name: string) => void;
}> = ({ currentProjectID, updateRecentlyProject }) => {
  const location = useLocation();
  const navigate = useTypedNavigate();

  const { bindProjects } = useCurrentUser();

  const [open, setOpen] = useState(!currentProjectID);
  const [projectSelectorValue, setProjectSelectorValue] = useState('');

  const onModalOk = () => {
    setOpen(false);
    updateRecentlyProject(
      projectSelectorValue,
      bindProjects.find((v) => v.project_id === projectSelectorValue)
        ?.project_name ?? ''
    );

    navigate(
      location.pathname.replace(
        /^(\/sqle\/|\/)project\/\/(.+)$/,
        (_, prefix, target) => {
          return `${prefix}project/${projectSelectorValue}/${target}`;
        }
      ),
      { replace: true }
    );
  };

  const onModalCancel = () => {
    setOpen(false);
    navigate(-1);
  };

  const projectSelectorOptions = useMemo<SelectProps['options']>(
    () =>
      bindProjects.map((v) => {
        return {
          value: v.project_id,
          label: (
            <ProjectSelectorLabelStyleWrapper>
              <FlagFilled width={18} height={18} />
              <span className="project-selector-label-text">
                {v.project_name}
              </span>
            </ProjectSelectorLabelStyleWrapper>
          ),
          text: v.project_name
        };
      }),
    [bindProjects]
  );

  return (
    <>
      <ProjectSelectorModal
        open={open}
        onModalCancel={onModalCancel}
        projectSelectorOptions={projectSelectorOptions}
        projectSelectorValue={projectSelectorValue}
        onModalOk={onModalOk}
        setProjectSelectorValue={setProjectSelectorValue}
      />
    </>
  );
};

export default NotFoundRecentlyProject;
