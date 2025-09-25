import { useCallback, useEffect, useMemo, useState } from 'react';
import { SelectProps, Spin } from 'antd';
import { useRequest } from 'ahooks';
import { SideMenuStyleWrapper } from '@actiontech/dms-kit';
import ProjectSelector from './ProjectSelector';
import useRecentlyOpenedProjects from './useRecentlyOpenedProjects';
import { useCurrentUser, usePermission } from '@actiontech/shared/lib/features';
import { ProjectSelectorLabelStyleWrapper } from './ProjectSelector/style';
import UserMenu from './UserMenu';
import ProjectTitle from './ProjectTitle';
import MenuList from './MenuList';
import { DmsApi } from '@actiontech/shared/lib/api';
import { IBindProject } from './ProjectSelector/index.type';
import EventEmitter from '../../../utils/EventEmitter';
import EmitterKey from '../../../data/EmitterKey';
import { useDispatch } from 'react-redux';
import { updateBindProjects } from '../../../store/user';
import { updateAvailabilityZoneTips } from '../../../store/availabilityZone';
import { FlagFilled, LockOutlined } from '@actiontech/icons';
import QuickActions from './QuickActions';
import { useTypedNavigate } from '@actiontech/shared';
import { CustomSelectProps, ROUTE_PATHS } from '@actiontech/dms-kit';
import AvailabilityZoneSelector from './AvailabilityZoneSelector';
import { ProjectTitleStyleWrapper } from './style';
import { ResponseCode } from '@actiontech/dms-kit';
import { EmptyBox } from '@actiontech/dms-kit';
import useRecentlySelectedZone from '@actiontech/dms-kit/es/features/useRecentlySelectedZone';
import useFetchPermissionData from '../../../hooks/useFetchPermissionData';
import { updateUserOperationPermissions } from '../../../store/permission';
import sharedEmitterKey from '@actiontech/dms-kit/es/data/EmitterKey';
import { eventEmitter as sharedEventEmitter } from '@actiontech/dms-kit/es/utils/EventEmitter';

const SideMenu: React.FC = () => {
  const navigate = useTypedNavigate();
  const dispatch = useDispatch();
  const { userOperationPermissions } = usePermission();
  const { fetchUserPermissions, isUserPermissionsLoading } =
    useFetchPermissionData();
  const {
    verifyRecentlySelectedZoneRecord,
    setAvailabilityZone,
    availabilityZone,
    updateRecentlySelectedZone
  } = useRecentlySelectedZone();
  const [systemModuleRedDotsLoading, setSystemModuleRedDotsLoading] =
    useState(false);
  const { username, theme, updateTheme, bindProjects, language, userId } =
    useCurrentUser();
  const { recentlyProjects, currentProjectID, getRecentlyProjectId } =
    useRecentlyOpenedProjects();
  const {
    data: projectList,
    loading: getProjectListLoading,
    refresh: refreshProjectList
  } = useRequest(
    () =>
      DmsApi.ProjectService.ListProjectsV2({
        page_size: 9999
      }).then((res) => res?.data?.data ?? []),
    {
      refreshDeps: [currentProjectID],
      onSuccess: (res) => {
        const newBindProjects = bindProjects.map((item) => {
          const archived =
            res.find((project) => project.uid === item.project_id)?.archived ??
            false;
          return {
            ...item,
            archived
          };
        });
        dispatch(
          updateBindProjects({
            bindProjects: newBindProjects
          })
        );
      }
    }
  );

  const {
    data: zoneTips,
    loading: getZoneTipsLoading,
    refresh: refreshZoneTips
  } = useRequest(
    () =>
      DmsApi.GatewayService.GetGatewayTips().then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          return res.data.data;
        }
        return [];
      }),
    {
      onSuccess: (res) => {
        verifyRecentlySelectedZoneRecord(res ?? []);
        dispatch(
          updateAvailabilityZoneTips({
            availabilityZoneTips: res ?? []
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
      params: {
        projectID
      }
    });
  };
  useEffect(() => {
    const id = getRecentlyProjectId();
    if (!!id && !userOperationPermissions && !isUserPermissionsLoading) {
      fetchUserPermissions(id, userId).then((response) => {
        if (response.data.code === ResponseCode.SUCCESS) {
          dispatch(updateUserOperationPermissions(response.data.data));
        }
      });
    }
  }, [
    dispatch,
    fetchUserPermissions,
    getRecentlyProjectId,
    userId,
    userOperationPermissions,
    isUserPermissionsLoading
  ]);
  useEffect(() => {
    const { unsubscribe } = EventEmitter.subscribe(
      EmitterKey.Refresh_Availability_Zone_Selector,
      refreshZoneTips
    );
    return unsubscribe;
  }, [refreshZoneTips]);

  useEffect(() => {
    const { unsubscribe } = sharedEventEmitter.subscribe(
      sharedEmitterKey.DMS_SYNC_CURRENT_AVAILABILITY_ZONE,
      setAvailabilityZone
    );
    return unsubscribe;
  }, [setAvailabilityZone]);

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
        <Spin
          spinning={
            getProjectListLoading ||
            systemModuleRedDotsLoading ||
            getZoneTipsLoading
          }
        >
          <ProjectTitleStyleWrapper>
            <ProjectTitle />
            <EmptyBox if={!!zoneTips?.length}>
              <AvailabilityZoneSelector
                zoneTips={zoneTips}
                availabilityZone={availabilityZone}
                updateRecentlySelectedZone={updateRecentlySelectedZone}
              />
            </EmptyBox>
          </ProjectTitleStyleWrapper>
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
