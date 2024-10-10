import { ReactNode, Suspense, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useRoutes } from 'react-router-dom';
import { AuthRouterConfig, unAuthRouterConfig } from './router/router';
import { IReduxState } from './store';
import { useSelector } from 'react-redux';
import SyncRecoil from 'provision/src/utils/SyncRecoil';
import { StyledEngineProvider, ThemeProvider } from '@mui/system';
import { EmptyBox, HeaderProgress, SpinIndicator } from '@actiontech/shared';
import {
  useChangeTheme,
  useNotificationContext
} from '@actiontech/shared/lib/hooks';
import {
  SupportLanguage,
  SupportTheme,
  UserRolesType
} from '@actiontech/shared/lib/enum';
import Nav from './page/Nav';
import {
  useCurrentUser,
  useDbServiceDriver,
  useFeaturePermission,
  useCurrentPermission
} from '@actiontech/shared/lib/global';
import useSessionUser from './hooks/useSessionUser';
import { ConfigProvider, Spin, theme as antdTheme } from 'antd';
import { ThemeData } from './theme';
import {
  StyleProvider,
  legacyLogicalPropertiesTransformer
} from '@ant-design/cssinjs';
import { DMS_REDIRECT_KEY_PARAMS_NAME } from '@actiontech/shared/lib/data/common';
import { useRequest } from 'ahooks';
import BasicInfo from '@actiontech/shared/lib/api/base/service/BasicInfo';
import useSystemConfig from './hooks/useSystemConfig';
import { RouterConfigItem } from '@actiontech/shared/lib/types/common.type';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import updateLocale from 'dayjs/plugin/updateLocale';
import { PermissionReduxState } from '@actiontech/shared/lib/types/common.type';
import i18n from './locale';
import antd_zh_CN from 'antd/locale/zh_CN';
import antd_en_US from 'antd/locale/en_US';

import './index.less';

dayjs.extend(updateLocale);
dayjs.updateLocale('zh-cn', {
  weekStart: 0
});

Spin.setDefaultIndicator(<SpinIndicator />);

//fix  https://github.com/actiontech/sqle/issues/1350
export const Wrapper: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [initRenderApp, setInitRenderApp] = useState<boolean>(true);
  const token = useSelector<IReduxState, string>((state) => state.user.token);
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    if (!initRenderApp) {
      return;
    }
    setInitRenderApp(false);
    if (!token && !['/login', '/user/bind'].includes(location.pathname)) {
      navigate(`/login?${DMS_REDIRECT_KEY_PARAMS_NAME}=${location.pathname}`, {
        replace: true
      });
    }
  }, [initRenderApp, location.pathname, navigate, token]);
  return <>{!initRenderApp && children}</>;
};

