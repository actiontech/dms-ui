import { SelectProps } from 'antd';
import { useState, useMemo } from 'react';
import { ProjectSelectorLabelStyleWrapper } from '../../../../Nav/SideMenu/ProjectSelector/style';
import ProjectSelectorModal from '../../../../Project/Detail/NotFoundRecentlyProject/ProjectSelectorModal';
import { NotFoundProjectProps } from './index.type';
import { FlagFilled } from '@actiontech/icons';
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';
import { useTypedNavigate } from '@actiontech/shared';

const NotFoundProject: React.FC<NotFoundProjectProps> = ({
  open,
  setOpen,
  bindProjects,
  updateRecentlyProject
}) => {
  const [projectSelectorValue, setProjectSelectorValue] = useState('');
  const navigate = useTypedNavigate();
  const onModalOk = () => {
    setOpen(false);
    updateRecentlyProject(
      projectSelectorValue,
      bindProjects.find((v) => v.project_id === projectSelectorValue)
        ?.project_name ?? ''
    );

    navigate(ROUTE_PATHS.SQLE.RULE.index, {
      queries: { projectID: projectSelectorValue },
      replace: true
    });
  };
  const onModalCancel = () => {
    setOpen(false);
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
export default NotFoundProject;
