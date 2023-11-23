import { SelectProps } from 'antd';
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconProjectFlag } from 'sqle/src/icon/Rule';
import { ProjectSelectorLabelStyleWrapper } from '../../Nav/SideMenu/ProjectSelector/style';
import ProjectSelectorModal from '../../Project/Detail/NotFoundRecentlyProject/ProjectSelectorModal';
import { RuleUrlParamKey } from 'sqle/src/page/Rule/hooks/useRuleFilterFormItem';
import { IUserBindProject } from '@actiontech/shared/lib/api/base/service/common';

const NotFoundProject: React.FC<{
  open: boolean;
  setOpen: (v: boolean) => void;
  bindProjects: IUserBindProject[];
  updateRecentlyProject: (id: string, name: string) => void;
}> = ({ open, setOpen, bindProjects, updateRecentlyProject }) => {
  const [projectSelectorValue, setProjectSelectorValue] = useState('');
  const navigate = useNavigate();
  const onModalOk = () => {
    setOpen(false);
    updateRecentlyProject(
      projectSelectorValue,
      bindProjects.find((v) => v.project_id === projectSelectorValue)
        ?.project_name ?? ''
    );

    navigate(
      `/sqle/rule?${RuleUrlParamKey.projectID}=${projectSelectorValue}`,
      {
        replace: true
      }
    );
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
              <IconProjectFlag />
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