function App() {
  const { token } = useSelector((state: IReduxState) => ({
    token: state.user.token
  }));

  const { notificationContextHolder } = useNotificationContext();

  const { getUserBySession } = useSessionUser();

  const {
    userInfoFetched,
    theme,
    userRoles,
    language: currentLanguage
  } = useCurrentUser();

  const antdLanguage =
    currentLanguage === SupportLanguage.enUS ? antd_en_US : antd_zh_CN;

  const { driverInfoFetched, updateDriverList } = useDbServiceDriver();
  const { updateFeaturePermission, featurePermissionFetched } =
    useFeaturePermission();
  const currentPermissions = useCurrentPermission();

  // #if [ee]
  const { syncWebTitleAndLogo } = useSystemConfig();
  useRequest(
    () =>
      BasicInfo.GetBasicInfo().then((res) => {
        if (res.data.data) {
          syncWebTitleAndLogo(res.data.data);
        }
      }),
    {
      ready: !!token
    }
  );
  // #endif

  const AuthRouterConfigData = useMemo(() => {
    const filterRoutesByRole: (
      routes: RouterConfigItem[],
      roles: UserRolesType,
      permissions: PermissionReduxState
    ) => RouterConfigItem[] = (routes, roles, permissions) => {
      return routes.reduce(
        (filtered: RouterConfigItem[], route: RouterConfigItem) => {
          let currentRote: RouterConfigItem | undefined = undefined;
          if (
            (!route.permission && !route.role) ||
            (Array.isArray(route.role) &&
              route.role.some((r) => r && roles[r])) ||
            (route.permission && route.permission.every((p) => permissions[p]))
          ) {
            currentRote = route;
          }

          if (
            route.children &&
            Array.isArray(route.children) &&
            route.children.length &&
            !route.permission &&
            !route.role
          ) {
            currentRote = {
              ...route,
              children: filterRoutesByRole(route.children, roles, permissions)
            };
          }
          currentRote && filtered.push(currentRote);
          return filtered;
        },
        []
      );
    };

    return filterRoutesByRole(AuthRouterConfig, userRoles, currentPermissions);
  }, [currentPermissions, userRoles]);

  const elements = useRoutes(token ? AuthRouterConfigData : unAuthRouterConfig);
  useChangeTheme();

  const themeData = useMemo(() => {
    return ThemeData[theme];
  }, [theme]);

  const body = useMemo(() => {
    if (!userInfoFetched || !driverInfoFetched || !featurePermissionFetched) {
      return <HeaderProgress />;
    }

    return (
      <Nav>
        <Suspense fallback={<HeaderProgress />}>{elements}</Suspense>
      </Nav>
    );
  }, [userInfoFetched, driverInfoFetched, featurePermissionFetched, elements]);

  useEffect(() => {
    if (token) {
      getUserBySession({});
      updateDriverList();
      updateFeaturePermission();
    }
  }, [getUserBySession, token, updateDriverList, updateFeaturePermission]);

  useEffect(() => {
    i18n.changeLanguage(currentLanguage);
  }, [currentLanguage]);

  return (
    <Wrapper>
      <StyleProvider
        hashPriority="high"
        transformers={[legacyLogicalPropertiesTransformer]}
      >
        <ConfigProvider
          locale={antdLanguage}
          theme={{
            algorithm:
              theme === SupportTheme.DARK
                ? antdTheme.darkAlgorithm
                : antdTheme.defaultAlgorithm,
            token: {
              fontFamily: `PlusJakartaSans Medium, -apple-system, 'Microsoft YaHei', BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
  'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',
  'Noto Color Emoji'`,
              fontSize: 14,
              colorInfo: themeData.sharedTheme.uiToken.colorInfo,
              colorPrimary: themeData.sharedTheme.uiToken.colorPrimary,
              colorSuccess: themeData.sharedTheme.uiToken.colorSuccess,
              colorWarning: themeData.sharedTheme.uiToken.colorWarning,
              colorError: themeData.sharedTheme.uiToken.colorError,
              colorTextBase: themeData.sharedTheme.uiToken.colorTextBase,
              colorBgBase: themeData.sharedTheme.uiToken.colorBgBase,
              colorText: themeData.sharedTheme.uiToken.colorText,
              colorTextSecondary:
                themeData.sharedTheme.uiToken.colorTextSecondary,
              colorTextTertiary:
                themeData.sharedTheme.uiToken.colorTextTertiary,
              colorTextQuaternary:
                themeData.sharedTheme.uiToken.colorTextQuaternary,
              colorBorderSecondary:
                themeData.sharedTheme.uiToken.colorBorderSecondary,
              colorBorder: themeData.sharedTheme.uiToken.colorBorder,
              colorFill: themeData.sharedTheme.uiToken.colorFill,
              colorFillSecondary:
                themeData.sharedTheme.uiToken.colorFillSecondary,
              colorFillTertiary:
                themeData.sharedTheme.uiToken.colorFillTertiary,
              colorFillQuaternary:
                themeData.sharedTheme.uiToken.colorFillQuaternary,
              colorBgLayout: themeData.sharedTheme.uiToken.colorBgLayout,
              colorWarningBgHover:
                themeData.sharedTheme.uiToken.colorWarningBgHover,
              colorErrorBgHover: themeData.sharedTheme.uiToken.colorErrorBgHover
            }
          }}
        >
          <SyncRecoil />
          <StyledEngineProvider injectFirst>
            <ThemeProvider theme={themeData}>
              {notificationContextHolder}
              <EmptyBox if={!!token} defaultNode={<>{elements}</>}>
                {body}
              </EmptyBox>
            </ThemeProvider>
          </StyledEngineProvider>
        </ConfigProvider>
      </StyleProvider>
    </Wrapper>
  );
}

export default App;
