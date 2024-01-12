import {
  RenderResult,
  render,
  renderHook as renderHookByReact
} from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import {
  BrowserRouter,
  Router,
  RouterProps,
  MemoryRouter,
  MemoryRouterProps,
  useLocation
} from 'react-router-dom';
import { Provider } from 'react-redux';
import { storeFactory } from './mockRedux';
import { ConfigProvider, theme as antdTheme } from 'antd';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import { mount, shallow } from 'enzyme';
import zhCN from 'antd/locale/zh_CN';
import { Dictionary } from '@actiontech/shared/lib/types/common.type';

import sharedTheme from '@actiontech/shared/lib/theme/light';
import lightTheme from '../theme/light';

type RenderParams = Parameters<typeof render>;
type MountParams = Parameters<typeof mount>;
type ShallowParams = Parameters<typeof shallow>;

const themeData = {
  ...sharedTheme,
  ...lightTheme
};

export const renderWithRouter = (...[ui, option]: [...RenderParams]) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>, option);
};

export const renderWithRouterAndRedux = (
  ...[ui, option, initStore]: [...RenderParams, Dictionary?]
) => {
  return render(
    <BrowserRouter>
      <Provider store={storeFactory(initStore)}>{ui}</Provider>
    </BrowserRouter>,
    option
  );
};

export const renderWithRedux = (
  ...[ui, option, initStore]: [...RenderParams, Dictionary?]
) => {
  return render(
    <Provider store={storeFactory(initStore)}>{ui}</Provider>,
    option
  );
};

export const renderHooksWithRedux = <TProps, TResult>(
  hooks: (props: TProps) => TResult,
  storeState: Dictionary = {}
) => {
  return renderHook(hooks, {
    wrapper: Provider,
    initialProps: {
      store: storeFactory(storeState)
    }
  } as any);
};

export const renderHooksWithTheme = <TProps, TResult>(
  hooks: (props: TProps) => TResult
) => {
  return renderHookByReact(hooks, {
    wrapper: ({ children }) => (
      <ConfigProvider
        locale={zhCN}
        theme={{ algorithm: antdTheme.defaultAlgorithm }}
      >
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={lightTheme}>{children}</ThemeProvider>
        </StyledEngineProvider>
      </ConfigProvider>
    )
  });
};

export const renderWithTheme = (...[ui, option]: [...RenderParams]) => {
  return render(
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={themeData}>{ui}</ThemeProvider>
    </StyledEngineProvider>,
    option
  );
};

export const renderWithThemeAndRedux = (
  ...[ui, option, initStore]: [...RenderParams, Dictionary?]
) => {
  return render(
    <Provider store={storeFactory(initStore)}>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={themeData}>{ui}</ThemeProvider>
      </StyledEngineProvider>
    </Provider>,
    option
  );
};

export const renderWithThemeAndServerRouter = (
  ...[ui, option, props]: [...RenderParams, RouterProps]
) => {
  return render(
    <Router {...props}>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={themeData}>{ui}</ThemeProvider>
      </StyledEngineProvider>
    </Router>,
    option
  );
};

export const renderWithThemeAndRouter = (
  ...[ui, option, props]: [...RenderParams, MemoryRouterProps?]
) => {
  return render(
    <MemoryRouter {...props}>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={themeData}>{ui}</ThemeProvider>
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
        <Provider store={storeFactory(otherProps?.initStore)}>
          <MemoryRouter {...otherProps?.routerProps}>
            <StyledEngineProvider injectFirst>
              <ThemeProvider theme={themeData}>{children}</ThemeProvider>
            </StyledEngineProvider>
          </MemoryRouter>
        </Provider>
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
      theme: themeData
    }
  });
};

export const shallowWithRouter = (...[ui, option]: [...ShallowParams]) => {
  return shallow(ui, {
    ...option,
    wrappingComponent: MemoryRouter
  });
};

export const renderLocationDisplay = (): [
  () => RenderResult,
  () => JSX.Element
] => {
  const LocationComponent = () => {
    const location = useLocation();

    return <div data-testid="location-display">{location.pathname}</div>;
  };

  return [() => renderWithRouter(<LocationComponent />), LocationComponent];
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
        <Provider store={storeFactory(otherProps?.initStore)}>
          <MemoryRouter {...otherProps?.routerProps}>
            <ThemeProvider theme={themeData}>{children}</ThemeProvider>
          </MemoryRouter>
        </Provider>
      );
    },
    ...option
  });
  return renderReturn;
};
