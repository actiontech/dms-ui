import { SideMenuStyleWrapper } from './style';
import ProjectSelector from './ProjectSelector';
import { useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import useRecentlyOpenedProjects from './useRecentlyOpenedProjects';
import { SelectProps } from 'antd';
import { useCurrentUser } from '@actiontech/shared/lib/global';
import { ProjectSelectorLabelStyleWrapper } from './ProjectSelector/style';
import { CustomSelectProps } from '@actiontech/shared/lib/components/CustomSelect';
import { IconProjectFlag } from '@actiontech/shared/lib/Icon/common';
import UserMenu from './UserMenu';
import ProjectTitle from './ProjectTitle';
import MenuList from './MenuList';

const SideMenu: React.FC = () => {
  const navigate = useNavigate();
  let currentProjectID = '';

  const { username, theme, updateTheme, isAdmin, bindProjects } =
    useCurrentUser();

  const { recentlyProjects, currentProjectID: id } =
    useRecentlyOpenedProjects();

  currentProjectID = id ?? '';

  const projectSelectorOptions = useMemo<SelectProps['options']>(() => {
    return recentlyProjects.map((v) => {
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
    });
  }, [recentlyProjects]);

  const projectSelectorChangeHandle: CustomSelectProps['onChange'] = (id) => {
    navigate(`/sqle/project/${id}/overview`);
  };

  return (
    <SideMenuStyleWrapper className="dms-layout-side">
      <div className="dms-layout-side-start">
        <ProjectTitle />

        <ProjectSelector
          value={currentProjectID}
          onChange={projectSelectorChangeHandle}
          options={projectSelectorOptions}
          bindProjects={bindProjects}
        />

        <MenuList projectID={currentProjectID} isAdmin={isAdmin} />
      </div>

      <UserMenu
        username={username}
        updateTheme={updateTheme}
        isAdmin={isAdmin}
        theme={theme}
      />
    </SideMenuStyleWrapper>
  );
};

export default SideMenu;
