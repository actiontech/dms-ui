import { render, renderHook as renderHookReact } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MutableSnapshot, RecoilRoot } from 'recoil';
import { MemoryRouter, MemoryRouterProps } from 'react-router-dom';
import { ConfigProvider, theme as antdTheme } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { storeFactory } from './mockRedux';
import { ThemeProvider } from '@mui/system';
import { StyledEngineProvider } from '@mui/material/styles';
import lightTheme from '../theme/light';
import { ToolkitStore } from '@reduxjs/toolkit/dist/configureStore';

export type RenderParams = Parameters<typeof render>;

export type RecoilRootPropsCustom = {
  initializeState?: (mutableSnapshot: MutableSnapshot) => void;
  override?: boolean;
};

export interface WrapperOptions {
  routerProps?: MemoryRouterProps;
  storeFactory?: (initStore: any) => ToolkitStore;
  initStore?: any;
  recoilRootProps?: RecoilRootPropsCustom;
  theme?: any;
  otherChildren?: React.ReactNode;
}

export const createTestWrapper = (options?: WrapperOptions) => {
  const {
    routerProps,
    storeFactory: customStoreFactory,
    initStore,
    recoilRootProps,
    theme = lightTheme,
    otherChildren
  } = options || {};

  return ({ children }: { children: React.ReactNode }) => {
    const themeComponent = (
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    );

    const store = customStoreFactory
      ? customStoreFactory(initStore)
      : storeFactory(initStore);

    return (
      <ConfigProvider
        locale={zhCN}
        theme={{ algorithm: antdTheme.defaultAlgorithm, hashed: false }}
      >
        <RecoilRoot {...recoilRootProps}>
          <Provider store={store}>
            <MemoryRouter {...routerProps}>
              <StyledEngineProvider injectFirst>
                {themeComponent}
                {otherChildren}
              </StyledEngineProvider>
            </MemoryRouter>
          </Provider>
        </RecoilRoot>
      </ConfigProvider>
    );
  };
};

export const superRender = (
  ...[ui, option, options]: [...RenderParams, WrapperOptions?]
) => {
  const wrapper = createTestWrapper(options);

  return render(ui, {
    wrapper,
    ...option
  });
};

export const superRenderHook = <TProps, TResult>(
  hook: (props: TProps) => TResult,
  renderHookOptions?: Omit<
    Parameters<typeof renderHookReact<TProps, TResult>>[1],
    'wrapper'
  >,
  wrapperOptions?: WrapperOptions
) => {
  const wrapper = createTestWrapper(wrapperOptions);

  return renderHookReact(hook, {
    ...renderHookOptions,
    wrapper
  });
};
