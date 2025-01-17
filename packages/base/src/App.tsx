import { ReactNode, Suspense, useEffect, useMemo, useState } from 'react';
import { RouteObject, useLocation, useRoutes } from 'react-router-dom';
import { AuthRouterConfig, unAuthRouterConfig } from './router/router';
import { IReduxState } from './store';
import { useSelector } from 'react-redux';
import { StyledEngineProvider, ThemeProvider } from '@mui/system';
import {
  EmptyBox,
  HeaderProgress,
  SpinIndicator,
  useTypedNavigate
} from '@actiontech/shared';
import { useNotificationContext } from '@actiontech/shared/lib/hooks';
import {
  ResponseCode,
  SupportLanguage,
  SupportTheme
} from '@actiontech/shared/lib/enum';
import Nav from './page/Nav';
import {
  useChangeTheme,
  useCurrentUser,
  useDbServiceDriver,
  usePermission
} from '@actiontech/shared/lib/features';
import useSessionUser from './hooks/useSessionUser';
import { ConfigProvider, Spin, theme as antdTheme } from 'antd';
import { ThemeData } from './theme';
import {
  StyleProvider,
  legacyLogicalPropertiesTransformer
} from '@ant-design/cssinjs';
import { useRequest } from 'ahooks';
import BasicInfo from '@actiontech/shared/lib/api/base/service/BasicInfo';
import useSystemConfig from './hooks/useSystemConfig';
import { RouterConfigItem } from '@actiontech/shared/lib/types/common.type';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import updateLocale from 'dayjs/plugin/updateLocale';
import i18n from './locale';
import antd_zh_CN from 'antd/locale/zh_CN';
import antd_en_US from 'antd/locale/en_US';
import useFetchPermissionData from './hooks/useFetchPermissionData';
import { useDispatch } from 'react-redux';
import { updateModuleFeatureSupport } from './store/permission';
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';
import useSyncDmsCloudBeaverChannel from './hooks/useSyncDmsCloudBeaverChannel';
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
  const navigate = useTypedNavigate();
  useEffect(() => {
    if (!initRenderApp) {
      return;
    }
    setInitRenderApp(false);
    if (
      !token &&
      !(
        location.pathname === ROUTE_PATHS.BASE.LOGIN.index.path ||
        location.pathname === ROUTE_PATHS.BASE.USER_BIND.index.path
      )
    ) {
      const currentPath = location.pathname;
      const currentSearch = location.search;

      const fullPath = currentSearch
        ? `${currentPath}${currentSearch}`
        : currentPath;

      navigate(ROUTE_PATHS.BASE.LOGIN.index, {
        queries: { target: encodeURIComponent(fullPath) },
        replace: true
      });
    }
  }, [initRenderApp, location.pathname, location.search, navigate, token]);
  return <>{!initRenderApp && children}</>;
};

function App() {
  const { token } = useSelector((state: IReduxState) => ({
    token: state.user.token
  }));

  const dispatch = useDispatch();

  const { notificationContextHolder } = useNotificationContext();

  const { getUserBySession } = useSessionUser();

  const {
    isUserInfoFetched,
    theme,
    language: currentLanguage
  } = useCurrentUser();

  const { fetchModuleSupportStatus, isFeatureSupportFetched } =
    useFetchPermissionData();

  const antdLanguage =
    currentLanguage === SupportLanguage.enUS ? antd_en_US : antd_zh_CN;

  const { isDriverInfoFetched, updateDriverList } = useDbServiceDriver();

  const { checkPagePermission } = usePermission();

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
    const filterRoutesByPermission: (
      routes: RouterConfigItem[]
    ) => RouterConfigItem[] = (routes) => {
      const verifiedRoutes: RouterConfigItem[] = [];
      return routes.reduce((acc, route) => {
        if (route.permission && !checkPagePermission(route.permission)) {
          return acc;
        }
        if (route.children) {
          acc.push({
            ...route,
            children: filterRoutesByPermission(route.children)
          });
          return acc;
        }
        acc.push(route);
        return acc;
      }, verifiedRoutes);
    };

    if (isUserInfoFetched && isFeatureSupportFetched) {
      return filterRoutesByPermission(AuthRouterConfig);
    }
    return AuthRouterConfig;
  }, [checkPagePermission, isFeatureSupportFetched, isUserInfoFetched]);

  const elements = useRoutes(
    token ? (AuthRouterConfigData as RouteObject[]) : unAuthRouterConfig
  );
  useChangeTheme();

  const themeData = useMemo(() => {
    return ThemeData[theme];
  }, [theme]);

  const body = useMemo(() => {
    if (
      !isUserInfoFetched ||
      !isDriverInfoFetched ||
      !isFeatureSupportFetched
    ) {
      return <HeaderProgress />;
    }
    return (
      <Nav>
        <Suspense fallback={<HeaderProgress />}>{elements}</Suspense>
      </Nav>
    );
  }, [
    isUserInfoFetched,
    isDriverInfoFetched,
    isFeatureSupportFetched,
    elements
  ]);

  useEffect(() => {
    if (token) {
      getUserBySession({});
      updateDriverList();
      fetchModuleSupportStatus().then((response) => {
        if (response.data.code === ResponseCode.SUCCESS) {
          dispatch(
            updateModuleFeatureSupport({
              sqlOptimization: !!response.data.data?.is_supported
            })
          );
        }
      });
    }
  }, [
    getUserBySession,
    token,
    updateDriverList,
    fetchModuleSupportStatus,
    dispatch
  ]);

  useEffect(() => {
    i18n.changeLanguage(currentLanguage);
  }, [currentLanguage]);

  useSyncDmsCloudBeaverChannel();

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
