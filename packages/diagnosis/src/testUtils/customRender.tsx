import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, MemoryRouterProps } from 'react-router-dom';
import { Dictionary } from '@actiontech/shared/lib/types/common.type';
import { storeFactory } from './mockRedux';
import { StyledEngineProvider, ThemeProvider } from '@mui/system';
import { mount } from 'enzyme';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';

import lightTheme from '../theme/light';
import sharedTheme from '@actiontech/shared/lib/theme/light';

type MountParams = Parameters<typeof mount>;
type RenderParams = Parameters<typeof render>;

export const renderWithReduxAndTheme = (
  ...[ui, option, initStore]: [...RenderParams, Dictionary?]
) => {
  return render(ui, {
    wrapper: ({ children }) => (
      <ThemeProvider theme={{ ...lightTheme, ...sharedTheme }}>
        <Provider store={storeFactory(initStore)}>{children}</Provider>
      </ThemeProvider>
    ),
    ...Option
  });
};

export const renderWithTheme = (...[ui, option]: [...RenderParams]) => {
  return render(
    <ThemeProvider theme={{ ...lightTheme, ...sharedTheme }}>
      {ui}
    </ThemeProvider>,
    option
  );
};

export const renderWithThemeAndRouter = (
  ...[ui, option, props]: [...RenderParams, MemoryRouterProps?]
) => {
  return render(
    <MemoryRouter {...props}>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={{ ...lightTheme, ...sharedTheme }}>
          {ui}
        </ThemeProvider>
      </StyledEngineProvider>
    </MemoryRouter>,
    option
  );
};

export const superRender = (
  ...[ui, option, otherProps]: [
    ...RenderParams,
    {
      routerProps?: MemoryRouterProps;
      initStore?: any;
    }?
  ]
) => {
  const renderReturn = render(ui, {
    wrapper: ({ children }) => {
      return (
        <ConfigProvider locale={zhCN}>
          <ThemeProvider theme={{ ...lightTheme, ...sharedTheme }}>
            <MemoryRouter {...otherProps?.routerProps}>
              <Provider store={storeFactory(otherProps?.initStore)}>
                {children}
              </Provider>
            </MemoryRouter>
          </ThemeProvider>
        </ConfigProvider>
      );
    },
    ...option
  });
  return renderReturn;
};

export const mountWithTheme = (...[ui, option]: [...MountParams]) => {
  return mount(ui, {
    ...option,
    wrappingComponent: ThemeProvider,
    wrappingComponentProps: {
      theme: { ...lightTheme, ...sharedTheme }
    }
  });
};
