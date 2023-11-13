import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { SelectProps } from 'antd5';
import { useRequest } from 'ahooks';
import { SideMenuStyleWrapper } from './style';
import ProjectSelector from './ProjectSelector';
import useRecentlyOpenedProjects from './useRecentlyOpenedProjects';
import { useCurrentUser } from '@actiontech/shared/lib/global';
import { ProjectSelectorLabelStyleWrapper } from './ProjectSelector/style';
import { CustomSelectProps } from '@actiontech/shared/lib/components/CustomSelect';
import {
  IconProjectFlag,
  IconProjectArchived
} from '@actiontech/shared/lib/Icon/common';
import UserMenu from './UserMenu';
import ProjectTitle from './ProjectTitle';
import MenuList from './MenuList';
import dms from '@actiontech/shared/lib/api/base/service/dms';
import { IBindProject } from './ProjectSelector/index.type';

const SideMenu: React.FC = () => {
  const navigate = useNavigate();
  let currentProjectID = '';

  const { username, theme, updateTheme, isAdmin, bindProjects } =
    useCurrentUser();

  const { recentlyProjects, currentProjectID: id } =
    useRecentlyOpenedProjects();

  currentProjectID = id ?? '';

  const { data: projectList } = useRequest(() =>
    dms.ListProjects({ page_size: 9999 }).then((res) => res?.data?.data ?? [])
  );

  const getProjectArchived = useCallback(
    (itemProjectId: string) =>
      (projectList ?? []).find((project) => project.uid === itemProjectId)
        ?.archived ?? false,
    [projectList]
  );

  const projectSelectorOptions = useMemo<SelectProps['options']>(() => {
    return recentlyProjects.map((v) => {
      const isProjectArchived = getProjectArchived(v?.project_id ?? '');

      return {
        value: v.project_id,
        label: (
          <ProjectSelectorLabelStyleWrapper>
            {isProjectArchived ? <IconProjectArchived /> : <IconProjectFlag />}

            <span className="project-selector-label-text">
              {v.project_name}
            </span>
          </ProjectSelectorLabelStyleWrapper>
        ),
        text: v.project_name
      };
    });
  }, [getProjectArchived, recentlyProjects]);

  const bindProjectsWithArchiveStatus = useMemo<IBindProject[]>(
    () =>
      bindProjects.map((v) => {
        const isProjectArchived = getProjectArchived(v?.project_id ?? '');

        return {
          ...v,
          archived: isProjectArchived
        };
      }),
    [bindProjects, getProjectArchived]
  );

  const isCurrentProjectArchived = useMemo(
    () => getProjectArchived(currentProjectID),
    [currentProjectID, getProjectArchived]
  );

  const projectSelectorChangeHandle: CustomSelectProps['onChange'] = (id) => {
    navigate(`/sqle/project/${id}/overview`);
  };

  return (
    <SideMenuStyleWrapper className="dms-layout-side">
      <div className="dms-layout-side-start">
        <ProjectTitle />

        <ProjectSelector
          value={currentProjectID}
          prefix={
            isCurrentProjectArchived ? (
              <IconProjectArchived />
            ) : (
              <IconProjectFlag />
            )
          }
          onChange={projectSelectorChangeHandle}
          options={projectSelectorOptions}
          bindProjects={bindProjectsWithArchiveStatus}
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
