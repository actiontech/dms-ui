import { useCallback, useEffect, useMemo, useState } from 'react';
import { SelectProps, Spin } from 'antd';
import { useRequest } from 'ahooks';
import { SideMenuStyleWrapper } from '@actiontech/shared/lib/styleWrapper/nav';
import ProjectSelector from './ProjectSelector';
import useRecentlyOpenedProjects from './useRecentlyOpenedProjects';
import { useCurrentUser } from '@actiontech/shared/lib/features';
import { ProjectSelectorLabelStyleWrapper } from './ProjectSelector/style';
import UserMenu from './UserMenu';
import ProjectTitle from './ProjectTitle';
import MenuList from './MenuList';
import Project from '@actiontech/shared/lib/api/base/service/Project';
import { IBindProject } from './ProjectSelector/index.type';
import EventEmitter from '../../../utils/EventEmitter';
import EmitterKey from '../../../data/EmitterKey';
import { useDispatch } from 'react-redux';
import { updateBindProjects } from '../../../store/user';
import { FlagFilled, LockOutlined } from '@actiontech/icons';
import QuickActions from './QuickActions';
import { CustomSelectProps, useTypedNavigate } from '@actiontech/shared';
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';

const SideMenu: React.FC = () => {
  const navigate = useTypedNavigate();
  const dispatch = useDispatch();

  const [systemModuleRedDotsLoading, setSystemModuleRedDotsLoading] =
    useState(false);

  const { username, theme, updateTheme, bindProjects, language } =
    useCurrentUser();

  const { recentlyProjects, currentProjectID } = useRecentlyOpenedProjects();

  const {
    data: projectList,
    loading: getProjectListLoading,
    refresh: refreshProjectList
  } = useRequest(
    () =>
      Project.ListProjects({ page_size: 9999 }).then(
        (res) => res?.data?.data ?? []
      ),
    {
      refreshDeps: [currentProjectID],
      onSuccess: (res) => {
        const newBindProjects = bindProjects.map((item) => {
          const archived =
            res.find((project) => project.uid === item.project_id)?.archived ??
            false;

          return { ...item, archived };
        });

        dispatch(
          updateBindProjects({
            bindProjects: newBindProjects
          })
        );
      }
    }
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
            {isProjectArchived ? (
              <LockOutlined width={18} height={18} />
            ) : (
              <FlagFilled width={18} height={18} />
            )}

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
    () => getProjectArchived(currentProjectID ?? ''),
    [currentProjectID, getProjectArchived]
  );

  const projectSelectorChangeHandle: CustomSelectProps['onChange'] = (
    projectID
  ) => {
    navigate(ROUTE_PATHS.SQLE.PROJECT_OVERVIEW.index, {
      params: { projectID }
    });
  };

  useEffect(() => {
    const { unsubscribe } = EventEmitter.subscribe(
      EmitterKey.DMS_Sync_Project_Archived_Status,
      refreshProjectList
    );

    return unsubscribe;
  }, [refreshProjectList]); // 防止刷新时，项目列表未更新，导致项目列表不显示

  return (
    <SideMenuStyleWrapper className="dms-layout-side">
      <div className="dms-layout-side-start">
        <ProjectTitle />
        <Spin spinning={getProjectListLoading || systemModuleRedDotsLoading}>
          {/* #if [sqle] */}
          <QuickActions
            setSystemModuleRedDotsLoading={setSystemModuleRedDotsLoading}
          />
          {/* #endif */}
          <ProjectSelector
            value={currentProjectID}
            prefix={
              isCurrentProjectArchived ? (
                <LockOutlined width={18} height={18} />
              ) : (
                <FlagFilled width={18} height={18} />
              )
            }
            onChange={projectSelectorChangeHandle}
            options={projectSelectorOptions}
            bindProjects={bindProjectsWithArchiveStatus}
          />
        </Spin>
        <MenuList projectID={currentProjectID ?? ''} />
      </div>

      <UserMenu
        username={username}
        updateTheme={updateTheme}
        theme={theme}
        language={language}
      />
    </SideMenuStyleWrapper>
  );
};

export default SideMenu;
