import { render, renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MutableSnapshot, RecoilRoot } from 'recoil';
import {
  BrowserRouter,
  Router,
  RouterProps,
  MemoryRouter,
  MemoryRouterProps
} from 'react-router-dom';
import { ConfigProvider, theme as antdTheme } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { Dictionary, IStore } from '../types/common.type';
import { storeFactory } from './mockRedux';
import { StyledEngineProvider, ThemeProvider } from '@mui/system';
import { mount } from 'enzyme';

import lightTheme from '../theme/light';

type MountParams = Parameters<typeof mount>;
type RenderParams = Parameters<typeof render>;
type RecoilRootPropsCustom = {
  initializeState?: (mutableSnapshot: MutableSnapshot) => void;
  override?: boolean;
};

export const renderWithRouter = (...[ui, option]: [...RenderParams]) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>, option);
};

export const renderWithServerRouter = (
  ...[ui, option, props]: [...RenderParams, RouterProps]
) => {
  return render(<Router {...props}>{ui}</Router>, option);
};

export const renderWithMemoryRouter = (
  ...[ui, option, props]: [...RenderParams, MemoryRouterProps?]
) => {
  return render(<MemoryRouter {...props}>{ui}</MemoryRouter>, option);
};

export const renderWithRedux = (
  ...[ui, option, initStore]: [...RenderParams, Dictionary?]
) => {
  return render(
    <Provider store={storeFactory(initStore)}>{ui}</Provider>,
    option
  );
};

export const renderWithReduxAndTheme = (
  ...[ui, option, initStore]: [...RenderParams, Dictionary?]
) => {
  return render(ui, {
    wrapper: ({ children }) => (
      <ThemeProvider theme={lightTheme}>
        <Provider store={storeFactory(initStore)}>{children}</Provider>
      </ThemeProvider>
    ),
    ...option
  });
};

export const renderHooksWithRedux = <TProps, TResult>(
  hooks: (props: TProps) => TResult,
  storeState: IStore
) => {
  return renderHook(hooks, {
    wrapper: ({ children }) => (
      <Provider store={storeFactory(storeState)}>{children}</Provider>
    )
  });
};

export const renderHooksWithReduxAndRouter = <TProps, TResult>(
  hooks: (props: TProps) => TResult,
  storeState: IStore
) => {
  return renderHook(hooks, {
    wrapper: ({ children }) => (
      <Provider store={storeFactory(storeState)}>
        <BrowserRouter>{children}</BrowserRouter>
      </Provider>
    )
  });
};

export const renderHooksWithTheme = <TProps, TResult>(
  hooks: (props: TProps) => TResult
) => {
  return renderHook(hooks, {
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
  return render(<ThemeProvider theme={lightTheme}>{ui}</ThemeProvider>, option);
};

export const renderWithThemeAndRouter = (
  ...[ui, option, props]: [...RenderParams, MemoryRouterProps?]
) => {
  return render(
    <MemoryRouter {...props}>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={lightTheme}>{ui}</ThemeProvider>
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
      recoilRootProps?: RecoilRootPropsCustom;
    }?
  ]
) => {
  const renderReturn = render(ui, {
    wrapper: ({ children }) => {
      return (
        <RecoilRoot {...otherProps?.recoilRootProps}>
          <Provider store={storeFactory(otherProps?.initStore)}>
            <MemoryRouter {...otherProps?.routerProps}>
              <ThemeProvider theme={lightTheme}>{children}</ThemeProvider>
            </MemoryRouter>
          </Provider>
        </RecoilRoot>
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
      theme: lightTheme
    }
  });
};
