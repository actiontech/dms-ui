import { Suspense, useEffect, useMemo } from 'react';
import { useRoutes } from 'react-router-dom';
import {
  AuthRouterConfig,
  RouterConfigItem,
  unAuthRouterConfig
} from './router/router';
import { IReduxState } from './store';
import { useDispatch, useSelector } from 'react-redux';
import { StyledEngineProvider, ThemeProvider } from '@mui/system';
import { EmptyBox, HeaderProgress } from '@actiontech/shared';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import zhCN5 from 'antd5/locale/zh_CN';
import {
  useChangeTheme,
  useNotificationContext
} from '@actiontech/shared/lib/hooks';
import { updateTheme } from './store/user';
import { SupportTheme, SystemRole } from '@actiontech/shared/lib/enum';
import Nav from './page/Nav';
import { useCurrentUser } from '@actiontech/shared/lib/global';
import useSessionUser from './hooks/useSessionUser';
import {
  ConfigProvider as ConfigProviderV5,
  theme as antdTheme,
  Spin
} from 'antd5';
import './index.less';
import { IconSpin } from '@actiontech/shared/lib/Icon/common';
import { ThemeData } from './theme';
import {
  StyleProvider,
  legacyLogicalPropertiesTransformer
} from '@ant-design/cssinjs';
import { ANTD_PREFIX_STR } from '@actiontech/shared/lib/data/common';
import { useRequest } from 'ahooks';
import dms from '@actiontech/shared/lib/api/base/service/dms';
import useSystemConfig from './hooks/useSystemConfig.tsx';

Spin.setDefaultIndicator(<IconSpin />);

function App() {
  const { token, theme, role } = useSelector((state: IReduxState) => ({
    token: state.user.token,
    userUid: state.user.uid,
    theme: state.user.theme,
    role: state.user.role
  }));

  const { notificationContextHolder } = useNotificationContext();

  const dispatch = useDispatch();

  const { getUserBySession } = useSessionUser();

  const { useInfoFetched } = useCurrentUser();

  /* IFTRUE_isEE */
  const { syncWebTitleAndLogo } = useSystemConfig();
  useRequest(
    () =>
      dms.GetBasicInfo().then((res) => {
        const basicInfoRes = res.data.data;

        if (basicInfoRes) syncWebTitleAndLogo(basicInfoRes);
      }),
    {
      ready: !!token
    }
  );
  /* FITRUE_isEE */

  const filterRoutesByRole: (
    routes: RouterConfigItem[],
    targetRole: SystemRole | ''
  ) => RouterConfigItem[] = (
    routes: RouterConfigItem[],
    targetRole: SystemRole | ''
  ) => {
    return routes.reduce(
      (filtered: RouterConfigItem[], route: RouterConfigItem) => {
        let currentRote: RouterConfigItem | undefined = undefined;
        if (
          !route.role ||
          (Array.isArray(route.role) && route.role.includes(targetRole))
        ) {
          currentRote = route;
        }
        if (
          route.children &&
          Array.isArray(route.children) &&
          route.children.length
        ) {
          currentRote = {
            ...route,
            children: filterRoutesByRole(route.children, targetRole)
          };
        }
        currentRote && filtered.push(currentRote);
        return filtered;
      },
      []
    );
  };
  const AuthRouterConfigData = useMemo(() => {
    const isAdmin: boolean = role === SystemRole.admin;
    if (isAdmin) {
      return AuthRouterConfig;
    }
    return filterRoutesByRole(AuthRouterConfig, role);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);

  const elements = useRoutes(token ? AuthRouterConfigData : unAuthRouterConfig);
  useChangeTheme({
    theme,
    updateTheme: (_theme: SupportTheme) =>
      dispatch(updateTheme({ theme: _theme }))
  });

  const themeData = useMemo(() => {
    return ThemeData[theme];
  }, [theme]);

  const body = useMemo(() => {
    if (!useInfoFetched) {
      return <HeaderProgress />;
    }

    return (
      <Nav>
        <Suspense fallback={<HeaderProgress />}>{elements}</Suspense>
      </Nav>
    );
  }, [useInfoFetched, elements]);

  useEffect(() => {
    if (token) {
      getUserBySession({});
    }
  }, [getUserBySession, token]);

  return (
    <StyleProvider
      hashPriority="high"
      transformers={[legacyLogicalPropertiesTransformer]}
    >
      <ConfigProviderV5
        locale={zhCN5}
        prefixCls={ANTD_PREFIX_STR}
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
            colorTextTertiary: themeData.sharedTheme.uiToken.colorTextTertiary,
            colorTextQuaternary:
              themeData.sharedTheme.uiToken.colorTextQuaternary,
            colorBorderSecondary:
              themeData.sharedTheme.uiToken.colorBorderSecondary,
            colorBorder: themeData.sharedTheme.uiToken.colorBorder,
            colorFill: themeData.sharedTheme.uiToken.colorFill,
            colorFillSecondary:
              themeData.sharedTheme.uiToken.colorFillSecondary,
            colorFillTertiary: themeData.sharedTheme.uiToken.colorFillTertiary,
            colorFillQuaternary:
              themeData.sharedTheme.uiToken.colorFillQuaternary,
            colorBgLayout: themeData.sharedTheme.uiToken.colorBgLayout,
            colorWarningBgHover:
              themeData.sharedTheme.uiToken.colorWarningBgHover,
            colorErrorBgHover: themeData.sharedTheme.uiToken.colorErrorBgHover
          }
        }}
      >
        <ConfigProvider locale={zhCN}>
          <StyledEngineProvider injectFirst>
            <ThemeProvider theme={themeData}>
              {notificationContextHolder}
              <EmptyBox if={!!token} defaultNode={<>{elements}</>}>
                {body}
              </EmptyBox>
            </ThemeProvider>
          </StyledEngineProvider>
        </ConfigProvider>
      </ConfigProviderV5>
    </StyleProvider>
  );
}

export default App;
