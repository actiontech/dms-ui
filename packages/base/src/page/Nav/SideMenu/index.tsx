import {
  CEModeProjectWrapperStyleWrapper,
  SideMenuStyleWrapper
} from './style';
import ProjectSelector from './ProjectSelector';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCallback, useMemo } from 'react';
import { useBoolean } from 'ahooks';
import { sideMenuData } from './menu.data';
import useRecentlyOpenedProjects from './useRecentlyOpenedProjects';
import { Menu, MenuProps, SelectProps, Typography } from 'antd5';
import { useCurrentUser } from '@actiontech/shared/lib/global';
import { ProjectSelectorLabelStyleWrapper } from './ProjectSelector/style';
import { SubMenuType } from 'antd5/es/menu/hooks/useItems';
import { CustomSelectProps } from '@actiontech/shared/lib/components/CustomSelect';
import UserNavigate from './UserNavigate';
import GlobalSetting from './GlobalSetting';
import VersionModal from './VersionModal';
import { IconProjectFlag } from '@actiontech/shared/lib/Icon/common';
import {
  DEFAULT_PROJECT_ID,
  DEFAULT_PROJECT_NAME
} from '@actiontech/shared/lib/data/common';
import useSystemConfig from '../../../hooks/useSystemConfig.tsx';
import { SIDE_MENU_DATA_PLACEHOLDER_KEY } from './menus/common';
import { LockOutlined } from '@ant-design/icons';

export const SideMenu: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  let currentProjectID = '';

  const [
    versionModalOpen,
    { setTrue: setVersionModalOpen, setFalse: setVersionModalClose }
  ] = useBoolean();

  const { renderWebTitle } = useSystemConfig();

  const { username, theme, updateTheme, isAdmin } = useCurrentUser();

  /* IFTRUE_isEE */
  const { recentlyProjects, currentProjectID: id } =
    useRecentlyOpenedProjects();

  currentProjectID = id ?? '';

  const projectSelectorOptions = useMemo<SelectProps['options']>(() => {
    return recentlyProjects.map((v) => {
      return {
        value: v.project_id,
        label: (
          <ProjectSelectorLabelStyleWrapper>
            {/* <IconProjectFlag /> */}
            <LockOutlined size={18} />

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
  /* FITRUE_isEE */

  /* IFTRUE_isCE */
  currentProjectID = DEFAULT_PROJECT_ID;
  /* FITRUE_isCE */

  const menuItems = useMemo(
    () => sideMenuData(navigate, isAdmin, currentProjectID),
    [navigate, isAdmin, currentProjectID]
  );

  const selectMenu = useCallback(
    (config: MenuProps['items'] = [], pathname: string): string[] => {
      for (const route of config) {
        if (!route) {
          return [];
        }
        const realPath = `/${route?.key}`.replace(
          SIDE_MENU_DATA_PLACEHOLDER_KEY,
          currentProjectID ?? ''
        );
        if (realPath === pathname) {
          return [(route.key as string) ?? ''];
        }
        if (route) {
          const children = (route as SubMenuType).children;
          if (children) {
            const keys = selectMenu(children, pathname);
            if (keys.length > 0) {
              return keys;
            }
          }
        }
      }
      return [];
    },
    [currentProjectID]
  );

  const selectMenuWrapper = useMemo((): string[] => {
    let pathname = location.pathname;
    let selectKey: string[] = [];
    while (pathname.length > 0) {
      selectKey = selectMenu(menuItems, pathname);
      if (selectKey.length !== 0) {
        return selectKey;
      } else {
        const temp = pathname.split('/');
        temp.pop();
        pathname = temp.join('/');
      }
    }
    return selectKey;
  }, [location.pathname, menuItems, selectMenu]);

  return (
    <SideMenuStyleWrapper className="dms-layout-side">
      <div className="dms-layout-side-start">
        <div
          onClick={() => {
            navigate('/');
          }}
        >
          {renderWebTitle()}
        </div>

        {/* IFTRUE_isEE */}
        <ProjectSelector
          value={currentProjectID}
          onChange={projectSelectorChangeHandle}
          options={projectSelectorOptions}
        />
        {/* FITRUE_isEE */}

        {/* IFTRUE_isCE */}
        <CEModeProjectWrapperStyleWrapper>
          <IconProjectFlag />
          <Typography.Text className="default-project-name">
            {DEFAULT_PROJECT_NAME}
          </Typography.Text>
        </CEModeProjectWrapperStyleWrapper>
        {/* FITRUE_isCE */}

        <Menu
          className="custom-menu"
          mode="inline"
          items={menuItems}
          selectedKeys={selectMenuWrapper}
        />
      </div>

      <div className="dms-layout-side-end">
        <UserNavigate
          username={username}
          setVersionModalOpen={setVersionModalOpen}
        />
        <GlobalSetting
          theme={theme}
          updateTheme={updateTheme}
          isAdmin={isAdmin}
        />
      </div>

      <VersionModal
        open={versionModalOpen}
        setVersionModalClose={setVersionModalClose}
      />
    </SideMenuStyleWrapper>
  );
};

export default SideMenu;
