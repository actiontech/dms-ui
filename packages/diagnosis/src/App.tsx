import { Suspense, useMemo } from 'react';
import { useRoutes } from 'react-router-dom';
import {
  diagnosisAuthRouterConfig,
  diagnosisUnAuthRouterConfig
} from './router';
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
import { SupportTheme } from '@actiontech/shared/lib/enum';
import Nav from './page/Nav';
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

Spin.setDefaultIndicator(<IconSpin />);

function App() {
  const { token, theme, role } = useSelector((state: IReduxState) => ({
    token: state.user.token,
    theme: state.user.theme,
    role: state.user.role
  }));

  // const { notificationContextHolder } = useNotificationContext();

  const dispatch = useDispatch();

  const elements = useRoutes(diagnosisAuthRouterConfig);
  // const elements = useRoutes(
  //   token ? diagnosisAuthRouterConfig : diagnosisUnAuthRouterConfig
  // );

  useChangeTheme({
    theme,
    updateTheme: (_theme: SupportTheme) =>
      dispatch(updateTheme({ theme: _theme }))
  });

  const themeData = useMemo(() => {
    return ThemeData[theme];
  }, [theme]);

  const body = useMemo(() => {
    return (
      <Nav>
        <Suspense fallback={<HeaderProgress />}>{elements}</Suspense>
      </Nav>
    );
  }, [elements]);

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
              <EmptyBox if={!token} defaultNode={<>{elements}</>}>
                {/* <EmptyBox if={!!token} defaultNode={<>{elements}</>}> */}
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
