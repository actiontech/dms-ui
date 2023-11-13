import { SideMenuStyleWrapper } from './style';
import ProjectSelector from './ProjectSelector';
import { useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import useRecentlyOpenedProjects from './useRecentlyOpenedProjects';
import { Menu, MenuProps, SelectProps, Typography } from 'antd5';
import {
  useCurrentProject,
  useCurrentUser
} from '@actiontech/shared/lib/global';
import { ProjectSelectorLabelStyleWrapper } from './ProjectSelector/style';
import { CustomSelectProps } from '@actiontech/shared/lib/components/CustomSelect';
import { IconProjectFlag } from '@actiontech/shared/lib/Icon/common';
import {
  DEFAULT_PROJECT_ID,
  DEFAULT_PROJECT_NAME
} from '@actiontech/shared/lib/data/common';
import useSystemConfig from '../../../hooks/useSystemConfig.tsx';
import { SIDE_MENU_DATA_PLACEHOLDER_KEY } from './menus/common';
import { LockOutlined } from '@ant-design/icons';
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
            {/* <LockOutlined size={18} /> */}

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
